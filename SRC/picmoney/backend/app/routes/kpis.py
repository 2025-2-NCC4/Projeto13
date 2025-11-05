from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from collections import defaultdict
from datetime import datetime
from ..db import db_engine, init_db
from app.db import engine

# ==============================================================
# 1) Blueprint (antes de qualquer rota)
# ==============================================================
bp = Blueprint("kpis", __name__, url_prefix="/api/kpis")

# ==============================================================
# 2) Helpers
# ==============================================================
def _engine():
    """Retorna engine do banco ou inicializa se não existir."""
    return db_engine or init_db(current_app.config["SETTINGS"].DATABASE_URL)

def _cols(conn, table):
    """Lista colunas de uma tabela (set de nomes)."""
    rows = conn.execute(text(f"PRAGMA table_info({table})")).all()
    return {r[1] for r in rows}

# ==============================================================
# 3) CEO – /summary (igual ao seu, com jsonify)
# ==============================================================
@bp.get("/summary")
def summary():
    eng = _engine()
    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")

        # helper para tratar número como REAL mesmo se vier "12.345,67"
        def NUM(col):
            # troca vírgula por ponto e faz CAST para REAL no SQLite
            return f"CAST(REPLACE({col}, ',', '.') AS REAL)"

        # 1) Detectar melhor coluna de valor (agora convertendo para REAL)
        candidatos_compra = ["valor_compra", "valor_total", "total_compra",
                             "valor_de_compra", "valor_da_compra", "valor_cupom"]
        counts = []
        for col in candidatos_compra:
            if col in tcols:
                cnt = conn.execute(text(
                    f"SELECT SUM(CASE WHEN {NUM(col)} > 0 THEN 1 ELSE 0 END) FROM transactions"
                )).scalar_one() or 0
                counts.append((col, int(cnt)))

        base_col, best_cnt = (None, 0)
        if counts:
            base_col, best_cnt = max(counts, key=lambda t: t[1])

        # Se nada teve >0, ainda assim escolha uma existente para somar
        if not base_col:
            for col in candidatos_compra:
                if col in tcols:
                    base_col = col
                    break

        receita_total = 0.0
        total_tx_valido = 0

        if base_col:
            receita_total = conn.execute(text(
                f"SELECT COALESCE(SUM({NUM(base_col)}),0) FROM transactions"
            )).scalar_one() or 0.0

            total_tx_valido = conn.execute(text(
                f"SELECT COALESCE(SUM(CASE WHEN {NUM(base_col)} > 0 THEN 1 ELSE 0 END),0) FROM transactions"
            )).scalar_one() or 0

        total_tx = conn.execute(text("SELECT COUNT(*) FROM transactions")).scalar_one() or 0

        # valor_cupons (opcional)
        valor_cupons = 0.0
        if "valor_cupom" in tcols:
            valor_cupons = conn.execute(text(
                f"SELECT COALESCE(SUM({NUM('valor_cupom')}),0) FROM transactions"
            )).scalar_one() or 0.0

        # nomes alternativos para clientes/lojas
        cliente_cands = ["numero_celular", "telefone", "celular", "phone"]
        loja_cands    = ["nome_loja", "loja", "merchant", "estabelecimento"]

        cliente_col = next((c for c in cliente_cands if c in tcols), None)
        loja_col    = next((c for c in loja_cands if c in tcols), None)

        clientes_unicos = conn.execute(text(
            f"SELECT COUNT(DISTINCT {cliente_col}) FROM transactions"
        )).scalar_one() if cliente_col else 0

        lojas_unicas = conn.execute(text(
            f"SELECT COUNT(DISTINCT {loja_col}) FROM transactions"
        )).scalar_one() if loja_col else 0

        # estimador de ticket (fallback) a partir de merchants
        ticket_estimado = None
        mcols = _cols(conn, "merchants")
        if total_tx_valido == 0 and "valor_compra" in mcols:
            ticket_estimado = conn.execute(text(
                f"SELECT AVG({NUM('valor_compra')}) FROM merchants WHERE {NUM('valor_compra')} > 0"
            )).scalar_one()

    ticket_medio = (float(receita_total) / float(total_tx_valido)) if total_tx_valido else float(ticket_estimado or 0.0)

    payload = {
        "base_col": base_col or "",
        "clientes_unicos": int(clientes_unicos or 0),
        "lojas_unicas": int(lojas_unicas or 0),
        "total_transacoes": int(total_tx or 0),
        "receita_total": float(receita_total or 0.0),
        "valor_cupons": float(valor_cupons or 0.0),
        "ticket_medio": float(ticket_medio),
        "ticket_medio_estimado": bool(total_tx_valido == 0 and ticket_estimado is not None),
    }
    return jsonify(payload), 200


@bp.route("/ceo", methods=["GET", "OPTIONS"])
def kpis_ceo():
    """
    KPIs e séries para o CEO com filtros e granularidade.
    Query params:
      - start, end: YYYY-MM-DD
      - group_by: day | week | month (default: week)
      - category: lista separada por vírgula (ex.: cat1,cat2)
      - merchant: lista separada por vírgula
    """
    # Resposta imediata a preflight CORS
    if request.method == "OPTIONS":
        return ("", 204)

    eng = _engine()
    start = request.args.get("start") or None
    end = request.args.get("end") or None
    group_by = (request.args.get("group_by") or "week").lower()
    if group_by not in ("day", "week", "month"):
        group_by = "week"

    # parse lists
    def parse_list(arg):
        if not arg:
            return []
        return [s.strip() for s in str(arg).split(",") if str(s).strip()]

    def fix_mojibake(s):
        try:
            if s is None:
                return ""
            s = str(s)
            if "Ã" in s or "Â" in s:
                try:
                    return s.encode("latin-1", errors="ignore").decode("utf-8", errors="ignore").strip()
                except Exception:
                    return s.strip()
            return s.strip()
        except Exception:
            return str(s or "")

    def norm(s):
        return fix_mojibake(s).lower()

    filter_categories = [norm(s) for s in parse_list(request.args.get("category"))]
    filter_merchants = [norm(s) for s in parse_list(request.args.get("merchant"))]

    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")

        def to_float(x):
            if x is None:
                return 0.0
            try:
                # tenta tratar formatos "12.345,67"
                s = str(x).strip()
                if "," in s and any(ch.isdigit() for ch in s):
                    s = s.replace(".", "").replace(",", ".")
                return float(s)
            except Exception:
                try:
                    return float(x)
                except Exception:
                    return 0.0

        def to_iso_date(raw):
            if raw is None:
                return None
            s = str(raw).strip()
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y %H:%M:%S"):
                try:
                    return datetime.strptime(s, fmt).date().isoformat()
                except Exception:
                    pass
            if len(s) >= 10 and s[4] == "-" and s[7] == "-":
                return s[:10]
            return None

        def in_range(d_iso):
            if not (start or end):
                return True
            if d_iso is None:
                return False
            if start and d_iso < start:
                return False
            if end and d_iso > end:
                return False
            return True

        # detectar colunas
        val_cands = [
            "valor_compra", "valor_total", "total_compra",
            "valor_de_compra", "valor_da_compra", "valor_cupom",
        ]
        rep_cands = [
            "repasse", "valor_repasse", "taxa_repasse", "taxa", "valor_taxa",
        ]
        cat_cands = [
            "categoria", "segmento", "categoria_loja", "categoria_produto", "tipo",
        ]
        mer_cands = [
            "nome_loja", "loja", "merchant", "estabelecimento",
        ]
        cli_cands = [
            "numero_celular", "telefone", "celular", "phone",
        ]
        date_cands = [
            "data", "data_transacao", "data_compra", "dt",
        ]

        # escolher melhor coluna de valor pelo maior número de entradas > 0
        base_col = None
        best_cnt = -1
        for col in val_cands:
            if col in tcols:
                try:
                    cnt = conn.execute(text(
                        f"SELECT SUM(CASE WHEN CAST(REPLACE({col}, ',', '.') AS REAL) > 0 THEN 1 ELSE 0 END) FROM transactions"
                    )).scalar_one() or 0
                except Exception:
                    cnt = 0
                if int(cnt) > best_cnt:
                    base_col, best_cnt = col, int(cnt)
        if not base_col:
            base_col = next((c for c in val_cands if c in tcols), None)

        repasse_col = next((c for c in rep_cands if c in tcols), None)
        categoria_col = next((c for c in cat_cands if c in tcols), None)
        merchant_col = next((c for c in mer_cands if c in tcols), None)
        cliente_col = next((c for c in cli_cands if c in tcols), None)
        data_col = next((c for c in date_cands if c in tcols), None)

        # montar SELECT conforme colunas disponíveis
        select_cols = []
        names = []
        if base_col:
            select_cols.append(base_col); names.append("v")
        if repasse_col:
            select_cols.append(repasse_col); names.append("rep")
        if categoria_col:
            select_cols.append(categoria_col); names.append("cat")
        if merchant_col:
            select_cols.append(merchant_col); names.append("mer")
        if data_col:
            select_cols.append(data_col); names.append("d")
        if cliente_col:
            select_cols.append(cliente_col); names.append("cli")

        if not select_cols:
            return jsonify({
                "error": "Nenhuma coluna relevante encontrada em transactions",
                "columns": list(tcols),
            }), 200

        rows = conn.execute(text(f"SELECT {', '.join(select_cols)} FROM transactions")).all()

        # acumuladores
        total_transacoes = 0
        receita_total = 0.0
        repasse_total = 0.0
        receita_por_categoria = defaultdict(float)
        repasse_por_categoria = defaultdict(float)
        receita_por_merchant = defaultdict(float)
        acc_periodo = defaultdict(float)
        transacoes_por_categoria = defaultdict(int)
        clientes_set = set()
        merchants_set = set()
        categorias_set = set()

        for r in rows:
            idx = 0
            v = to_float(r[idx]); idx += 1
            rep = 0.0
            if repasse_col:
                rep = to_float(r[idx]); idx += 1
            cat = None
            if categoria_col:
                cat = fix_mojibake(r[idx] or "")
                idx += 1
            mer = None
            if merchant_col:
                mer = fix_mojibake(r[idx] or "")
                idx += 1
            d_iso = None
            if data_col:
                d_iso = to_iso_date(r[idx]); idx += 1
            cli = None
            if cliente_col:
                cli = str(r[idx] or "")
                idx += 1

            # filtros
            if not in_range(d_iso):
                continue
            if filter_categories and (cat is None or norm(cat) not in filter_categories):
                continue
            if filter_merchants and (mer is None or norm(mer) not in filter_merchants):
                continue

            total_transacoes += 1
            receita_total += v
            repasse_total += rep

            if categoria_col:
                receita_por_categoria[cat or "Sem categoria"] += v
                repasse_por_categoria[cat or "Sem categoria"] += rep
                transacoes_por_categoria[cat or "Sem categoria"] += 1
                categorias_set.add(cat or "Sem categoria")
            if merchant_col:
                fixed_mer = mer or "Sem loja"
                receita_por_merchant[fixed_mer] += v
                merchants_set.add(fixed_mer)
            if cliente_col and cli:
                clientes_set.add(cli)

            # chave por período
            key = None
            if d_iso:
                if group_by == "day":
                    key = d_iso
                elif group_by == "month":
                    key = d_iso[:7]
                else:  # week
                    try:
                        dt = datetime.fromisoformat(d_iso)
                        y, w, _ = dt.isocalendar()
                        key = f"{y}-W{int(w):02d}"
                    except Exception:
                        key = d_iso
            if key is not None:
                acc_periodo[key] += (v - rep)

        receita_liquida = receita_total - repasse_total
        margem_operacional_percent = (receita_liquida / receita_total * 100.0) if receita_total else 0.0
        ticket_medio = (receita_total / total_transacoes) if total_transacoes else 0.0
        taxa_repasse_percent = (repasse_total / receita_total * 100.0) if receita_total else 0.0

        # margem por segmento com repasse por categoria real (quando possível)
        margem_por_segmento = {}
        for cat, rec in receita_por_categoria.items():
            rep_c = repasse_por_categoria.get(cat, 0.0)
            margem_cat = ((rec - rep_c) / rec * 100.0) if rec else 0.0
            margem_por_segmento[cat] = round(margem_cat, 2)

        # Fallback: se não houver coluna de categoria, usar merchants como "categorias" no donut
        if not receita_por_categoria:
            if receita_por_merchant:
                items = sorted(receita_por_merchant.items(), key=lambda t: t[1], reverse=True)
                top = items[:6]
                outros = sum(v for _, v in items[6:])
                receita_por_categoria = {k or "Sem loja": round(float(v or 0.0), 2) for k, v in top}
                if outros:
                    receita_por_categoria["Outros"] = round(float(outros), 2)
                # margem por "segmento" (apenas informativa neste fallback)
                total_rec = sum(receita_por_categoria.values()) or 1.0
                margem_por_segmento = {k: round((receita_liquida / total_rec * 100.0), 2) for k in receita_por_categoria.keys()}
            else:
                # ainda assim, retorna uma fatia única para não quebrar o gráfico
                receita_por_categoria = {"Geral": round(float(receita_total or 0.0), 2)}
                margem_por_segmento = {"Geral": round(float(margem_operacional_percent or 0.0), 2)}

        # top merchants
        top_items = sorted(((fix_mojibake(n), val) for n, val in receita_por_merchant.items()), key=lambda t: t[1], reverse=True)[:10]
        top_merchants = {
            "labels": [name for name, _ in top_items],
            "values": [round(float(val or 0.0), 2) for _, val in top_items],
        }

        payload = {
            "filters_applied": {
                "start": start, "end": end,
                "group_by": group_by,
                "category": filter_categories,
                "merchant": filter_merchants,
            },
            "total_transacoes": int(total_transacoes or 0),
            "receita_total": round(float(receita_total or 0.0), 2),
            "repasse_total": round(float(repasse_total or 0.0), 2),
            "receita_liquida": round(float(receita_liquida or 0.0), 2),
            "margem_operacional_percent": round(float(margem_operacional_percent or 0.0), 2),
            "ticket_medio": round(float(ticket_medio or 0.0), 2),
            "taxa_repasse_percent": round(float(taxa_repasse_percent or 0.0), 2),
            "receita_series": {k: round(v, 2) for k, v in sorted(acc_periodo.items())},
            "receita_por_categoria": {fix_mojibake(k): round(v, 2) for k, v in receita_por_categoria.items()},
            "margem_por_segmento": {fix_mojibake(k): v for k, v in margem_por_segmento.items()},
            "top_merchants": top_merchants,
            "clientes_unicos": len(clientes_set),
            "lojas_unicas": len(merchants_set),
            "available_filters": {
                "categorias": sorted([fix_mojibake(x) for x in list(categorias_set)]),
                "merchants": sorted([fix_mojibake(x) for x in list(merchants_set)]),
            }
        }

        return jsonify(payload), 200

@bp.get("/cfo")
def kpis_cfo():
    """
    KPIs financeiros do CFO (sem pandas/ORM) — detecta colunas dinamicamente
    e FILTRA por período [start, end] vindos como YYYY-MM-DD.
    """
    eng = _engine()
    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")

        # ---- detectar colunas ----
        candidatos_compra = ["valor_compra", "valor_total", "total_compra",
                             "valor_de_compra", "valor_da_compra"]
        base_col = None
        best_cnt = 0
        for col in candidatos_compra:
            if col in tcols:
                cnt = conn.execute(
                    text(f"SELECT COUNT(*) FROM transactions WHERE {col} > 0")
                ).scalar_one()
                if cnt > best_cnt:
                    best_cnt, base_col = int(cnt), col

        if not base_col:
            if "valor_cupom" in tcols:
                base_col = "valor_cupom"
            else:
                return jsonify({
                    "total_transacoes": 0,
                    "receita_total": 0.0,
                    "repasse_total": 0.0,
                    "receita_liquida": 0.0,
                    "margem_operacional_percent": 0.0,
                    "ticket_medio": 0.0,
                    "taxa_repasse_percent": 0.0,
                    "receita_por_categoria": {},
                    "transacoes_por_categoria": {},
                    "ticket_medio_por_segmento": {},
                    "receita_liquida_mensal": {},
                }), 200

        repasse_col = "repasse_picmoney" if "repasse_picmoney" in tcols else None
        categoria_col = next(
            (c for c in ["categoria_estabelecimento", "categoria", "categoria_loja", "segmento"] if c in tcols), None
        )
        data_col = next(
            (c for c in ["data", "data_transacao", "data_compra", "dt"] if c in tcols), None
        )

        # ---- parâmetros de data ----
        start = request.args.get("start")  # "YYYY-MM-DD"
        end   = request.args.get("end")    # "YYYY-MM-DD"

        # ---- carregamento mínimo de colunas e filtro em Python (robusto a formatos) ----
        def NUM(col):
            """Troca vírgula por ponto e força tipo REAL no SQLite"""
            return f"CAST(REPLACE({col}, ',', '.') AS REAL)"
        
        parts = [f"{NUM(base_col)} AS v"]
        if repasse_col:
                parts.append(f"{NUM(repasse_col)} AS rep")
        if categoria_col:
                parts.append(f"{categoria_col} AS cat")
        if data_col:
                parts.append(f"{data_col} AS d")

        rows = conn.execute(text(f"SELECT {', '.join(parts)} FROM transactions")).all()

        from datetime import datetime
        def to_iso_date(raw):
            if raw is None: return None
            s = str(raw).strip()
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y %H:%M:%S"):
                try:
                    return datetime.strptime(s, fmt).date().isoformat()
                except Exception:
                    pass
            # tenta cortar AAAA-MM-DD do começo
            if len(s) >= 10 and s[4] == "-" and s[7] == "-":
                return s[:10]
            return None

        def in_range(d_iso):
            if not (start or end): return True
            if d_iso is None: return False
            if start and d_iso < start: return False
            if end   and d_iso > end:   return False
            return True

        # ---- acumuladores filtrados ----
        total_transacoes = 0
        receita_total = 0.0
        repasse_total = 0.0
        receita_por_categoria = {}
        transacoes_por_categoria = {}
        from collections import defaultdict
        acc_mensal = defaultdict(float)

        for r in rows:
            idx = 0
            v = float(r[idx] or 0.0); idx += 1
            rep = 0.0
            if repasse_col:
                rep = float(r[idx] or 0.0); idx += 1
            cat = "Sem categoria"
            if categoria_col:
                cat = str(r[idx] or "Sem categoria"); idx += 1
            d_iso = None
            if data_col:
                d_iso = to_iso_date(r[idx]); idx += 1
            if not in_range(d_iso):
                continue

            total_transacoes += 1
            receita_total += v
            repasse_total += rep

            receita_por_categoria[cat] = receita_por_categoria.get(cat, 0.0) + v
            transacoes_por_categoria[cat] = transacoes_por_categoria.get(cat, 0) + 1

            if d_iso:
                mes = d_iso[:7]  # YYYY-MM
                acc_mensal[mes] += (v - rep)

        receita_liquida = receita_total - repasse_total
        margem_operacional_percent = (receita_liquida / receita_total * 100.0) if receita_total else 0.0
        ticket_medio = (receita_total / total_transacoes) if total_transacoes else 0.0
        taxa_repasse_percent = (repasse_total / receita_total * 100.0) if receita_total else 0.0

        ticket_medio_por_segmento = {
            cat: round((receita_por_categoria.get(cat, 0.0) / max(transacoes_por_categoria.get(cat, 0), 1)), 2)
            for cat in receita_por_categoria.keys()
        }
        receita_liquida_mensal = {k: round(v, 2) for k, v in sorted(acc_mensal.items())}

        # ===== Margem operacional por segmento =====
        # Calcula a margem média (%) de cada categoria
        margem_por_segmento = {}
        for cat, receita in receita_por_categoria.items():
            rep = repasse_total * (transacoes_por_categoria[cat] / total_transacoes) if total_transacoes else 0.0
            margem_cat = ((receita - rep) / receita * 100.0) if receita else 0.0
            margem_por_segmento[cat] = round(margem_cat, 2)

        # ===== Estrutura de custos (fixos/variáveis) - opcional =====
        # Exemplo fictício de cálculo, substitua conforme seu modelo real
        estrutura_custos = {
            "Fixos": round(repasse_total * 0.6, 2),       # supondo 60% dos repasses sejam fixos
            "Variáveis": round(repasse_total * 0.4, 2),   # e 40% variáveis
            "Operacionais": round(receita_total * 0.1, 2) # exemplo simbólico
        }


        return jsonify({
            "total_transacoes": int(total_transacoes or 0),
            "receita_total": round(float(receita_total or 0.0), 2),
            "repasse_total": round(float(repasse_total or 0.0), 2),
            "receita_liquida": round(float(receita_liquida or 0.0), 2),
            "margem_operacional_percent": round(float(margem_operacional_percent or 0.0), 2),
            "ticket_medio": round(float(ticket_medio or 0.0), 2),
            "taxa_repasse_percent": round(float(taxa_repasse_percent or 0.0), 2),
            "receita_por_categoria": {k: round(v, 2) for k, v in receita_por_categoria.items()},
            "transacoes_por_categoria": transacoes_por_categoria,
            "ticket_medio_por_segmento": ticket_medio_por_segmento,
            "receita_liquida_mensal": receita_liquida_mensal,
            "margem_por_segmento": margem_por_segmento,
            "estrutura_custos": estrutura_custos,
        }), 200

@bp.get("/debug/sample-dates")
def debug_sample_dates():
    eng = _engine()
    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")
        data_col = next((c for c in ["data","data_transacao","data_compra","dt"] if c in tcols), None)
        if not data_col:
            return jsonify({"data_col": None, "samples": []}), 200
        rows = conn.execute(text(f"SELECT {data_col} FROM transactions LIMIT 10")).all()
        return jsonify({"data_col": data_col, "samples": [r[0] for r in rows]}), 200

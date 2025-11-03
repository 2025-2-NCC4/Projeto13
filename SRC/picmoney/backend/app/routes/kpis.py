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
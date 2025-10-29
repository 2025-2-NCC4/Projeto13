from flask import Blueprint, current_app
from flask import Blueprint, jsonify, request
from sqlalchemy import text
from ..db import db_engine, init_db

bp = Blueprint("kpis", __name__, url_prefix="/api/kpis")

def _engine():
    return db_engine or init_db(current_app.config["SETTINGS"].DATABASE_URL)

def _cols(conn, table):
    rows = conn.execute(text(f"PRAGMA table_info({table})")).all()
    return {r[1] for r in rows}

@bp.get("/summary")
def summary():
    eng = _engine()
    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")

        # 1) Escolha inteligente da coluna-base: precisa ter DADOS (>0), não só existir
        candidatos_compra = ["valor_compra", "valor_total", "total_compra", "valor_de_compra", "valor_da_compra"]
        counts = []
        for col in candidatos_compra:
            if col in tcols:
                cnt = conn.execute(text(f"SELECT COUNT(*) FROM transactions WHERE {col} > 0")).scalar_one()
                counts.append((col, int(cnt)))

        base_col, best_cnt = (None, 0)
        if counts:
            base_col, best_cnt = max(counts, key=lambda t: t[1])

        if best_cnt > 0:
            receita_total = conn.execute(text(f"SELECT COALESCE(SUM({base_col}),0) FROM transactions")).scalar_one()
            total_tx_valido = best_cnt
        else:
            # 1º fallback: usar valor_cupom, se existir e tiver dados
            if "valor_cupom" in tcols:
                receita_total = conn.execute(text("SELECT COALESCE(SUM(valor_cupom),0) FROM transactions")).scalar_one()
                total_tx_valido = conn.execute(text("SELECT COUNT(*) FROM transactions WHERE valor_cupom > 0")).scalar_one()
                base_col = "valor_cupom"
            else:
                receita_total = 0
                total_tx_valido = 0
                base_col = None

        # Outros agregados
        total_tx = conn.execute(text("SELECT COUNT(*) FROM transactions")).scalar_one()
        valor_cupons = conn.execute(text("SELECT COALESCE(SUM(valor_cupom),0) FROM transactions")).scalar_one() \
                        if "valor_cupom" in tcols else 0
        clientes_unicos = conn.execute(text("SELECT COUNT(DISTINCT numero_celular) FROM transactions")).scalar_one() \
                            if "numero_celular" in tcols else 0
        lojas_unicas = conn.execute(text("SELECT COUNT(DISTINCT nome_loja) FROM transactions")).scalar_one() \
                         if "nome_loja" in tcols else 0

        # 2º fallback (estimador) — média de valor_compra em merchants, igual ao seu .ipynb
        ticket_estimado = None
        if total_tx_valido == 0:
            mcols = _cols(conn, "merchants")
            if "valor_compra" in mcols:
                ticket_estimado = conn.execute(text(
                    "SELECT AVG(valor_compra) FROM merchants WHERE valor_compra > 0"
                )).scalar_one()

    ticket_medio = (float(receita_total) / float(total_tx_valido)) if total_tx_valido else float(ticket_estimado or 0.0)

    return {
        "base_col": base_col or "",
        "clientes_unicos": int(clientes_unicos or 0),
        "lojas_unicas": int(lojas_unicas or 0),
        "total_transacoes": int(total_tx or 0),
        "receita_total": float(receita_total or 0.0),
        "valor_cupons": float(valor_cupons or 0.0),
        "ticket_medio": float(ticket_medio),
        "ticket_medio_estimado": bool(total_tx_valido == 0 and ticket_estimado is not None),
    }

@bp.get("/debug")
def debug():
    eng = _engine()
    with eng.connect() as conn:
        tcols = _cols(conn, "transactions")
        mcols = _cols(conn, "merchants")

        # Contagens de dados válidos
        tx_valor_compra = 0
        if "valor_compra" in tcols:
            tx_valor_compra = conn.execute(
                text("SELECT COUNT(*) FROM transactions WHERE valor_compra > 0")
            ).scalar_one()

        soma_cupom = 0
        if "valor_cupom" in tcols:
            soma_cupom = conn.execute(
                text("SELECT COALESCE(SUM(valor_cupom),0) FROM transactions")
            ).scalar_one()

        media_lojas = None
        if "valor_compra" in mcols:
            media_lojas = conn.execute(
                text("SELECT AVG(valor_compra) FROM merchants WHERE valor_compra > 0")
            ).scalar_one()

    return {
        "transactions_cols": tcols,
        "merchants_cols": mcols,
        "tx_valor_compra_validos": int(tx_valor_compra or 0),
        "soma_valor_cupom": float(soma_cupom or 0.0),
        "media_valor_compra_merchants": float(media_lojas or 0.0) if media_lojas else None,
    }


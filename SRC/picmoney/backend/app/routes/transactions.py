from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from ..db import db_engine, init_db
from ..utils.pagination import get_pagination

# Prefix all transactions routes with /api to match the frontend
bp = Blueprint("transactions", __name__, url_prefix="/api")

def _engine():
    return db_engine or init_db(current_app.config["SETTINGS"].DATABASE_URL)

@bp.get("/transactions")
def list_transactions():
    limit, offset = get_pagination()
    where = []
    params = {"limit": limit, "offset": offset}

    tipo_cupom = request.args.get("tipo_cupom")
    if tipo_cupom:
        where.append("tipo_cupom = :tipo_cupom")
        params["tipo_cupom"] = tipo_cupom

    sql = "SELECT * FROM transactions"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY id LIMIT :limit OFFSET :offset"

    with _engine().connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()
        total = conn.execute(text("SELECT COUNT(*) FROM transactions")).scalar_one()
    return jsonify({"data": list(rows), "total": int(total), "limit": limit, "offset": offset})

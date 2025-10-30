from flask import Blueprint, jsonify, current_app
from sqlalchemy import text
from ..db import db_engine, init_db
from ..utils.pagination import get_pagination

# Prefix all merchants routes with /api to match the frontend
bp = Blueprint("merchants", __name__, url_prefix="/api")

def _engine():
    return db_engine or init_db(current_app.config["SETTINGS"].DATABASE_URL)

@bp.get("/merchants")
def list_merchants():
    limit, offset = get_pagination()
    with _engine().connect() as conn:
        rows = conn.execute(text("""
            SELECT * FROM merchants
            ORDER BY id
            LIMIT :limit OFFSET :offset
        """), {"limit": limit, "offset": offset}).mappings().all()
        total = conn.execute(text("SELECT COUNT(*) FROM merchants")).scalar_one()
    return jsonify({"data": list(rows), "total": int(total), "limit": limit, "offset": offset})

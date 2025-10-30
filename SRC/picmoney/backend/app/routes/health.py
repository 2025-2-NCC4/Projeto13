from flask import Blueprint

# Prefix all health routes with /api to match the frontend
bp = Blueprint("health", __name__, url_prefix="/api")

@bp.get("/health")
def health():
    return {"status": "ok"}

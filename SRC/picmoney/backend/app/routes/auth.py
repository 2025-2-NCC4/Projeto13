# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta

from sqlalchemy.orm import Session

from ..db import SessionLocal
from ..models import User

from passlib.hash import pbkdf2_sha256

from sqlalchemy import text
from app.db import engine

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# /api/auth/login
@bp.post("/login")
def login():
    # 1) Validação do corpo
    if not request.is_json:
        return jsonify({"error": "Content-Type deve ser application/json"}), 400

    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    if not username or not password:
        return jsonify({"error": "username e password são obrigatórios"}), 400

    # 2) Consulta e verificação — SEMPRE com retorno
    try:
        with engine.begin() as conn:
            row = conn.execute(
                text("SELECT id, username, password_hash FROM users WHERE username = :u LIMIT 1"),
                {"u": username},
            ).fetchone()

        if not row:
            return jsonify({"error": "credenciais inválidas"}), 401

        if not pbkdf2_sha256.verify(password, row.password_hash):
            return jsonify({"error": "credenciais inválidas"}), 401

        # 3) Gera token e RETORNA
        access_token = create_access_token(
            identity=str(row.id),                                     
            additional_claims={"username": row.username},             
            expires_delta=timedelta(hours=2),
        )
        return jsonify({"access_token": access_token}), 200

    except Exception as e:
        # Log simples (apenas p/ debug local). Em produção, use logging.
        # print("LOGIN_ERROR:", repr(e))
        return jsonify({"error": "internal_error", "detail": str(e)}), 500



# /api/auth/me (opcional, para validar token no frontend)
@bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()   # str
    claims = get_jwt()             # dict com as additional_claims
    return jsonify({
        "user": {
            "id": user_id,
            "username": claims.get("username"),
        }
    }), 200

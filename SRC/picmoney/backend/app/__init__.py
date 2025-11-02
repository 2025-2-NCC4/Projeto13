# app/__init__.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.db import engine
from app.models import Base  # ok importar aqui, não puxa rotas

def create_app():
    app = Flask(__name__)
    from flask_cors import CORS
    from .routes import health, kpis, transactions, players, merchants, auth
    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev_secret")
    JWTManager(app)

    # cria tabelas que faltam (users etc.)
    Base.metadata.create_all(bind=engine)

    # >>> IMPORTES DE ROTAS APENAS AQUI DENTRO <<<
    from .routes import health, kpis, transactions, players, merchants, auth

    app.register_blueprint(health.bp, url_prefix="/api")
    app.register_blueprint(kpis.bp)
    app.register_blueprint(players.bp, url_prefix="/api")
    app.register_blueprint(transactions.bp, url_prefix="/api")
    app.register_blueprint(merchants.bp, url_prefix="/api")
    app.register_blueprint(auth.bp) 

    @app.get("/")
    def root():
        return jsonify(ok=True, service="picmoney-backend")

    return app

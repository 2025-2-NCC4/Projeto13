# app.py (trecho relevante)
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
    # CORS – libere Authorization para o token
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

    # Config JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev_secret")
    JWTManager(app)

    # blueprints existentes...
    from app.routes import kpis, transactions, players, merchants, health
    from app.routes import auth  # novo

    app.register_blueprint(health.bp)
    app.register_blueprint(kpis.bp)
    app.register_blueprint(transactions.bp)
    app.register_blueprint(players.bp)
    app.register_blueprint(merchants.bp)
    app.register_blueprint(auth.bp)          # <— registre o auth

    @app.get("/")
    def root():
        return jsonify(ok=True, service="picmoney-backend")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

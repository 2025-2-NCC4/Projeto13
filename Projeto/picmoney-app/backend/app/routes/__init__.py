from flask import Blueprint
from .auth import auth_bp
from .dashboard import dashboard_bp
from .reports import reports_bp
from .projects import projects_bp
from .settings import settings_bp

# Registrar todos os blueprints
def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
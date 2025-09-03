from flask import Flask, jsonify
from flask_cors import CORS
from .routes.auth import auth_bp
from .routes.dashboard import dashboard_bp
from .routes.reports import reports_bp
from .routes.projects import projects_bp
from .routes.settings import settings_bp

def create_app():
    app = Flask(__name__)
    
    # Configurações
    app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui'
    
    # Habilitar CORS
    CORS(app, origins=["http://localhost:3000"])
    
    # Registrar blueprints com prefixos
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    
    # Rota padrão para testar se o servidor está funcionando
    @app.route('/')
    def home():
        return jsonify({'message': 'Backend PicMoney está funcionando!', 'status': 'success'})
    
    # Rota de health check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Backend is running!'})
    
    return app

# Criar a aplicação
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
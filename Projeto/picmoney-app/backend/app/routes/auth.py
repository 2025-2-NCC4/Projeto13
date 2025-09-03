from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.utils.security import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        user = AuthService.authenticate_user(email, password)
        if not user:
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        token = generate_token(user['id'])
        
        return jsonify({
            'token': token,
            'user': user
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Implementar lógica de logout se necessário
        return jsonify({'message': 'Logout realizado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/test', methods=['GET'])
def test_auth():
    return jsonify({'message': 'Rota de autenticação funcionando!'})
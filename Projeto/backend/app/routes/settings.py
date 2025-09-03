from flask import Blueprint, request, jsonify
from app.utils.security import get_token_from_header, verify_token

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Dados mock do perfil do usuário
        return jsonify({
            'id': user_id,
            'name': 'João Silva',
            'email': 'joao.silva@exemplo.com',
            'phone': '(11) 99999-9999',
            'preferences': {
                'language': 'pt-br',
                'timezone': 'America/Sao_Paulo',
                'notifications': {
                    'email': True,
                    'push': False,
                    'sms': False
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/profile', methods=['PUT'])
def update_profile():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        data = request.get_json()
        # Aqui você implementaria a lógica para atualizar o perfil
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'data': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/preferences', methods=['PUT'])
def update_preferences():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        data = request.get_json()
        # Aqui você implementaria a lógica para atualizar preferências
        
        return jsonify({
            'message': 'Preferências atualizadas com sucesso',
            'data': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/password', methods=['PUT'])
def change_password():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Senha atual e nova senha são obrigatórias'}), 400
        
        # Aqui você implementaria a lógica para alterar a senha
        
        return jsonify({
            'message': 'Senha alterada com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
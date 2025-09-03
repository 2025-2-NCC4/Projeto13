from flask import Blueprint, jsonify
from app.utils.security import get_token_from_header, verify_token

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running!'})

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401        
        # Dummy data para teste
        return jsonify({
            'total_sales': 65432,
            'total_profit': 27879,
            'new_users': 4364,
            'active_projects': 12,
            'metrics': [
                {
                    'title': 'Vendas',
                    'value': '65,432',
                    'change': '+12%',
                    'isPositive': True
                },
                {
                    'title': 'Lucro',
                    'value': '27,879',
                    'change': '+9%',
                    'isPositive': True
                },
                {
                    'title': 'Usuários',
                    'value': '+4,364',
                    'change': '+43%',
                    'isPositive': True
                },
                {
                    'title': 'Projetos',
                    'value': '12',
                    'change': '+2',
                    'isPositive': True
                }
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/projects', methods=['GET'])
def get_recent_projects():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Dummy data para projetos recentes
        return jsonify({
            'projects': [
                {
                    'id': 1,
                    'name': 'Projeto A',
                    'status': 'completed',
                    'value': 2500.00,
                    'start_date': '2024-06-12',
                    'end_date': '2024-06-12'
                },
                {
                    'id': 2,
                    'name': 'Projeto B',
                    'status': 'pending',
                    'value': 3750.00,
                    'start_date': '2024-06-18',
                    'end_date': '2024-08-30'
                },
                {
                    'id': 3,
                    'name': 'Projeto C',
                    'status': 'pending',
                    'value': 1250.00,
                    'start_date': '2024-06-20',
                    'end_date': '2024-08-25'
                }
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
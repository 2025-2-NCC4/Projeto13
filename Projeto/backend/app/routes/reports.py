from flask import Blueprint, request, jsonify
from app.utils.security import get_token_from_header, verify_token

reports_bp = Blueprint('reports', __name__)

# Dados mock para relatórios
MOCK_REPORTS_DATA = {
    'sales': {
        'labels': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        'datasets': [
            {
                'label': 'Vendas 2024',
                'data': [6500, 5900, 8000, 8100, 5600, 6543, 7300],
                'borderColor': '#3498db',
                'backgroundColor': 'rgba(52, 152, 219, 0.1)'
            }
        ]
    },
    'profit': {
        'labels': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        'datasets': [
            {
                'label': 'Lucro 2024',
                'data': [2000, 2200, 2500, 2300, 2600, 2788, 3000],
                'backgroundColor': 'rgba(46, 204, 113, 0.7)'
            }
        ]
    },
    'users': {
        'labels': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        'datasets': [
            {
                'label': 'Novos Usuários',
                'data': [1200, 1000, 1500, 1800, 2000, 2200, 2364],
                'borderColor': '#9b59b6',
                'backgroundColor': 'rgba(155, 89, 182, 0.1)'
            }
        ]
    }
}

@reports_bp.route('/sales', methods=['GET'])
def get_sales_report():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        period = request.args.get('period', 'monthly')
        
        return jsonify({
            'data': MOCK_REPORTS_DATA['sales'],
            'period': period,
            'total': 65432
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/profit', methods=['GET'])
def get_profit_report():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        period = request.args.get('period', 'monthly')
        
        return jsonify({
            'data': MOCK_REPORTS_DATA['profit'],
            'period': period,
            'total': 27879
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/users', methods=['GET'])
def get_users_report():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        period = request.args.get('period', 'monthly')
        
        return jsonify({
            'data': MOCK_REPORTS_DATA['users'],
            'period': period,
            'total': 4364
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/summary', methods=['GET'])
def get_reports_summary():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        return jsonify({
            'total_reports': 15,
            'recent_reports': [
                {'id': 1, 'name': 'Relatório de Vendas Mensal', 'date': '2024-06-15'},
                {'id': 2, 'name': 'Análise de Lucros Trimestral', 'date': '2024-06-10'},
                {'id': 3, 'name': 'Crescimento de Usuários', 'date': '2024-06-05'}
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
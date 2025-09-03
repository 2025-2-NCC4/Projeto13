from flask import Blueprint, request, jsonify
from app.utils.security import get_token_from_header, verify_token
from app.services.project_service import ProjectService

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('', methods=['GET'])
def get_projects():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        projects = ProjectService.get_user_projects(user_id)
        return jsonify(projects), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('', methods=['POST'])
def create_project():
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        data = request.get_json()
        project = ProjectService.create_project(user_id, data)
        
        return jsonify(project), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    try:
        token = get_token_from_header(request.headers.get('Authorization'))
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Token inválido'}), 401
        
        project = ProjectService.get_project(user_id, project_id)
        if not project:
            return jsonify({'error': 'Projeto não encontrado'}), 404
        
        return jsonify(project), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/test', methods=['GET'])
def test_projects():
    return jsonify({'message': 'Rota de projetos funcionando!'})
# Dados mock de projetos
MOCK_PROJECTS = [
    {
        'id': 1,
        'name': 'Projeto A',
        'status': 'completed',
        'value': 2500.00,
        'start_date': '2024-06-12',
        'end_date': '2024-06-12',
        'user_id': 1
    },
    {
        'id': 2,
        'name': 'Projeto B',
        'status': 'pending',
        'value': 3750.00,
        'start_date': '2024-06-18',
        'end_date': '2024-08-30',
        'user_id': 1
    },
    {
        'id': 3,
        'name': 'Projeto C',
        'status': 'pending',
        'value': 1250.00,
        'start_date': '2024-06-20',
        'end_date': '2024-08-25',
        'user_id': 2
    }
]

class ProjectService:
    @staticmethod
    def get_user_projects(user_id):
        return [p for p in MOCK_PROJECTS if p['user_id'] == user_id]
    
    @staticmethod
    def create_project(user_id, project_data):
        # Gera novo ID
        new_id = max(p['id'] for p in MOCK_PROJECTS) + 1 if MOCK_PROJECTS else 1
        
        new_project = {
            'id': new_id,
            'user_id': user_id,
            **project_data
        }
        
        MOCK_PROJECTS.append(new_project)
        return new_project
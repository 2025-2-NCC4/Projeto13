# Dados mock de usuários (apenas para desenvolvimento)
MOCK_USERS = [
    {
        'id': 1,
        'email': 'admin@picmoney.com',
        'password': 'admin123',  # Em produção, isso seria hash
        'name': 'Administrador'
    },
    {
        'id': 2,
        'email': 'usuario@exemplo.com',
        'password': 'senha123',
        'name': 'João Silva'
    }
]

class AuthService:
    @staticmethod
    def authenticate_user(email, password):
        # Busca usuário mock
        user = next((u for u in MOCK_USERS if u['email'] == email and u['password'] == password), None)
        if user:
            # Retorna cópia sem a senha
            return {
                'id': user['id'],
                'email': user['email'],
                'name': user['name']
            }
        return None
    
    @staticmethod
    def get_user_by_id(user_id):
        user = next((u for u in MOCK_USERS if u['id'] == user_id), None)
        if user:
            return {
                'id': user['id'],
                'email': user['email'],
                'name': user['name']
            }
        return None
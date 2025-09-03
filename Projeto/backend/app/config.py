import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

class Config:
    # Chave secreta para JWT
    SECRET_KEY = os.getenv('SECRET_KEY', 'chave-secreta-padrao-mude-em-producao')
    
    # Debug mode
    DEBUG = os.getenv('DEBUG', 'True').lower() in ['true', '1', 't']
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
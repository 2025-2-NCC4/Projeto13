# app/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

_settings = get_settings()
DATABASE_URL = _settings.DATABASE_URL

engine = create_engine(DATABASE_URL, future=True)
db_engine = engine  

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def init_db(url: str = None):
    """Se quiser, retorna uma engine nova; usado em scripts ocasionais."""
    from sqlalchemy import create_engine as _ce
    return _ce(url or DATABASE_URL, future=True)

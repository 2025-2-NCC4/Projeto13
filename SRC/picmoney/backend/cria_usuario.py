# cria_usuario.py
from sqlalchemy import text
from app.models import Base, User
from app.db import engine, SessionLocal

def main():
    # garante as tabelas (cria só as que faltam)
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        # Garante tabela users (caso não tenha sido criada por metadata)
        db.execute(text("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )"""))
        db.commit()

        row = db.execute(text("SELECT id FROM users WHERE username=:u"), {"u": "admin"}).fetchone()
        if not row:
            pwd_hash = User.hash_password("admin")  # pbkdf2_sha256
            db.execute(
                text("INSERT INTO users (username, password_hash) VALUES (:u, :p)"),
                {"u": "admin", "p": pwd_hash},
            )
            db.commit()
            print("Usuário criado: admin / admin")
        else:
            print("Usuário 'admin' já existe.")

if __name__ == "__main__":
    main()

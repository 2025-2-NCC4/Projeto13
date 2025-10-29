from sqlalchemy import MetaData, Table, Column, Integer, Float, String, Date, Boolean, DateTime, func
from passlib.hash import pbkdf2_sha256
from sqlalchemy.orm import declarative_base

Base = declarative_base()


metadata = MetaData()

players = Table(
    "players", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("celular", String, index=True),
    Column("data", Date),
    Column("horario", String),
    Column("local", String),
    Column("latitude", Float),
    Column("longitude", Float),
    Column("tipo_celular", String),
    Column("modelo_celular", String),
    Column("possui_app_picmoney", Boolean),
    Column("data_ultima_compra", Date),
    Column("ultimo_tipo_cupom", String),
    Column("ultimo_valor_capturado", Float),
    Column("ultimo_tipo_loja", String),
    Column("data_nascimento", Date),
    Column("idade", Integer),
    Column("sexo", String),
    Column("cidade_residencial", String),
    Column("bairro_residencial", String),
)

transactions = Table(
    "transactions", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("numero_celular", String, index=True),
    Column("data_captura", Date),
    Column("tipo_cupom", String),
    Column("tipo_loja", String),
    Column("local_captura", String),
    Column("latitude", Float),
    Column("longitude", Float),
    Column("nome_loja", String, index=True),
    Column("endereco_loja", String),
    Column("valor_compra", Float),
    Column("valor_cupom", Float),
    Column("repasse_picmoney", Float),
)

pedestres = Table(
    "pedestres", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("celular", String, index=True),
    Column("data", Date),
    Column("hora", String),
    Column("nome_estabelecimento", String),
    Column("bairro_estabelecimento", String),
    Column("categoria_estabelecimento", String),
    Column("id_campanha", String),
    Column("id_cupom", String),
    Column("tipo_cupom", String),
    Column("produto", String),
    Column("valor_cupom", Float),
    Column("repasse_picmoney", Float),
)

merchants = Table(
    "merchants", metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("nome_loja", String, index=True),
    Column("tipo_loja", String),
    Column("local_captura", String),
    Column("latitude", Float),
    Column("longitude", Float),
    Column("endereco_loja", String),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    @staticmethod
    def hash_password(plain: str) -> str:
        return pbkdf2_sha256.hash(plain)

    def verify_password(self, plain: str) -> bool:
        return pbkdf2_sha256.verify(plain, self.password_hash)

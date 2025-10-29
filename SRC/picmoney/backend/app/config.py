import os
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv()
        self.DATABASE_URL  = os.getenv("DATABASE_URL") or "sqlite:///./picmoney.db"
        self.CSV_DIR       = os.getenv("CSV_DIR") or "./data"
        self.CSV_PLAYERS   = os.getenv("CSV_PLAYERS") or "PicMoney-Base_Cadastral_de_Players-10_000 linhas (1).csv"
        self.CSV_CUPONS    = os.getenv("CSV_CUPONS") or "PicMoney-Base_de_Transa__es_-_Cupons_Capturados-100000 linhas (1).csv"
        self.CSV_PEDESTRES = os.getenv("CSV_PEDESTRES") or "PicMoney-Base_Simulada_-_Pedestres_Av__Paulista-100000 linhas (1).csv"
        self.CSV_LOJAS     = os.getenv("CSV_LOJAS") or "PicMoney-Massa_de_Teste_com_Lojas_e_Valores-10000 linhas (1).csv"
        self.CSV_SEP       = os.getenv("CSV_SEP") or ";"
        self.CSV_ENCODING  = os.getenv("CSV_ENCODING") or ""

def get_settings() -> "Settings":
    return Settings()

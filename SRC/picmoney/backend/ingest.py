from pathlib import Path
import pandas as pd
from sqlalchemy import text
from app.config import get_settings
from app.db import init_db
from app.models import metadata
from app.utils.io import read_csv_smart
from app.utils.normalize import normalize_columns, coerce_numeric, coerce_dates, fix_brazilian_numbers

def ensure_tables(engine):
    metadata.create_all(engine)

def derive_merchants(df_tx: pd.DataFrame) -> pd.DataFrame:
    # Inclui valor_compra se existir nas fontes (transações/lojas derivadas)
    cols = [c for c in [
        "nome_loja", "tipo_loja", "local_captura", "latitude", "longitude", "endereco_loja", "valor_compra"
    ] if c in df_tx.columns]

    if not cols:
        return pd.DataFrame(columns=[
            "nome_loja", "tipo_loja", "local_captura", "latitude", "longitude", "endereco_loja", "valor_compra"
        ]).dropna()

    merchants = df_tx[cols].dropna(subset=["nome_loja"]).drop_duplicates().copy()
    return merchants

def main():
    settings = get_settings()
    engine = init_db(settings.DATABASE_URL)
    csv_dir = Path(settings.CSV_DIR)
    sep = getattr(settings, "CSV_SEP", None)
    enc = getattr(settings, "CSV_ENCODING", None) or None

    players_path   = csv_dir / settings.CSV_PLAYERS
    cupons_path    = csv_dir / settings.CSV_CUPONS
    pedestres_path = csv_dir / settings.CSV_PEDESTRES
    lojas_path     = csv_dir / settings.CSV_LOJAS

    print("[INFO] Lendo CSVs de:", csv_dir.resolve())
    print("[INFO] files:", players_path.name, cupons_path.name, pedestres_path.name, lojas_path.name)

    players   = read_csv_smart(players_path,   sep_hint=sep, encoding_hint=enc) if players_path.exists() else pd.DataFrame()
    cupons    = read_csv_smart(cupons_path,    sep_hint=sep, encoding_hint=enc) if cupons_path.exists() else pd.DataFrame()
    pedestres = read_csv_smart(pedestres_path, sep_hint=sep, encoding_hint=enc) if pedestres_path.exists() else pd.DataFrame()
    lojas     = read_csv_smart(lojas_path,     sep_hint=sep, encoding_hint=enc) if lojas_path.exists() else pd.DataFrame()
    if not lojas.empty:
        # Caso o CSV de lojas traga 'valor_compra', converte para número
        lojas = coerce_numeric(lojas, ["latitude", "longitude", "valor_compra"])

    # Transactions (cupons)
    if not cupons.empty:
        rename_map = {
            "celular": "numero_celular",
            "n_telefone": "numero_celular",
            "telefone": "numero_celular",
            "nome_estabelecimento": "nome_loja",
            "endereco_estabelecimento": "endereco_loja",
            "valor_de_compra": "valor_compra",
            "valor_da_compra": "valor_compra",
            "valor_total": "valor_compra",
            "total_compra": "valor_compra",
            "valor_do_cupom": "valor_cupom",
            "vl_cupom": "valor_cupom",
            "valorcupom": "valor_cupom",
            "repasse": "repasse_picmoney",
            "repasse_pic_money": "repasse_picmoney",
        }
        cupons = cupons.rename(columns={k: v for k, v in rename_map.items() if k in cupons.columns})

        if "valor_compra" not in cupons.columns:
            for c in ["valor_de_compra","valor_da_compra","valor_total","total_compra"]:
                if c in cupons.columns:
                    cupons["valor_compra"] = cupons[c]
                    break
        if "valor_cupom" not in cupons.columns:
            for c in ["valor_do_cupom","vl_cupom","valorcupom"]:
                if c in cupons.columns:
                    cupons["valor_cupom"] = cupons[c]
                    break

        if "valor_compra" not in cupons.columns:
            cupons["valor_compra"] = pd.NA  # cria a coluna (vazia) para não quebrar KPIs
        if "valor_cupom" not in cupons.columns:
            cupons["valor_cupom"] = pd.NA

        cupons = fix_brazilian_numbers(cupons, ["valor_compra", "valor_cupom", "repasse_picmoney"])
        cupons = coerce_numeric(cupons, ["latitude","longitude","valor_compra","valor_cupom","repasse_picmoney"])

        possiveis_datas = [c for c in ["data_captura","data","dt_captura","data_transacao"] if c in cupons.columns]
        if possiveis_datas:
            cupons = coerce_dates(cupons, possiveis_datas)

    if not players.empty:
        players = coerce_numeric(players, ["latitude","longitude","idade","ultimo_valor_capturado"])
        players = coerce_dates(players, ["data","data_ultima_compra","data_nascimento"])

    if not pedestres.empty:
        pedestres = coerce_numeric(pedestres, ["valor_cupom","repasse_picmoney"])
        pedestres = coerce_dates(pedestres, ["data"])

    if not lojas.empty:
        lojas = coerce_numeric(lojas, ["latitude","longitude"])

    with engine.begin() as conn:
        if not players.empty:
            players.to_sql("players", con=conn, if_exists="replace", index=False)
        if not cupons.empty:
            cupons.to_sql("transactions", con=conn, if_exists="replace", index=False)
        if not pedestres.empty:
            pedestres.to_sql("pedestres", con=conn, if_exists="replace", index=False)
        if lojas.empty and not cupons.empty:
            lojas = derive_merchants(cupons)
        if not lojas.empty:
            lojas.to_sql("merchants", con=conn, if_exists="replace", index=False)

    with engine.begin() as conn:
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_transactions_numero_celular ON transactions (numero_celular)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_transactions_nome_loja ON transactions (nome_loja)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_players_celular ON players (celular)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_merchants_nome_loja ON merchants (nome_loja)"))
        except Exception as e:
            print("[WARN] index creation:", e)

    print("[OK] Ingestão concluída!")

if __name__ == "__main__":
    main()

import pandas as pd
import re
from unidecode import unidecode

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [
        re.sub(r"__+", "_", unidecode(c).strip().lower().replace(" ", "_").replace("-", "_"))
        for c in df.columns
    ]
    return df

def coerce_numeric(df: pd.DataFrame, cols: list[str]) -> pd.DataFrame:
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    return df

def coerce_dates(df: pd.DataFrame, cols: list[str], dayfirst: bool = True) -> pd.DataFrame:
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_datetime(df[c], errors="coerce", dayfirst=dayfirst).dt.date
    return df

def fix_brazilian_numbers(df: pd.DataFrame, cols: list[str]) -> pd.DataFrame:
    for c in cols:
        if c in df.columns and df[c].dtype == object:
            s = (df[c].astype(str)
                       .str.replace(r"[^\d,.-]", "", regex=True)
                       .str.replace(".", "", regex=False)
                       .str.replace(",", ".", regex=False))
            df[c] = pd.to_numeric(s, errors="coerce")
    return df

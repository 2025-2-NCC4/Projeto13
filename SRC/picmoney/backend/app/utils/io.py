import pandas as pd
import chardet
from pathlib import Path
from .normalize import normalize_columns

def _read_csv(path: Path, *, encoding: str | None, sep, engine):
    kwargs = dict(encoding=encoding)
    if sep is not None:
        kwargs["sep"] = sep
    if engine is not None:
        kwargs["engine"] = engine
    # low_memory NÃO deve ser usado com engine='python'
    if engine != "python":
        kwargs["low_memory"] = False
    return pd.read_csv(path, **kwargs)

def read_csv_smart(path: Path, sep_hint: str | None = None, encoding_hint: str | None = None) -> pd.DataFrame:
    raw = path.read_bytes()

    encodings = []
    if encoding_hint:
        encodings.append(encoding_hint)
    enc_guess = chardet.detect(raw).get("encoding")
    for e in ["utf-8-sig", "utf-8", enc_guess, "utf-16", "utf-16-le", "utf-16-be", "cp1252", "latin-1", "iso-8859-1"]:
        if e and e not in encodings:
            encodings.append(e)

    errors = []

    # 1) tentar com sep_hint, engine='python'
    if sep_hint:
        for enc in encodings:
            try:
                df = _read_csv(path, encoding=enc, sep=sep_hint, engine="python")
                df = normalize_columns(df)
                if df.shape[1] > 1:
                    return df
            except Exception as e:
                errors.append(f"[sep_hint '{sep_hint}' enc '{enc}'] {type(e).__name__}: {e}")

    # 2) autodetecção de separador com engine='python'
    for enc in encodings:
        try:
            df = _read_csv(path, encoding=enc, sep=None, engine="python")
            df = normalize_columns(df)
            if df.shape[1] > 1:
                return df
        except Exception as e:
            errors.append(f"[sep auto enc '{enc}'] {type(e).__name__}: {e}")

    # 3) separadores comuns com engine='python'
    for enc in encodings:
        for sep in [";", ",", "\t", "|"]:
            try:
                df = _read_csv(path, encoding=enc, sep=sep, engine="python")
                df = normalize_columns(df)
                if df.shape[1] > 1:
                    return df
            except Exception as e:
                errors.append(f"[sep '{sep}' enc '{enc}'] {type(e).__name__}: {e}")

    # 4) último recurso: pular linhas ruins
    for enc in encodings:
        for sep in [sep_hint] if sep_hint else [";", ",", "\t", "|"]:
            try:
                df = pd.read_csv(path, encoding=enc, sep=sep, engine="python", on_bad_lines="skip")
                df = normalize_columns(df)
                if df.shape[1] > 1:
                    return df
            except Exception as e:
                errors.append(f"[skip sep '{sep}' enc '{enc}'] {type(e).__name__}: {e}")

    raise ValueError(
        f"Falha ao ler CSV '{path.name}'. Tentativas: {len(errors)}. Algumas mensagens:\n  - "
        + "\n  - ".join(errors[:8])
    )

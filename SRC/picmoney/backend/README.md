# PicMoney Flask Backend — FIXED

Este pacote substitui o seu backend com:
- `.env` limpo (chave=valor por linha).
- Leitura de CSV robusta (respeita `CSV_SEP` e `CSV_ENCODING`).
- **Sem** `low_memory` quando usa `engine='python'` (corrige o erro reportado).
- Parser pt-BR para `valor_compra`, `valor_cupom`, `repasse_picmoney`.
- Rotas que inicializam o engine on-demand.

## Uso
```bash
python -m venv .venv
# PowerShell:
.\.venv\Scripts\Activate
pip install -r requirements.txt

# Copie os 4 CSVs para ./data (nomes iguais ao .env)
python ingest.py
python app.py
```

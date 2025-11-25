# Projeto13
Projeto 13
-----------------------------------------------------------------------
# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# PicMoney Dashboard Intuitivo

## ADGV

## Integrantes: <a href="https://github.com/AntonioPetri">Antônio Petri</a>, <a href="https://github.com/danmoribe">Daniel Moribe</a>, <a href="https://github.com/paschoalha">Gabriel Paschoal</a>, <a href="https://github.com/vitorzoken">Vitor Kenzo</a>

## Professores Orientadores: <a href="https://br.linkedin.com/in/eduardo-savino">Prof. Eduardo Savino Gomes</a>, <a href="https://www.researchgate.net/profile/Rodnil-Lisboa-2">Prof. Rodnil da Silva Moreira Lisboa</a>, <a href="https://br.linkedin.com/in/lucymari">Profª. Lucy Mari Tabuti</a>, <a href="https://br.linkedin.com/in/mauricio-lopes-da-cunha-5630492a">Prof. Mauricio Lopes Da Cunha</a>

---

## 📖 Descrição

O **PicMoney Dashboard** é uma aplicação acadêmica desenvolvida em **Python (Flask) + SQLite** no backend e **React** no frontend, com o objetivo de analisar dados de consumo e fidelização da startup **PicMoney**.  

O projeto utiliza bases simuladas (10.000 clientes e 100.000 transações de cupons) para gerar análises em tempo real sobre:  
- Ticket médio  
- Receita líquida  
- Margem operacional  
- Distribuição de cupons (produto, desconto, cashback)  
- Categorias de estabelecimentos mais frequentes  
- Performance temporal (período do dia, dias da semana)  

Assim, o sistema apoia decisões estratégicas e demonstra, em ambiente acadêmico, como dados podem ser transformados em insights gerenciais.

---

## 🛠 Estrutura de pastas

-Raiz  
|  
|-->Documentos<br>
   &emsp;|-->Entrega 1<br>
      &emsp;&emsp;|-->Analise Inferencial de Dados<br>
      &emsp;&emsp;|-->Contabilidade e Finanças<br>
      &emsp;&emsp;|-->ES e AS (Engenharia de Software e Arquitetura de Dados)<br>
      &emsp;&emsp;|-->PI Ciência de Dados<br>
      &emsp;&emsp;&emsp;|-->Base de Dados<br>
   &emsp;|-->Entrega 2<br>
   &emsp;&emsp;|-->Analise Inferencial de Dados<br>
   &emsp;&emsp;|-->Contabilidade e Finanças<br>
   &emsp;&emsp;|-->ES e AS (Engenharia de Software e Arquitetura de Dados)<br>
   &emsp;&emsp;|-->PI Ciência de Dados<br>
   &emsp;|-->Banner_FECAP_CCOMP4_ADGV.pdf<br>
   &emsp;|-->Documento - Projeto de Extensão - COM Empresa.docx<br>
   &emsp;|-->Documento - Projeto de Extensão - COM Empresa.pdf<br>
|--> SRC<br>
   &emsp;|-->FRONTEND+BACKEND_TESTE<br>
   &emsp;&emsp;|-->picmoney-app<br>
   &emsp;&emsp;&emsp;|-->backend<br>
   &emsp;&emsp;&emsp;|-->frontend<br>
   &emsp;|-->FRONTEND<br>
   &emsp;&emsp;|-->public<br>
   &emsp;&emsp;|-->src<br>
|.gitignore<br>
|README.md<br>

**documentos**: Entregas acadêmicas (PDFs e relatórios).  
**SRC**: Todo código do projeto.  

---

## ⚙️ Instalação

**Backend (Flask + SQLite):**  
1. Instale dependências:
    
        pip install flask flask-cors pandas matplotlib

2. Rode a API:
    
        python app.py

**Frontend (React):**  
1. Instale dependências:
    
        npm install

2. Rode a aplicação:
    
        npm start

---

## 💻 Configuração para Desenvolvimento

Ferramentas necessárias:  
- Node.js  
- Python 3.x  
- Flask  
- React  
- SQLite

---

## 📋 Licença/License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">PicMoney Dashboard</span> by <span property="cc:attributionName">Antônio Petri, Daniel Moribe, Gabriel Paschoal, Vitor Kenzo</span> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""></a></p>

---

## 🎓 Referências

- PicMoney – Documento Técnico (interno)  
- PicMoney – Definições e bases de dados simuladas (interno)  
- Flask Documentation  
- React Documentation  
- SQLite Documentation


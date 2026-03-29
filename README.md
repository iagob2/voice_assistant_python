# 🎙️ AI Voice Assistant Web App (Whisper + Llama 3 + Flask)

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-LightGrey?logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript)
![Groq](https://img.shields.io/badge/Groq-Free%20API-f55036)
![gTTS](https://img.shields.io/badge/Audio-gTTS-brightgreen)

Um assistente virtual conversacional de ponta a ponta. Este projeto evoluiu de um script local para uma **Aplicação Web Client-Server**, operando com custo zero através de APIs de alta performance.

Ele captura a voz do usuário no navegador, processa o áudio em um backend Python utilizando a **API gratuita da Groq** (modelo Whisper-large-v3 para transcrição e Llama-3.1 para inteligência), e retorna uma resposta sintetizada em áudio usando o Google Text-to-Speech (gTTS) diretamente da memória RAM.

Projeto inspirado no laboratório da [DIO (Digital Innovation One)](https://web.dio.me/), expandido com uma arquitetura de API RESTful preparada para deploy em nuvem.

---

## ⚙️ Arquitetura do Projeto (Client-Server)

A aplicação foi modularizada em duas camadas para proteger credenciais e facilitar o deploy:

1. 🎤 **Frontend (`/frontend`)**
   Interface em HTML/CSS/JS utilizando a `MediaRecorder API` para captura no navegador. Envio do áudio via requisição `POST` (`Fetch API`).

2. 🧠 **Backend (`/backend`)**
   API RESTful em Flask responsável por orquestrar:
   * **STT (Speech-to-Text):** Transcrição ultrarrápida com o modelo Whisper hospedado na Groq.
   * **LLM:** Processamento de linguagem natural usando Llama 3.1 (Groq).
   * **TTS (Text-to-Speech):** Conversão da resposta em áudio com gTTS, processado inteiramente em memória (`io.BytesIO`) para evitar gargalos de I/O em disco.

---

## 🚀 Como Executar Localmente

### 📋 Pré-requisitos
* Python 3.10+
* Chave de API gratuita da [Groq Console](https://console.groq.com/)
* VS Code com a extensão *Live Server*

---

## 🔧 Backend (Flask)

### 1. Clone o repositório e acesse a pasta do backend
```bash
git clone [https://github.com/SEU_USUARIO/voice_assistant_python.git](https://github.com/SEU_USUARIO/voice_assistant_python.git)
cd voice_assistant_python/backend
```

### 2. Crie e ative o ambiente virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure o arquivo `.env`
Crie um arquivo `.env` dentro da pasta `backend/`:
```env
GROQ_API_KEY=gsk_sua_chave_gratuita_aqui
```

### 5. Execute o servidor
```bash
python app.py
```
📍 Backend rodando em: `http://127.0.0.1:5000`

---

## 🌐 Frontend (HTML/JS)

⚠️ O navegador exige um servidor local para habilitar o uso do microfone. Não abra o arquivo com duplo clique (`file://`).

1. Abra a pasta `frontend/` no seu editor de código.
2. No seu arquivo principal JavaScript, garanta que a constante aponta para o localhost:
   ```javascript
   const BACKEND_URL = "[http://127.0.0.1:5000/api/chat](http://127.0.0.1:5000/api/chat)";
   ```
3. Clique com o botão direito no `index.html` e selecione **Open with Live Server**.
4. Clique em **Gravar**, permita o uso do microfone, fale, pare a gravação e ouça a resposta gerada pela IA!

---

## ☁️ Deploy

Esta arquitetura está pronta para ser hospedada:
* **Frontend:** GitHub Pages (gratuito)
* **Backend:** Render, Railway ou Heroku (Web Services)

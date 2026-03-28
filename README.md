# 🎙️ AI Voice Assistant Web App (Whisper + ChatGPT + Flask)

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-LightGrey?logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript)
![OpenAI](https://img.shields.io/badge/OpenAI-Whisper%20%7C%20ChatGPT-412991?logo=openai)
![gTTS](https://img.shields.io/badge/Audio-gTTS-brightgreen)

Um assistente virtual conversacional de ponta a ponta. Este projeto evoluiu de um script local para uma **Aplicação Web Client-Server**.

Ele captura a voz do usuário no navegador, processa o áudio em um backend Python usando a API da OpenAI (Whisper para transcrição e GPT para inteligência), e retorna uma resposta em áudio usando o Google Text-to-Speech (gTTS).

Projeto inspirado no laboratório da [DIO (Digital Innovation One)](https://web.dio.me/), expandido com uma arquitetura de API RESTful preparada para deploy em nuvem.

---

## ⚙️ Arquitetura do Projeto (Client-Server)

A aplicação foi separada em duas camadas:

1. 🎤 **Frontend (Captura)**
   Interface em HTML/CSS/JS utilizando `MediaRecorder API`.

2. 🌐 **Comunicação (API)**
   Envio do áudio via `POST` usando `Fetch API`.

3. 🧠 **Backend (STT & LLM)**
   API em Flask responsável por:

   * Transcrição com Whisper (Speech-to-Text)
   * Resposta com ChatGPT

4. 🔊 **TTS & Reprodução**

   * Conversão em áudio com gTTS
   * Reprodução automática no navegador

---

## 🚀 Como Executar Localmente

### 📋 Pré-requisitos

* Python 3.10+
* Chave da OpenAI
* VS Code (recomendado)

---

## 🔧 Backend (Flask)

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/voice-assistant-python.git
cd voice-assistant-python
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
pip install flask flask-cors openai gTTS python-dotenv
```

### 4. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
```

### 5. Execute o servidor

```bash
python app.py
```

📍 Backend rodando em:

```
http://127.0.0.1:5000
```

---

## 🌐 Frontend (HTML/JS)

⚠️ Não abra com duplo clique (`file://`). Use servidor local.

### 1. Configure a URL do backend

```javascript
const BACKEND_URL = "http://127.0.0.1:5000/api/chat";
```

### 2. Execute com Live Server

* Clique com botão direito no `index.html`
* Selecione **Open with Live Server**

---

## 🎯 Como Usar

1. Clique em **Gravar**
2. Permita acesso ao microfone
3. Faça sua pergunta
4. Pare a gravação
5. Aguarde a resposta em áudio 🎧

---

## ☁️ Deploy (Opcional)

* Frontend: GitHub Pages
* Backend: Render ou Railway

---

## 💡 Tecnologias Utilizadas

* Python (Flask)
* JavaScript (Vanilla)
* OpenAI API (Whisper + GPT)
* gTTS

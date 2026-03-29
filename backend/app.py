from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from openai import OpenAI
from gtts import gTTS
import os
import tempfile
import io  # <-- Importamos a biblioteca para manipulação de memória
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Cliente OpenAI apontando para a Groq
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1" 
)

@app.route('/api/chat', methods=['POST'])
def chat():
    if 'audio' not in request.files:
        return jsonify({"error": "Nenhum arquivo de áudio recebido"}), 400

    audio_file = request.files['audio']
    
    # Continuamos salvando o arquivo de entrada temporariamente (necessário para a API do Whisper)
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_audio_in:
        audio_file.save(temp_audio_in.name)
        temp_audio_in_path = temp_audio_in.name

    try:
        # 1. Transcrever áudio (Whisper na Groq)
        with open(temp_audio_in_path, "rb") as audio_for_whisper:
            transcript = client.audio.transcriptions.create(
                model="whisper-large-v3", 
                file=audio_for_whisper
            )
        user_text = transcript.text
        print(f"Usuário disse: {user_text}")

        # 2. Obter resposta da IA (Llama 3.1 na Groq)
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Você é um assistente de voz prestativo e conciso. Responda em português de forma natural e falada."},
                {"role": "user", "content": user_text}
            ]
        )
        ai_text = completion.choices[0].message.content
        print(f"IA respondeu: {ai_text}")

        # 3. Converter texto em áudio NA MEMÓRIA RAM
        tts = gTTS(text=ai_text, lang='pt')
        mp3_buffer = io.BytesIO() # Cria o arquivo virtual
        tts.write_to_fp(mp3_buffer) # Grava o áudio dentro dele
        mp3_buffer.seek(0) # Volta o ponteiro de leitura para o início do arquivo

        # 4. Retornar MP3 direto da memória para o Frontend
        return send_file(
            mp3_buffer,
            mimetype="audio/mpeg",
            as_attachment=True,
            download_name="response.mp3"
        )

    except Exception as e:
        print(f"Erro no processamento: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        # Só precisamos deletar o arquivo de entrada agora! O de saída nunca existiu no disco.
        if os.path.exists(temp_audio_in_path):
            try:
                os.remove(temp_audio_in_path)
            except Exception as cleanup_error:
                print(f"Aviso de limpeza: {cleanup_error}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
/**
 * ===================================
 * ASSISTENTE DE VOZ COM IA
 * ===================================
 * 
 * Script responsável por:
 * - Capturar áudio do microfone do usuário
 * - Enviar para processamento no backend
 * - Reproduzir resposta de áudio do servidor
 * 
 * Dependências: Backend rodando em BACKEND_URL
 * Permissões necessárias: Acesso ao microfone
 */

// ===== CONFIGURAÇÕES =====
// URL do servidor backend - ALTERAR para produção (Render/Railway)
const BACKEND_URL = "http://127.0.0.1:5000/api/chat";

// ===== VARIÁVEIS GLOBAIS =====
/** @type {MediaRecorder} Objeto para gravação de áudio do navegador */
let mediaRecorder;

/** @type {Array<Blob>} Array que armazena os chunks de áudio gravados */
let audioChunks = [];

/** @type {boolean} Flag para controlar o estado da gravação (gravando ou não) */
let isRecording = false;

// ===== ELEMENTOS DO DOM =====
// Botão para iniciar/parar gravação
const recordBtn = document.getElementById('recordBtn');

// Elemento para exibir status da aplicação
const statusText = document.getElementById('status');

// Elemento de áudio para reproduzir resposta do servidor
const audioPlayer = document.getElementById('audioPlayer');

recordBtn.addEventListener('click', async () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});



async function startRecording() {
    try {
        //Pede permissão ao usuário para usar o microfone. Se ele negar, cai no catch.
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        //Cria o gravador usando a "corrente" de áudio vinda do microfone. O MediaRecorder é uma API nativa do navegador que facilita a captura de áudio.
        mediaRecorder = new MediaRecorder(stream);

        //Este evento é disparado constantemente enquanto você fala. Ele pega cada pedaço de áudio e joga dentro do nosso array audioChunks
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };


        //Dizer ao script: "Assim que o gravador parar, chame a função sendAudioToBackend.
        mediaRecorder.onstop = sendAudioToBackend;

        audioChunks = [];
        mediaRecorder.start();
        isRecording = true;

        recordBtn.textContent = "Parar Gravação";
        recordBtn.classList.add("recording");
        statusText.textContent = "Ouvindo...";

    } catch (err) {
        console.error("Erro ao acessar microfone:", err);
        statusText.textContent = "Erro: Permita o acesso ao microfone.";
    }
}

function stopRecording() {
    //Interrompe a captura. O evento onstop é disparado, o que aciona a função sendAudioToBackend para processar o áudio.
    mediaRecorder.stop();
    // Para as tracks de áudio para liberar o microfone
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    isRecording = false;

    recordBtn.textContent = "Gravar";
    recordBtn.classList.remove("recording");
    statusText.textContent = "Processando áudio com a IA...";
    recordBtn.disabled = true; // Evita cliques múltiplos
}

async function sendAudioToBackend() {
    // Cria um blob a partir dos chunks gravados. O navegador geralmente usa audio/webm.
    // Ele pega todos aqueles "pedacinhos" de áudio guardados e cola tudo em um único arquivo digital.
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
        console.log("Enviando áudio para:", BACKEND_URL);
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro no servidor: ${response.status} - ${response.statusText}`);
        }

        // Recebe o blob do MP3 gerado pelo backend
        const audioResponseBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioResponseBlob);

        // Toca automaticamente
        audioPlayer.src = audioUrl;
        audioPlayer.play();
        statusText.textContent = "Resposta pronta!";

        audioPlayer.onended = () => {
            statusText.textContent = "Pronto para ouvir.";
        };

    } catch (error) {
        console.error("Erro ao enviar áudio:", error);
        statusText.textContent = "Erro ao processar áudio: " + error.message;
    } finally {
        recordBtn.disabled = false;
    }
}

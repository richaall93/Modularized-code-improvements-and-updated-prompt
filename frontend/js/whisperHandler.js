// whisperHandler.js - Handles Speech-to-Text (STT)
let mediaRecorder;
let audioChunks = [];
const startButton = document.getElementById("voiceBtn");
const stopButton = document.getElementById("stopTTSBtn");

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            console.log("🎤 Recording stopped...");
        
            if (audioChunks.length === 0) {
                console.error("🚨 No audio data available.");
                return;
            }
        
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks =[]; // ✅ Clear audio buffer after use
        
            const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
        
            const formData = new FormData();
            formData.append("audio", audioFile, "recording.webm"); // Ensure consistency
        
            console.log("📡 Sending audio for transcription...");
        
            try {
                const response = await fetch("/api/whisper", {
                    method: "POST",
                    body: formData,
                });
        
                console.log("Fetch response:", response); // Log the response object
        
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Transcription response data:", data); // Log the parsed data
        
                if (data.transcription) {
                    console.log("✅ Transcribed Text:", data.transcription);
              
                    // 1) Put the text into the chat input
                    const chatInput = document.getElementById("chatInput");
                    chatInput.value = data.transcription;
              
                    // 2) Automatically “click” the send button so the AI receives it
                    const chatBtn = document.getElementById("chatBtn");
                    chatBtn.click();
              
                } else {
                    console.error("❌ Error in transcription:", data.error);
                }
        
            } catch (error) {
                console.error("❌ Whisper API Error:", error);
            }
        };
        mediaRecorder.start();
        console.log("🎤 Recording started...");
        
        // ✅ Auto-stop recording after 5 seconds
        setTimeout(() => {
            if (mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        }, 5000);
    } catch (error) {
        console.error("❌ Microphone access denied:", error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
}

// ✅ Attach event listeners
if (startButton) {
    startButton.addEventListener("click", startRecording);
}

if (stopButton) {
    stopButton.addEventListener("click", stopRecording);
}

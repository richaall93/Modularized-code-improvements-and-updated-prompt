// ttsHandler.js - Converts AI responses to speech
let aiAudio = null;

export async function startTTS(text) {
    try {
        const response = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error("Failed to fetch TTS audio");

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        aiAudio = new Audio(audioUrl);
        aiAudio.play();
    } catch (error) {
        console.error("Error in TTS:", error);
    }
}

export function stopTTS() {
    if (aiAudio) {
        aiAudio.pause();
        aiAudio.currentTime = 0;
        aiAudio = null;
    }
}

// Optionally, add a listener for the stop button
document.addEventListener("DOMContentLoaded", () => {
    const stopButton = document.getElementById("stopTTSBtn");
    if (stopButton) {
        stopButton.addEventListener("click", stopTTS);
    }
});

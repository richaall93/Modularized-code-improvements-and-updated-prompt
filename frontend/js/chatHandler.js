import { addMessageToChat } from "./ui.js";
import { startTTS } from "./ttsHandler.js";
import { saveMessageToActiveChat } from "./chatListHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded!");

    // Get send button & input field
    const sendButton = document.getElementById("chatBtn");
    const inputField = document.getElementById("chatInput");

    if (sendButton) {
        sendButton.addEventListener("click", () => {
            if (inputField.value.trim()) {
                sendMessage(inputField.value);
                inputField.value = "";
            }
        });
    } else {
        console.error("❌ ERROR: Send button (chatBtn) not found!");
    }

    // ✅ Listen for Enter key press in input field
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent accidental form submission
            if (inputField.value.trim()) {
                sendMessage(inputField.value);
                inputField.value = "";
            }
        }
    });
});

export async function sendMessage(userMessage) {
    addMessageToChat(userMessage, "user");
    saveMessageToActiveChat("user", userMessage);

    try {
        const response = await fetch(`/api/chat?message=${encodeURIComponent(userMessage)}`);

        if (!response.body) {
            throw new Error("Empty response body from AI.");
        }

        // ✅ Read the streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let aiResponse = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // ✅ Process streaming data properly
            chunk.split("\n").forEach((line) => {
                if (line.startsWith("data: ")) {
                    const jsonData = line.replace("data: ", "").trim();

                    if (jsonData !== "[DONE]") {
                        try {
                            const parsedData = JSON.parse(jsonData);
                            if (parsedData.text) {
                                aiResponse += parsedData.text + " "; // ✅ Add spaces between words
                            }
                        } catch (err) {
                            console.error("🚨 Error parsing AI response:", err);
                        }
                    }
                }
            });
        }

        // ✅ Add the full response as one message
        const finalResponse = aiResponse.trim();
        addMessageToChat(finalResponse, "ai");

        saveMessageToActiveChat("ai", finalResponse);
        // ✅ Trigger TTS to play the AI's spoken response
        startTTS(finalResponse);

    } catch (error) {
        console.error("🚨 Error sending message:", error);
        addMessageToChat("⚠️ Error: AI is not responding properly.", "ai");
        saveMessageToActiveChat("ai", "⚠️ Error: AI is not responding properly.");
    }
}

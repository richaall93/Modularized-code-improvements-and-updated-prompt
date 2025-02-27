// ui.js - Handles UI interactions and updates
export function addMessageToChat(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    const timestamp = document.createElement("span");

    // ✅ Apply existing classes from your CSS
    messageContainer.classList.add("chat-message", sender); // Uses `user` or `ai`
    textContainer.classList.add("chat-text");
    timestamp.classList.add("timestamp");

    textContainer.innerText = message;
    timestamp.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageContainer.appendChild(textContainer);
    messageContainer.appendChild(timestamp);

    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

export function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// ✅ Only attach event listener if themeToggle exists
document.addEventListener("DOMContentLoaded", () => {
    // Changed from "darkModeToggle" to "themeToggle" to match HTML
    const darkModeToggle = document.getElementById("themeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", toggleDarkMode);
    }
});

console.log("ui.js successfully!");

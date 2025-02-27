// storage.js - Manages chat history in localStorage
export function saveChats(chatHistory) {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

export function loadChats() {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
}

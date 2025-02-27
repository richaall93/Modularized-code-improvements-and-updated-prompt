// chatListHandler.js
import { saveChats, loadChats } from "./storage.js";
import { addMessageToChat } from "./ui.js";

// We'll store chats in an object: { chatId: { name, messages: [] }, ... }
let chatHistory = loadChats();  
let currentChatId = null;

document.addEventListener("DOMContentLoaded", () => {
    const newChatBtn = document.getElementById("newChatBtn");
    const chatList = document.getElementById("chatList");

    // "New Chat" button creates a new chat
    if (newChatBtn) {
        newChatBtn.addEventListener("click", createNewChat);
    }

    // Initially render existing chats in the sidebar
    updateChatList();

    // (Optional) auto-load the first chat if any exist
    const chatIds = Object.keys(chatHistory);
    if (chatIds.length > 0) {
        loadChat(chatIds[0]);
    }
});

/** Creates a new chat entry and saves to localStorage */
function createNewChat() {
    const chatId = `chat-${Date.now()}`; // unique ID
    chatHistory[chatId] = {
        name: `Chat ${Object.keys(chatHistory).length + 1}`,
        messages: []
    };
    saveChats(chatHistory);
    updateChatList();
    loadChat(chatId); // Set new chat as the active chat immediately
}

/** Refreshes the <ul id="chatList"> with current chats */
function updateChatList() {
    const chatList = document.getElementById("chatList");
    chatList.innerHTML = "";

    // Loop through each chat in chatHistory
    Object.entries(chatHistory).forEach(([chatId, chatData]) => {
        const li = document.createElement("li");
        li.classList.add("chat-entry");
        li.textContent = chatData.name;

        // Add an "options" button (…)
        const optionsButton = document.createElement("button");
        optionsButton.classList.add("chat-options-button");
        optionsButton.innerHTML = "…";
        optionsButton.addEventListener("click", (event) => {
            // Stop click from loading the chat
            event.stopPropagation();
            showChatOptions(chatId, li);
        });

        // Clicking on the list item loads that chat
        li.addEventListener("click", () => {
            loadChat(chatId);
        });

        li.appendChild(optionsButton);
        chatList.appendChild(li);
    });
}

/** Displays a small context menu with Rename/Delete */
function showChatOptions(chatId, liElement) {
    // Remove any existing menu
    const existingMenu = liElement.querySelector(".chat-options-menu");
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    // Ensure the parent li has position relative
    liElement.style.position = "relative";

    // Create the options menu element
    const menu = document.createElement("div");
    menu.classList.add("chat-options-menu");

    const renameOption = document.createElement("div");
    renameOption.innerText = "Rename";
    renameOption.addEventListener("click", (event) => {
        event.stopPropagation();
        renameChat(chatId);
        menu.remove();
    });

    const deleteOption = document.createElement("div");
    deleteOption.innerText = "Delete";
    deleteOption.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteChat(chatId);
        menu.remove();
    });

    menu.appendChild(renameOption);
    menu.appendChild(deleteOption);
    liElement.appendChild(menu);

    // Delay adding the document click listener to prevent immediate removal
    setTimeout(() => {
        document.addEventListener("click", function handleClickOutside(e) {
            if (!liElement.contains(e.target)) {
                menu.remove();
                document.removeEventListener("click", handleClickOutside);
            }
        });
    }, 0);
}


/** Rename an existing chat */
function renameChat(chatId) {
    const newName = prompt("Rename chat:", chatHistory[chatId].name);
    if (newName) {
        chatHistory[chatId].name = newName;
        saveChats(chatHistory);
        updateChatList();
    }
}

/** Delete a chat from localStorage */
function deleteChat(chatId) {
    if (confirm("Are you sure you want to delete this chat?")) {
        delete chatHistory[chatId];
        saveChats(chatHistory);
        updateChatList();

        // If we deleted the currently loaded chat, clear the chat window
        if (chatId === currentChatId) {
            currentChatId = null;
            const chatBox = document.getElementById("chat-box");
            if (chatBox) chatBox.innerHTML = "";
        }
    }
}

/** Load a chat’s messages into the chat window */
function loadChat(chatId) {
    currentChatId = chatId;

    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return;

    // Clear the existing messages
    chatBox.innerHTML = "";

    // Show each saved message
    chatHistory[chatId].messages.forEach(({ sender, text }) => {
        addMessageToChat(text, sender);
    });
}

/** Public helper: save a new message to the currently loaded chat */
export function saveMessageToChat(chatId, text, sender) {
    if (!chatHistory[chatId]) {
        // If chat is missing, create it
        chatHistory[chatId] = {
            name: `Chat ${Object.keys(chatHistory).length + 1}`,
            messages: []
        };
    }
    chatHistory[chatId].messages.push({ sender, text });
    saveChats(chatHistory);
}

/** Public helper: get which chat is currently loaded */
export function getCurrentChatId() {
    return currentChatId;
}

export function saveMessageToActiveChat(sender, text) {
    const currentChat = getCurrentChatId();
    if (!currentChat) {
        console.warn("No active chat found!");
        return;
    }
    saveMessageToChat(currentChat, text, sender);
}

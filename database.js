import { db } from "./public/firebaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Save chat to Firestore
async function saveChat(userId, message) {
  try {
    await addDoc(collection(db, "chats"), {
      userId,
      message,
      timestamp: new Date()
    });
    console.log("Chat saved!");
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

// Get all user chats
async function getChats() {
  try {
    const querySnapshot = await getDocs(collection(db, "chats"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error("Error getting chats:", error);
  }
}

export { saveChat, getChats };

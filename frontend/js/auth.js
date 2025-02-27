import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { app } from "./firebaseConfig.js";

// ✅ Initialize Firebase Auth
export const auth = getAuth(app);
window.auth = auth;  // Keep this for debugging

// ✅ Export functions properly for imports
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("✅ Login Successful!", userCredential.user);
            window.location.href = "chat.html";  // ✅ Redirect after login
        })
        .catch((error) => {
            console.error("❌ Login Failed:", error.message);
        });
}

export function logoutUser() {
    return signOut(auth)
        .then(() => {
            console.log("✅ Successfully logged out!");
            window.location.href = "home.html";  // ✅ Redirect after logout
        })
        .catch((error) => {
            console.error("❌ Logout failed:", error.message);
        });
}

// ✅ Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ User is logged in:", user);
    } else {
        console.log("❌ No user logged in");
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyANlUjSn8TypQ43ZIaVe0_QfJeHJd41C4Y",
  authDomain: "oui-madamoiselle.firebaseapp.com",
  projectId: "oui-madamoiselle",
  storageBucket: "oui-madamoiselle.firebasestorage.app",
  messagingSenderId: "363843119024",
  appId: "1:363843119024:web:a9421a0ab5d0feb8011875",
  measurementId: "G-CNK5HNLWKB"
};

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Log Firebase to confirm it's working
console.log("Firebase Initialized:", app);

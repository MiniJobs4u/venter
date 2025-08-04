// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (převzato z tvého dřívějšího zadání)
const firebaseConfig = {
  apiKey: "AIzaSyC_o0KdjvVu0lCYzMXIu-eTiIb5T9fWN6A",
  authDomain: "ventr-def25.firebaseapp.com",
  projectId: "ventr-def25",
  storageBucket: "ventr-def25.appspot.com",
  messagingSenderId: "503251907534",
  appId: "1:503251907534:web:3e975349ca0243640bb19f",
  measurementId: "G-LTFX9N9RJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

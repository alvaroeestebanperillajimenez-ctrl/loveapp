import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCVA41HtKruo-blD3B-hOBZSk2CINV5YHc",
    authDomain: "chat-b9fb7.firebaseapp.com",
    projectId: "chat-b9fb7",
    storageBucket: "chat-b9fb7.firebasestorage.app",
    messagingSenderId: "935441099626",
    appId: "1:935441099626:web:01532135e3a1f34e6ed313",
    measurementId: "G-DP13KXFBM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

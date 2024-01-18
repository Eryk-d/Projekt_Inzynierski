import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';


const firebaseConfig = {
    apiKey: "AIzaSyCl1-hHTFZgUr2BetWAGG6wRg1snK-0k-s",
    authDomain: "inzynierka1-48330.firebaseapp.com",
    projectId: "inzynierka1-48330",
    storageBucket: "inzynierka1-48330.appspot.com",
    messagingSenderId: "488595151713",
    appId: "1:488595151713:web:bd533a39db14cb5d334320"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
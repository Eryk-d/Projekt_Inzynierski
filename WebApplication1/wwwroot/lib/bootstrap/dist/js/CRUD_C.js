import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const form = document.querySelector('#form1');
const title = document.querySelector('#title');
const login = document.querySelector('#login');
const pass = document.querySelector('#pass');

async function generateKeyFromPassword(password, salt) {
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 }, // Wybierz długość klucza: 128 lub 256 bitów
        true,
        ['encrypt', 'decrypt']
    );
}

// Zaktualizuj funkcję szyfrowania, aby używała generateKeyFromPassword
async function encryptData(plainText, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Generuj unikalny salt
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generuj losowy IV
    const key = await generateKeyFromPassword(password, salt); // Generuj klucz z hasła i salt
    const algo = { name: 'AES-GCM', iv: iv };
    const encoded = new TextEncoder().encode(plainText);
    const encrypted = await window.crypto.subtle.encrypt(algo, key, encoded);

    return {
        encrypted: window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted))),
        iv: window.btoa(String.fromCharCode.apply(null, iv)),
        salt: window.btoa(String.fromCharCode.apply(null, salt)), // Zwróć salt również, będzie potrzebny do deszyfrowania
    };
}

// Funkcja obsługi formularza
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = "123"; // Uwaga: używaj bezpieczniejszych metod generowania kluczy w produkcji
    const encryptedData = await encryptData(pass.value, password);

    try {
        const docRef = await addDoc(collection(db, "passwords"), {
            title: title.value,
            login: login.value,
            pass: encryptedData.encrypted,
            iv: encryptedData.iv,
            salt: encryptedData.salt, // Przechowuj salt razem z zaszyfrowanymi danymi
            uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
        alert('Pomyślnie dodano nowe dane logowania.\nStrona zostanie odświeżona');
        location.reload();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

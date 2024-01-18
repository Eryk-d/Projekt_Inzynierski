// Importowanie potrzebnych modułów
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "/lib/bootstrap/dist/js/Config.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Inicjalizacja Firestore
const db = getFirestore();

// Funkcja rejestracji użytkownika
async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Utworzenie referencji do dokumentu w kolekcji 'users'
        const userRef = doc(db, "users", user.uid);

        // Zapisanie dodatkowych danych użytkownika
        await setDoc(userRef, {
            email: email
        });

        console.log("Użytkownik został zarejestrowany i dane zostały zapisane: ", user);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Błąd rejestracji: ", errorCode, errorMessage);
    }
}

// Obsługa przycisku "Zarejestruj się"
document.getElementById("but_zarejestruj").addEventListener("click", function () {
    // Pobierz wartości z pól formularza
    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    // Wywołaj funkcję rejestracji użytkownika
    registerUser(email, password);
});
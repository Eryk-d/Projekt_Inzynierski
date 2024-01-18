import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "/lib/bootstrap/dist/js/Config.js";

const email = document.querySelector("#inputEmail");
const password = document.querySelector("#inputPassword");
const loginButton = document.querySelector("#but_zaloguj");  // Dodano selektor przycisku logowania

loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            // Przekierowanie do akcji Index2 kontrolera HomeController (lub innego kontrolera, jeśli Index2 należy do innego)
            window.location = "/Home/Index2";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            openModal("Podane dane są niepoprawne.");  // Funkcja modalna do wyświetlania błędów
        });
});

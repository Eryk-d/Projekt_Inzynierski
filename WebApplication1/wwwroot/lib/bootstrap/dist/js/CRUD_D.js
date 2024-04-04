import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";


// Definiowanie funkcji, która zostanie wywołana po kliknięciu przycisku
function showAlert() {
    alert('Przycisk został kliknięty!');
}

// Dodawanie nasłuchiwacza zdarzeń do przycisku
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('delete_pass').addEventListener('click', showAlert);
});

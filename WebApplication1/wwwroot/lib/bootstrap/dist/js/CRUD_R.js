// Główny plik JavaScript
import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
const card = document.querySelector('#card');

onAuthStateChanged(auth, user => {
    if (user) {
        console.log(user.uid);
        getDataFromFirestore(user.uid); // Pobierz dane tylko gdy użytkownik jest zalogowany
    } else {
        console.log("Brak zalogowanego użytkownika.");
    }
});

async function getDataFromFirestore(userId) {
    const q = query(collection(db, "passwords"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        card.innerHTML +=
            `<div class="card" style="background-color: #40C9FF; border: 3px solid black;">
            <div class="card-body">
                <p>Nazwa: ${item.title}</p>
                <p>Login: ${item.login}</p>
                <p>Haslo: ${item.pass}</p>
            </div>
        </div><br>`;
    });
}

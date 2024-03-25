import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const card = document.querySelector('#card');
const form = document.querySelector('#form2');
const keys = document.querySelector('#keys');

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

async function decryptData(encryptedData, ivBase64, saltBase64, password) {
    const iv = base64ToArrayBuffer(ivBase64);
    const salt = base64ToArrayBuffer(saltBase64);
    const key = await generateKeyFromPassword(password, salt);
    const encrypted = base64ToArrayBuffer(encryptedData);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
    );

    return new TextDecoder().decode(decrypted);
}

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
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

async function deleteDocument(docId) {
    try {
        await deleteDoc(doc(db, "passwords", docId));
        console.log(`Dokument ${docId} został usunięty.`);
        // Tutaj możesz również odświeżyć listę dokumentów, aby odzwierciedlić usunięcie.
    } catch (error) {
        console.error("Błąd podczas usuwania dokumentu: ", error);
    }
}


function getDataFromFirestore(userId) {
    const q = query(collection(db, "passwords"), where("uid", "==", userId));
    getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {
            const item = doc.data();
            // Odszyfrowanie hasła przed wyświetleniem
            const decryptedPass = await decryptData(item.pass, item.iv, item.salt, keys.value); //pobieramy keys z form2
            card.innerHTML +=
                `<div class="card" style="background-color: #40C9FF; border: 3px solid black;">
            <div class="card-body">
                <p>Nazwa: ${item.title}</p>
                <p>Login: ${item.login}</p>
                <p>Hasło: ${decryptedPass}</p> <!-- Wyświetlanie odszyfrowanego hasła -->
                <button type="button" class="delete_pass" data-doc-id="${doc.id}">Usuń</button>
            </div>
        </div><br>`;

        });
    }).catch(error => {
        console.error("Error getting documents: ", error);
        alert("nie dziala");
    });
}



form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Zapobiega domyślnej akcji przeglądarki (np. przeładowaniu strony)

    onAuthStateChanged(auth, user => {
        if (user) {
            console.log(user.uid);
            getDataFromFirestore(user.uid);
        } else {
            console.log("Brak zalogowanego użytkownika.");
        }
    });

});

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete_pass')) {
        const docId = e.target.getAttribute('data-doc-id');
        deleteDocument(docId);
    }
});


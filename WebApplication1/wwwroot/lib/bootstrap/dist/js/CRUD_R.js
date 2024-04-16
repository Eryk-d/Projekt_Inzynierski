import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { deleteDoc, doc, updateDoc  } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

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
        console.log(docId)
        await deleteDoc(doc(db, "passwords", docId));
        console.log(`Dokument ${docId} został usunięty.`);
        location.reload()
    } catch (error) {
        console.error("Błąd podczas usuwania dokumentu: ", error);
    }
}


function getDataFromFirestore(userId) {
    const q = query(collection(db, "passwords"), where("uid", "==", userId));
    getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {
            const item = doc.data();
            const decryptedPass = await decryptData(item.pass, item.iv, item.salt, keys.value);
            card.innerHTML +=
                `<div class="card" style="background-color: #40C9FF; border: 3px solid black;">
                    <div class="card-body">
                        <p>Nazwa: ${item.title}</p>
                        <p>Login: ${item.login}</p>
                        <p>Hasło: ${decryptedPass}</p>
                        <button type="button" class="btn btn-danger delete_pass" data-doc-id="${doc.id}">Usuń</button>
                        <button type="button" class="btn btn-primary update_pass" data-doc-id="${doc.id}" data-title="${item.title}" data-login="${item.login}" data-pass="${decryptedPass}">Aktualizuj</button>
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
        // Dodanie okna z zapytaniem przed usunięciem
        const isConfirmed = confirm("Czy na pewno chcesz usunąć ten element?");
        if (isConfirmed) {
            // Jeśli użytkownik kliknął "OK", kontynuuj z usunięciem
            deleteDocument(docId);
            //location.reload();
        } else {
            // Jeśli użytkownik kliknął "Anuluj", nie rób nic
            console.log("Operacja usunięcia anulowana.");
        }
    }
});

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('update_pass')) {
        const docId = e.target.getAttribute('data-doc-id');
        const title = e.target.getAttribute('data-title');
        const login = e.target.getAttribute('data-login');
        const password = e.target.getAttribute('data-pass');
        const keys = document.getElementById('keys').value;  // Pobierz wartość z pierwszego inputu

        // Wypełnienie formularza danymi i dodanie klas Bootstrap
        const updateDiv = document.getElementById('update_password');
        updateDiv.innerHTML = `
            <form id="updateForm" class="p-3">
                <input type="hidden" name="docId" value="${docId}" />
                <div class="mb-3">
                    <label for="title" class="form-label">Nazwa:</label>
                    <input type="text" class="form-control" id="title" name="title" value="${title}" required />
                </div>
                <div class="mb-3">
                    <label for="login" class="form-label">Login:</label>
                    <input type="text" class="form-control" id="login" name="login" value="${login}" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Hasło:</label>
                    <input type="text" class="form-control" id="password" name="password" value="${password}" required />
                </div>
                <div class="mb-3">
                    <label for="keys" class="form-label">Klucz:</label>
                    <input type="text" class="form-control" id="keys" name="keys" placeholder="Podaj Klucz" value="${keys}" required />
                </div>
                <button type="submit" class="btn btn-primary">Zapisz zmiany</button>
            </form><hr>`;
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const updateDiv = document.getElementById('update_password');

    // Obsługa zdarzenia submit dla formularza aktualizacji
    updateDiv.addEventListener('submit', async function (event) {
        event.preventDefault(); // Zapobieganie standardowemu zachowaniu formularza

        const form = event.target;
        const docId = form.docId.value;
        const title = form.title.value;
        const login = form.login.value;
        const password = form.password.value;
        const userKey = "asdfg"; // Klucz użytkownika do szyfrowania, załóżmy, że jest dostępny

        try {
            // Szyfrowanie hasła przed aktualizacją
            const encryptedData = await encryptData(password, userKey);

            // Uaktualnienie dokumentu w Firestore
            await updateDoc(doc(db, "passwords", docId), {
                title: title,
                login: login,
                pass: encryptedData.encrypted, // Zaszyfrowane hasło
                iv: encryptedData.iv, // IV użyte do szyfrowania
                salt: encryptedData.salt // Salt użyty do szyfrowania
            });
            console.log('Dokument został zaktualizowany');
            alert('Dane zostały zaktualizowane');
            location.reload(); // Opcjonalnie, odświeżenie strony
        } catch (error) {
            console.error("Błąd podczas aktualizacji dokumentu: ", error);
            alert('Nie udało się zaktualizować danych');
        }
    });
});


//modul aktualizacji



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


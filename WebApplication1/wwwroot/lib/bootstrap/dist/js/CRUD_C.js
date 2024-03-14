import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const form = document.querySelector('#form1');
const title = document.querySelector('#title');
const login = document.querySelector('#login');
const pass = document.querySelector('#pass');

form.addEventListener('submit', async (event)=>
    {
    event.preventDefault();
    console.log(title.value);
    try {
        const docRef = await addDoc(collection(db, "passwords"), {
            title: title.value,
            login: login.value,
            pass: pass.value,
            uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
        alert('Pomyślnie dodano nowe dane logowania.\nStrona zostanie odświeżona');
        location.reload();

    } catch (e) {
        console.error("Error adding document: ", e);
    }
    }
)
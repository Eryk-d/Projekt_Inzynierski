import { auth, db } from "/lib/bootstrap/dist/js/Config.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const form = document.querySelector('#form');
const pass = document.querySelector('#pass');
const title = document.querySelector('#title');
const login = document.querySelector('#login');
const card = document.querySelector('#card');
async function getDataFromFirestore()
{
    const arr = []
    const querySnapshot = await getDocs(collection(db, "passwords"));
    querySnapshot.forEach((doc) => {
        arr.push(doc.data());
        });
    arr.map((item) => {
        card.innerHTML += 
        `<div class="card" style="background-color: #40C9FF; border: 3px solid black;">
             <div class="card-body">
             <p>Nazwa: ${item.title}</p>
             <p>Login: ${item.login}</p>
             <p>Haslo: ${item.pass}</p>
            </div>
        </div><br>`
    });

}
getDataFromFirestore()


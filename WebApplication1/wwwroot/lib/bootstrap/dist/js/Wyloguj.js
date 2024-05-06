import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "/lib/bootstrap/dist/js/Config.js";

const logout = document.querySelector('#logout-btn');
logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = '/'
        //alert('Zostaniesz Wylogowany')
    }).catch((error) => {
        console.log(error);
    });
})
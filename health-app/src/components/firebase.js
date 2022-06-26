
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase } from "firebase/database";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-bLTaNmbxcjoq2WtVw1J0dOcLxs-N4Kk",
    authDomain: "healthwatchapp-e636f.firebaseapp.com",
    databaseURL: "https://healthwatchapp-e636f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "healthwatchapp-e636f",
    storageBucket: "healthwatchapp-e636f.appspot.com",
    messagingSenderId: "102608909034",
    appId: "1:102608909034:web:8997e387ef40c93311dd93",
    measurementId: "G-FHMMWVFSXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Get a reference to the database service
const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

var email = document.getElementById("email").value;
var password = document.getElementById("password").value;
// var first_name = document.getElementById("first_name").value; 

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // document.cookie = "charge_evolution_token=" + result.token;
        window.location.href = '/';
        console.log("new user");
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log("fuck");
        // ..
    });

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        Swal.fire({
            title: 'Success',
            text: "result.msg",
            icon: 'success',
            customClass: "swal_ok_button",
            confirmButtonColor: "#6a98ce"
        }).then(function () {
            // document.cookie = "charge_evolution_token=" + result.token;
            window.location.href = '/';
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            customClass: "swal_ok_button",
            confirmButtonColor: "#242424"
        })
    });
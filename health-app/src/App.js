
import React from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import LoginRegister from './components/pages/LoginRegister'
import MyProfile from './components/MyProfile/MyProfile'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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


function App() {
  return (
    <>
      <Router>
      <Navbar />
      <Routes>
        <Route path='/loginregister' element =
          {<LoginRegister/>}/>
        <Route path='/' element =
        {<Home/>} />
        <Route path='/home' element =
        {<Home/>} />
        <Route path='/myprofile' element =
        {<MyProfile/>} />
      </Routes>
      </Router>

    </>
   
  );
}

export default App;

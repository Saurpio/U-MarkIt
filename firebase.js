// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh3lN6vr4Ad7RrttyBzlh8-hkjaXpP6cA",
  authDomain: "flashcardsaas-1b3a3.firebaseapp.com",
  projectId: "flashcardsaas-1b3a3",
  storageBucket: "flashcardsaas-1b3a3.appspot.com",
  messagingSenderId: "973503413956",
  appId: "1:973503413956:web:1b4131363695be26ccd391",
  measurementId: "G-139MW2YBZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}
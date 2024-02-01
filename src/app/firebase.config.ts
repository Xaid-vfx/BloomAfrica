// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtt5_12BOHY2qKn8uKi7Jm8bypj1d9mxs",
  authDomain: "bloom-cb4b9.firebaseapp.com",
  projectId: "bloom-cb4b9",
  storageBucket: "bloom-cb4b9.appspot.com",
  messagingSenderId: "1083995840652",
  appId: "1:1083995840652:web:b2e4d0e73c9694d67b5ba9",
  measurementId: "G-SXP0D5FF5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }
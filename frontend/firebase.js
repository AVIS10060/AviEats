// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "avieats.firebaseapp.com",
  projectId: "avieats",
  storageBucket: "avieats.firebasestorage.app",
  messagingSenderId: "567723789654",
  appId: "1:567723789654:web:5447e5a849555ced905af7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)


export {app,auth}
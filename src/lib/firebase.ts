// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-7848553620-773f9",
  "appId": "1:1048587881635:web:9bca258e10cef119d4c316",
  "storageBucket": "studio-7848553620-773f9.firebasestorage.app",
  "apiKey": "AIzaSyDvWDCW_ZQ83qtZSg8Wqwks8tGRIePl818",
  "authDomain": "studio-7848553620-773f9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1048587881635"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };

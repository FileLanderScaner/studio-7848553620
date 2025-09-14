// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

// Initialize App Check
if (typeof window !== 'undefined') {
  const appCheckDebugToken = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
  
  if (process.env.NODE_ENV === 'development' && appCheckDebugToken) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckDebugToken;
  }
  
  initializeAppCheck(app, {
    // TODO: Replace with your reCAPTCHA v3 site key
    provider: new ReCaptchaV3Provider('6Ld-............-..........._....'),
    isTokenAutoRefreshEnabled: true
  });
}


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };

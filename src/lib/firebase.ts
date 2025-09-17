// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvWDCW_ZQ83qtZSg8Wqwks8tGRIePl818",
  authDomain: "studio-7848553620-773f9.firebaseapp.com",
  databaseURL: "https://studio-7848553620-773f9-default-rtdb.firebaseio.com",
  projectId: "studio-7848553620-773f9",
  storageBucket: "studio-7848553620-773f9.firebasestorage.app",
  messagingSenderId: "1048587881635",
  appId: "1:1048587881635:web:9bca258e10cef119d4c316",
  measurementId: "G-BE09ELLNHX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics
if (typeof window !== 'undefined') {
    getAnalytics(app);
}


// Initialize App Check
if (typeof window !== 'undefined') {
  // In a development environment, the domain is not authorized for reCAPTCHA.
  // To solve this, we set the debug token for App Check.
  if (process.env.NODE_ENV !== 'production') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (recaptchaKey && recaptchaKey !== 'REEMPLAZAR_CON_TU_CLAVE_DE_SITIO_RECAPTCHA') {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    console.warn('Firebase App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set or is a placeholder. App Check is not enabled. This is expected for local development but required for production.');
  }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'us-central1');

export { app, auth, db, storage, functions };

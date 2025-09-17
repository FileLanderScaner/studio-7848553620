// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvWDCW_ZQ83qtZSg8Wqwks8tGRIePl818",
  authDomain: "studio-7848553620-773f9.firebaseapp.com",
  projectId: "studio-7848553620-773f9",
  storageBucket: "studio-7848553620-773f9.firebasestorage.app",
  messagingSenderId: "1048587881635",
  appId: "1:1048587881635:web:9bca258e10cef119d4c316"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check
if (typeof window !== 'undefined') {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (recaptchaKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    console.warn('Firebase App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. App Check is not enabled. This is expected for local development but required for production.');
  }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'us-central1');

export { app, auth, db, storage, functions };

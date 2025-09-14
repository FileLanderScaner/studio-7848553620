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
  apiKey: "AIzaSyDGgY2pdwspwOErx_rcaB-NB-uAGXwv_g8",
  authDomain: "motivateme-vwbmd.firebaseapp.com",
  projectId: "motivateme-vwbmd",
  storageBucket: "motivateme-vwbmd.firebasestorage.app",
  messagingSenderId: "31684947002",
  appId: "1:31684947002:web:631c7c2cd8761ef3791903",
  measurementId: "G-N0KWKFTXM6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check
if (typeof window !== 'undefined') {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (recaptchaSiteKey && recaptchaSiteKey !== 'REEMPLAZAR_CON_TU_CLAVE_DE_SITIO_RECAPTCHA') {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    console.warn('ADVERTENCIA: La variable de entorno NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está configurada. Firebase App Check no se ha inicializado. Esto es aceptable para desarrollo local, pero es requerido para producción.');
  }
}


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'us-central1');

export { app, auth, db, storage, functions };

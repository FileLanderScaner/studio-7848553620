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
  "apiKey": "AIzaSyCXNgOSpCgpu3sBb_BC_rkbxhXRUbAODkY",
  "authDomain": "studio-7848553620-773f9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1048587881635"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check
if (typeof window !== 'undefined') {
  // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
  // key is the counterpart to the secret key you set in the Firebase console.
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (recaptchaSiteKey) {
     // Set the debug token in development
    if (process.env.NODE_ENV === 'development') {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN;
    }
    
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

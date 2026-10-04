
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "skiildrill.firebaseapp.com",
  projectId: "skiildrill",
  storageBucket: "skiildrill.firebasestorage.app",
  messagingSenderId: "1066099655937",
  appId: "1:1066099655937:web:1f77033cee7f44d5c6c700"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider};
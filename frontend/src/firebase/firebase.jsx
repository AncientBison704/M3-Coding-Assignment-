import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB6VJlaeXCrom2hNenzn9iNETz8RhZnuow",
  authDomain: "m3-project-a730e.firebaseapp.com",
  projectId: "m3-project-a730e",
  storageBucket: "m3-project-a730e.firebasestorage.app",
  messagingSenderId: "815866536793",
  appId: "1:815866536793:web:206c1d2a5a22dd4e2de248",
  measurementId: "G-5F4JHR0DZJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth (app);
export const db = getFirestore(app)
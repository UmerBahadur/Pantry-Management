// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import the auth service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACXlxhy_9uzwBhY900PgPjxMJkCQC0SPA",
  authDomain: "pantry-management-ae096.firebaseapp.com",
  projectId: "pantry-management-ae096",
  storageBucket: "pantry-management-ae096.appspot.com",
  messagingSenderId: "604872378133",
  appId: "1:604872378133:web:5a680dc2355ee6994acb1c",
  measurementId: "G-84Q94SH6KT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { firestore, auth }; // Export auth along with firestore

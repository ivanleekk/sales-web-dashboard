// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB_ve8-_hJql2MtQHf1Y437zgpUICqeMk",
  authDomain: "sales-web-dashboard.firebaseapp.com",
  projectId: "sales-web-dashboard",
  storageBucket: "sales-web-dashboard.firebasestorage.app",
  messagingSenderId: "619643044297",
  appId: "1:619643044297:web:836ff474be98aba9552818",
  measurementId: "G-MSJW5HNXLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const firebaseEmulator = () => {
  return connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
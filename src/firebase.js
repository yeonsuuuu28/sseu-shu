import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClxvoU-kVUsJcP7FkyH4_vH6i49LsZTn0",
  authDomain: "sseu-shu-db.firebaseapp.com",
  databaseURL: "https://sseu-shu-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sseu-shu-db",
  storageBucket: "sseu-shu-db.appspot.com",
  messagingSenderId: "136462868577",
  appId: "1:136462868577:web:fbb2771bea626fa1480a20",
  measurementId: "G-JVJH23FNY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);

export default firebase;
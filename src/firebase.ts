import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtOC1qqIO855_fD9i0T5NHmqffPpB9aOY",
  authDomain: "shopping-list-d2da9.firebaseapp.com",
  projectId: "shopping-list-d2da9",
  storageBucket: "shopping-list-d2da9.appspot.com",
  messagingSenderId: "678789740780",
  appId: "1:678789740780:web:af0ac60b8f4dff59e90dc9",
};

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

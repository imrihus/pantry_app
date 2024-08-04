// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from  "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyBnj4eyikd2L5nnzhMMlztEFgOx6Qh4GZY",
 authDomain: "pantry-app-601a9.firebaseapp.com",
 projectId: "pantry-app-601a9",
 storageBucket: "pantry-app-601a9.appspot.com",
 messagingSenderId: "706351132496",
 appId: "1:706351132496:web:2dba71f07ad581d6d3c655",
 measurementId: "G-5SJN2F50H6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


export {firestore}


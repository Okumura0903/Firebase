// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore ,doc,getDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIhlMY-Vkb5XnB0LUgz0l8buVjbyYnq5k",
  authDomain: "myfirebasefirstproject-f0205.firebaseapp.com",
  projectId: "myfirebasefirstproject-f0205",
  storageBucket: "myfirebasefirstproject-f0205.appspot.com",
  messagingSenderId: "399830019130",
  appId: "1:399830019130:web:fe2e09616a651124b11903"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef=doc(db,"countries","8f1iaq2fIXE4mfkIuN3M");

const docSnap = await getDoc(docRef);

console.log(docSnap.data())

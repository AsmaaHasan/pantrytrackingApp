// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import 'firebase/auth'; // For Authentication
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1eSZhspTpRTUNPqfuUDCAbcWH5mGIUis",
  authDomain: "inventory-management-app-cae3d.firebaseapp.com",
  projectId: "inventory-management-app-cae3d",
  storageBucket: "inventory-management-app-cae3d.appspot.com",
  messagingSenderId: "944844007305",
  appId: "1:944844007305:web:55de2d50eb0212b2e1a358",
  measurementId: "G-N3TXDN9ES9"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const firestore = getFirestore(app);
//export { firestore };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export firestore and auth for use in other parts of your app
export { firestore, auth };
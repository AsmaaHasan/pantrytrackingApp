// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { firestore, storage };

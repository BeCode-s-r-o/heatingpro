// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCDOO0LluYZ9OFI-QXIEwyXJLqPx2qSmvc',
  authDomain: 'heating-pro.firebaseapp.com',
  projectId: 'heating-pro',
  storageBucket: 'heating-pro.appspot.com',
  messagingSenderId: '37677470162',
  appId: '1:37677470162:web:197a3a82961d2c910ab80b',
  measurementId: 'G-JGMVJCT86K',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const analytics = getAnalytics(app);
export const auth = getAuth();
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);

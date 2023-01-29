import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCDOO0LluYZ9OFI-QXIEwyXJLqPx2qSmvc',
  authDomain: 'heating-pro.firebaseapp.com',
  projectId: 'heating-pro',
  storageBucket: 'heating-pro.appspot.com',
  messagingSenderId: '37677470162',
  appId: '1:37677470162:web:197a3a82961d2c910ab80b',
  measurementId: 'G-JGMVJCT86K',
};

const app = initializeApp(firebaseConfig);
export const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);

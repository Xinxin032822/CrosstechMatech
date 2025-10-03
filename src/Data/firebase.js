import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBuCMNxNKZosxsYMCQSHzxno0FwpabiTCk",
  authDomain: "crosstechmatech-20288.firebaseapp.com",
  projectId: "crosstechmatech-20288",
  storageBucket: "crosstechmatech-20288.firebasestorage.app",
  messagingSenderId: "785525729273",
  appId: "1:785525729273:web:1f2eeea3b437fa81f6bf28",
  measurementId: "G-BG0PYQ759L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

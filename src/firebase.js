
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDrgbJ42SxdwyHQZUJB6lZdmWfrzY-7-0A",
    authDomain: "lms-timetracker.firebaseapp.com",
    projectId: "lms-timetracker",
    storageBucket: "lms-timetracker.appspot.com",
    messagingSenderId: "1093338848443",
    appId: "1:1093338848443:web:285868911c019769d29d9e"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const  storage =  getStorage(app);
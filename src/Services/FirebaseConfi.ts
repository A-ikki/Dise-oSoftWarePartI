// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import App from '../App';

const firebaseConfig = {
    apiKey: "AIzaSyAg5vA0pc2uuI-4eI3WYmLCDI8OS-WgwcI",
    authDomain: "disenosoftwarei.firebaseapp.com",
    projectId: "disenosoftwarei",
    storageBucket: "disenosoftwarei.appspot.com",
    messagingSenderId: "338767211777",
    appId: "1:338767211777:web:791be3bf4b085a25c97f00",
    measurementId: "G-VYD9DM5RRB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app, auth}
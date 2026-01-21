// Import the functions you need from the SDKs you need4
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence} from "@firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAgkckdgTNSRXMmxkfGZR-e3Y9LLUfBeoQ",
    authDomain: "cinebook-database.firebaseapp.com",
    databaseURL: "https://cinebook-database-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cinebook-database",
    storageBucket: "cinebook-database.firebasestorage.app",
    messagingSenderId: "139065609400",
    appId: "1:139065609400:web:b68221fd6c506d64a0f84d",
    measurementId: "G-3L0TQBKCTW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const db = getFirestore(app);
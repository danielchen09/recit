import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAXFzwEZwoeR1iBozdpqZHQ093VnXDymeA',
  authDomain: 'recit-1742e.firebaseapp.com',
  databaseURL: 'https://recit-1742e-default-rtdb.firebaseio.com/',
  projectId: 'recit-1742e',
  storageBucket: 'recit-1742e.appspot.com/',
};

initializeApp(firebaseConfig);
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-PKn49UIFgqgwzPvvMuIIG58QB0E_MdY",
  authDomain: "upgraded-engine.firebaseapp.com",
  projectId: "upgraded-engine",
  storageBucket: "upgraded-engine.firebasestorage.app",
  messagingSenderId: "2995979729",
  appId: "1:2995979729:web:3cc878af31b2efd38c4cf0",
  measurementId: "G-P8QMTGBLTG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

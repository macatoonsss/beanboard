// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9iSZX_Lbn_QkJm0oVFN2-oT3T5qEwSH0",
  authDomain: "beanboard-50f1b.firebaseapp.com",
  projectId: "beanboard-50f1b",
  storageBucket: "beanboard-50f1b.appspot.com",
  messagingSenderId: "371025977912",
  appId: "1:371025977912:web:e824b62082796e981e7ccd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

window.firebaseAuth = auth;
window.firebaseFirestore = db;

console.log("Firebase initialized successfully");
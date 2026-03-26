// firebase-config.js
// Import functions from the Firebase SDK (modular)
const { initializeApp } = window.firebaseApp;
const { getAuth } = window.firebaseAuth;
const { getFirestore } = window.firebaseFirestore;

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9iSZX_Lbn_QkJm0oVFN2-oT3T5qEwSH0",
  authDomain: "beanboard-50f1b.firebaseapp.com",
  projectId: "beanboard-50f1b",
  storageBucket: "beanboard-50f1b.appspot.com",
  messagingSenderId: "371025977912",
  appId: "1:371025977912:web:e824b62082796e981e7ccd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Make them globally accessible if needed
window.firebaseAuth = auth;
window.firebaseFirestore = db;

console.log("Firebase initialized successfully");
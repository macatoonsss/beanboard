// firebase-config.js
// Modular imports from global window object in v10
const { initializeApp } = window.firebase;
const { getAuth } = window.firebase;
const { getFirestore } = window.firebase;

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

// Expose globally if needed
window.auth = auth;
window.db = db;

console.log("Firebase initialized successfully");
// firebase-config.js

// Use global namespace imports (matches the CDN scripts)
const firebaseConfig = {
  apiKey: "AIzaSyBlcoakJgOnf2woKS-VRORCy33odPEY0s4",
  authDomain: "beanboard-50f1b.firebaseapp.com",
  projectId: "beanboard-50f1b",
  storageBucket: "beanboard-50f1b.appspot.com",
  messagingSenderId: "371025977912",
  appId: "1:371025977912:web:e824b62082796e981e7ccd",
  measurementId: "G-68LKL1YK7S"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Expose globally
window.auth = auth;
window.db = db;

console.log("Firebase initialized successfully");
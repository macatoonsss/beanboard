// auth.js (Firebase v10 modular syntax)

// Import modular functions from the window object
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } = firebase;
const { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } = firebase;

// Use global auth and db instances from firebase-config.js
const auth = window.auth;
const db = window.db;

// Sign Up Function
async function signUp(firstName, lastName, username, password) {
    try {
        // Generate a unique email for Firebase authentication
        const uniqueEmail = `${username}_${Date.now()}@kimiapp.local`;

        const userCredential = await createUserWithEmailAndPassword(auth, uniqueEmail, password);
        const user = userCredential.user;

        // Store user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: uniqueEmail, // Store the generated email
            createdAt: new Date(),
            bio: '',
            profileImage: 'Images/PROFILE.png'
        });

        console.log("User signed up successfully:", username);
        return user;
    } catch (error) {
        console.error("Sign up error:", error.message);
        alert("Sign up failed: " + error.message);
        throw error;
    }
}

// Login Function
async function logIn(username, password) {
    try {
        // Find user by username in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('User not found');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const email = userData.email;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User logged in successfully:", username);

        // Store session info
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userEmail', email);

        return user;
    } catch (error) {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
        throw error;
    }
}

// Logout Function
async function logOut() {
    try {
        await signOut(auth);

        // Clear session
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');

        console.log("User logged out successfully");
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout error:", error.message);
        alert("Logout failed: " + error.message);
    }
}

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user.email);

        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            if (docSnap.exists()) {
                const userData = docSnap.data();

                window.currentUser = user;
                window.currentUserData = userData;

                // Update UI with user info
                updateUserUI(userData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        console.log("No user is logged in");
        window.currentUser = null;
        window.currentUserData = null;
    }
});

// Update UI with user information
function updateUserUI(userData) {
    const profName = document.querySelector('.profname');
    if (profName) {
        profName.textContent = userData.firstName + ' ' + userData.lastName;
    }

    const profUsername = document.querySelector('.profusername');
    if (profUsername) {
        profUsername.textContent = '@' + userData.username;
    }

    const avatars = document.querySelectorAll('.avatar');
    if (avatars.length > 0 && userData.profileImage) {
        avatars.forEach(avatar => {
            avatar.src = userData.profileImage;
        });
    }
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Get current user data
async function getCurrentUserData() {
    const user = getCurrentUser();
    if (user) {
        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            if (docSnap.exists()) return docSnap.data();
        } catch (error) {
            console.error("Error getting user data:", error);
        }
    }
    return null;
}

console.log("Auth module loaded");
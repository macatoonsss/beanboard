// auth.js (Firebase compat style)

const auth = window.auth;
const db = window.db;

async function signUp(firstName, lastName, username, password) {
    try {
        const uniqueEmail = `${username}_${Date.now()}@kimiapp.local`;
        const userCredential = await auth.createUserWithEmailAndPassword(uniqueEmail, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            firstName,
            lastName,
            username,
            email: uniqueEmail,
            createdAt: new Date(),
            bio: '',
            profileImage: 'Images/PROFILE.png'
        });

        console.log('User signed up successfully:', username);
        return user;
    } catch (error) {
        console.error('Sign up error:', error.message);
        alert('Sign up failed: ' + error.message);
        throw error;
    }
}

async function logIn(username, password) {
    try {
        const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty) throw new Error('User not found');

        const userData = snapshot.docs[0].data();
        const email = userData.email;

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userEmail', email);

        console.log('User logged in successfully:', username);
        return user;
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
        throw error;
    }
}

async function logOut() {
    try {
        await auth.signOut();
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
    }
}

auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log('User is logged in:', user.email);
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            window.currentUser = user;
            window.currentUserData = userData;
            updateUserUI(userData);
        }
    } else {
        console.log('No user is logged in');
        window.currentUser = null;
        window.currentUserData = null;
    }
});

function updateUserUI(userData) {
    const profName = document.querySelector('.profname');
    if (profName) profName.textContent = `${userData.firstName} ${userData.lastName}`;

    const profUsername = document.querySelector('.profusername');
    if (profUsername) profUsername.textContent = '@' + userData.username;

    document.querySelectorAll('.avatar').forEach((avatar) => {
        if (userData.profileImage) avatar.src = userData.profileImage;
    });
}

function getCurrentUser() {
    return auth.currentUser;
}

async function getCurrentUserData() {
    const user = getCurrentUser();
    if (!user) return null;

    const docSnap = await db.collection('users').doc(user.uid).get();
    return docSnap.exists ? docSnap.data() : null;
}

console.log('Auth module loaded');
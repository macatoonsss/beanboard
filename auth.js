// Fixed auth.js

async function signUp(firstName, lastName, username, password) {
    try {
        const uniqueEmail = `${username}@kimiapp.local`; // fixed email per username
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
        const email = `${username}@kimiapp.local`; // same as signup
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
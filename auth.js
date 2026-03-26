// Fixed auth.js

async function signUp(firstName, lastName, username, password, profileImage = 'Images/PROFILE.png') {
    try {
        const normalizedUsername = username.trim().toLowerCase();
        const uniqueEmail = `${normalizedUsername}@beanboard.com`; // changed here

        const userCredential = await auth.createUserWithEmailAndPassword(uniqueEmail, password);
        const user = userCredential.user;

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        await user.updateProfile({
            displayName: fullName,
            photoURL: profileImage
        });

        console.log('User signed up successfully:', username);
        return user;
    } catch (error) {
        console.error('Sign up error:', error.message);
        M.toast({html: 'Sign up failed: ' + error.message});
        throw error;
    }
}

async function logIn(username, password) {
    try {
        const normalizedUsername = username.trim().toLowerCase();
        const email = `${normalizedUsername}@beanboard.com`; // changed here

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userEmail', email);

        console.log('User logged in successfully:', normalizedUsername);
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
        console.error('Logout error:', error);
    }
}
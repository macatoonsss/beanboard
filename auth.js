// Firebase Authentication Module

// Sign Up Function
async function signUp(email, password, username) {
  try {
    // Create user account
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Store user profile in Firestore
    await firebase.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      username: username,
      email: email,
      createdAt: new Date(),
      bio: '',
      profileImage: 'Images/PROFILE.png'
    });

    console.log("User signed up successfully:", user.email);
    return user;
  } catch (error) {
    console.error("Sign up error:", error.message);
    alert("Sign up failed: " + error.message);
    throw error;
  }
}

// Login Function
async function logIn(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("User logged in successfully:", user.email);
    
    // Store session info
    localStorage.setItem('userId', user.uid);
    localStorage.setItem('userEmail', user.email);
    
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
    await firebase.auth().signOut();
    
    // Clear session
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    console.log("User logged out successfully");
    window.location.href = 'index.html'; // Redirect to login page
  } catch (error) {
    console.error("Logout error:", error.message);
    alert("Logout failed: " + error.message);
  }
}

// Check if user is logged in
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    
    // Get user profile from Firestore
    try {
      const docSnap = await firebase.firestore().collection('users').doc(user.uid).get();
      if (docSnap.exists) {
        const userData = docSnap.data();
        console.log("User data:", userData);
        
        // Store user data in window for global access
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
  // Update profile name if element exists
  const profName = document.querySelector('.profname');
  if (profName) {
    profName.textContent = userData.username || userData.email;
  }

  // Update profile username if element exists
  const profUsername = document.querySelector('.profusername');
  if (profUsername) {
    profUsername.textContent = '@' + (userData.username || userData.email.split('@')[0]);
  }

  // Update profile image if element exists
  const avatars = document.querySelectorAll('.avatar');
  if (avatars.length > 0 && userData.profileImage) {
    avatars.forEach(avatar => {
      avatar.src = userData.profileImage;
    });
  }
}

// Get current user
function getCurrentUser() {
  return firebase.auth().currentUser;
}

// Get current user data
async function getCurrentUserData() {
  const user = getCurrentUser();
  if (user) {
    try {
      const docSnap = await firebase.firestore().collection('users').doc(user.uid).get();
      if (docSnap.exists) {
        return docSnap.data();
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }
  return null;
}

// Update user profile
async function updateUserProfile(userId, updates) {
  try {
    await firebase.firestore().collection('users').doc(userId).update(updates);
    console.log("User profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile: " + error.message);
    throw error;
  }
}

// Password Reset Function
async function resetPassword(email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    console.log("Password reset email sent to:", email);
    alert("Password reset email sent to " + email);
  } catch (error) {
    console.error("Password reset error:", error.message);
    alert("Password reset failed: " + error.message);
    throw error;
  }
}

console.log("Auth module loaded");

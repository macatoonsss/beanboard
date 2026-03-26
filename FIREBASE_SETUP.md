# Firebase Setup Guide for KIMI

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "KIMI")
4. Follow the wizard steps and create the project
5. Wait for the project to be initialized

## Step 2: Create a Web App

1. In your Firebase project, click on the **Web** icon (looks like `</>`)
2. Register your app with a nickname (e.g., "KIMI Web")
3. Copy your Firebase config - it will look like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 3: Update Firebase Configuration

1. Open the file: `firebase-config.js`
2. Replace the placeholder values with your actual Firebase config from Step 2
3. Save the file

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click on the **Sign-in method** tab
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle it **ON**
   - Save

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Start in production mode**
4. Choose your database location (closest to your users)
5. Click **Create**

### Set Up Firestore Rules

1. Go to the **Rules** tab in Firestore Database
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow reading all posts
    match /posts/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // Match collections within posts
    match /posts/{postId}/{document=**} {
      allow read: if request.auth != null;
      allow create, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 6: Test Your Setup

1. Open your project in a web browser at: `http://localhost/Beanboard/index.html` (if using XAMPP)
2. Or simply open `index.html` in your browser
3. Try creating a new account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123` (at least 6 characters)
4. Sign up should work and redirect you to the main page
5. You should see your profile username displayed

## Features Available

### Authentication
- ✅ Sign Up with email and password
- ✅ Log In
- ✅ Log Out
- ✅ Password visibility toggle
- ✅ Auto-redirect if already logged in

### Posts
- ✅ Create new posts
- ✅ View all posts in feed
- ✅ See post author information
- ✅ Display post timestamps (e.g., "2h ago")

### Community Features
- ✅ Like/Unlike posts
- ✅ Add comments to posts
- ✅ View comments with timestamps
- ✅ User profiles with username and bio

## Troubleshooting

### "Firebase is not defined"
- Make sure Firebase SDK scripts are loaded before your config script
- Check that all script tags are in the correct order

### Posts not showing
- Check that Firestore Database is enabled
- Verify your Firestore rules are correctly set
- Check browser Console (F12) for error messages

### Can't sign up
- Make sure Email/Password authentication is enabled in Firebase
- Check the password is at least 6 characters
- Check the email format is valid

### Can't log in
- Make sure you're using the same email you signed up with
- Check that the password is correct
- Clear browser cookies and try again

## File Structure

```
Beanboard/
├── index.html           (Login/Signup page)
├── main.html            (Main feed page)
├── firebase-config.js   (Firebase configuration - UPDATE THIS!)
├── auth.js              (Authentication functions)
├── database.js          (Database operations)
├── main_style.css       (Styles)
├── manifest.json        (PWA manifest)
├── sw.js                (Service Worker)
└── Images/              (Image assets)
```

## Next Steps

1. Customize user profiles
2. Add profile picture uploads to Firebase Storage
3. Implement follow/unfollow functionality
4. Add real-time notifications
5. Deploy to a web server

## Support

For Firebase documentation:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

Good luck with your KIMI app! 🎉

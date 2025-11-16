# Complete Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "safe-report")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ > Project settings
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the `firebaseConfig` object
6. Replace the config in BOTH `app.js` AND `admin.js`

```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## Step 3: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, go to "Rules" tab
2. Replace the rules with the content from `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

3. Click "Publish"

## Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

## Step 6: Create Admin User

1. Go to "Authentication" > "Users" tab
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"
5. **IMPORTANT:** Copy the User UID

## Step 7: Set Admin Custom Claim

You need to set a custom claim to mark this user as admin. You have two options:

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
Select: Firestore, Hosting

4. Create a file `set-admin.js`:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'PASTE_USER_UID_HERE';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set successfully');
    process.exit();
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
```

5. Download service account key:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json`

6. Run the script:
```bash
node set-admin.js
```

### Option B: Using Cloud Functions

1. Create `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { message: 'Admin claim set' };
});
```

2. Deploy and call the function

## Step 8: Test Locally

1. Open `index.html` in your browser
2. Test the reporting flow
3. Open `admin.html` in your browser
4. Login with your admin credentials
5. View the submitted reports

## Step 9: Deploy to Firebase Hosting (Optional)

1. Run:
```bash
firebase deploy
```

2. Your site will be live at: `https://your-project-id.firebaseapp.com`

## Security Notes

- Each report gets a unique Firestore document ID (auto-generated)
- Each report also has a user-friendly Report ID (e.g., #H20251116-1234)
- Anonymous users can only CREATE reports
- Only authenticated admins can READ reports
- Admin access requires custom claim `admin: true`
- Never share your Firebase config's API key publicly (it's safe in frontend code)

## Troubleshooting

**Can't see reports in admin panel?**
- Make sure you set the admin custom claim
- Check browser console for errors
- Verify Firestore rules are published

**Reports not saving?**
- Check Firebase config is correct in both files
- Verify Firestore is enabled
- Check browser console for errors

**Can't login to admin panel?**
- Verify Email/Password authentication is enabled
- Check credentials are correct
- Make sure user exists in Authentication > Users

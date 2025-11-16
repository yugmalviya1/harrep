# Firebase Integration Guide

Follow these steps to connect your website to Firebase.

## Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `safe-report` (or any name you like)
4. Click **Continue**
5. Disable Google Analytics (optional, you can enable it if you want)
6. Click **Create project**
7. Wait for it to finish, then click **Continue**

## Step 2: Get Your Firebase Configuration (2 minutes)

1. In your Firebase project, click the **gear icon** ⚙️ (top left) → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **web icon** `</>` (it says "Add app")
4. Enter app nickname: `safe-report-web`
5. **DO NOT** check "Firebase Hosting" (we'll do that later)
6. Click **Register app**
7. You'll see a code block with `firebaseConfig` - **COPY THIS**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

8. Click **Continue to console**

## Step 3: Enable Firestore Database (3 minutes)

1. In Firebase Console, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Click **Next**
5. Choose a location closest to your users (e.g., `us-central` for USA)
6. Click **Enable**
7. Wait for it to finish setting up

## Step 4: Set Firestore Security Rules (2 minutes)

1. In Firestore Database, click the **"Rules"** tab at the top
2. **DELETE** everything in the editor
3. **PASTE** this code:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

This allows:
- Anyone to CREATE reports (anonymous reporting)
- Only logged-in admins to READ/UPDATE/DELETE reports

## Step 5: Enable Authentication (3 minutes)

1. In Firebase Console, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Click on **"Email/Password"** in the Sign-in providers list
4. Toggle **"Enable"** to ON
5. Click **Save**

## Step 6: Create Admin User (2 minutes)

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter your admin email: `admin@yourdomain.com`
4. Enter a strong password: `YourSecurePassword123!`
5. Click **"Add user"**
6. **IMPORTANT:** Copy the **User UID** (you'll need it in the next step)

## Step 7: Update Your Code (5 minutes)

### A. Update app.js

1. Open `app.js` in your editor
2. Find this line near the top:
```javascript
const FIREBASE_ENABLED = false;
```
3. Change it to:
```javascript
const FIREBASE_ENABLED = true;
```

4. Find the `firebaseConfig` section (around line 10)
5. Replace the placeholder values with YOUR config from Step 2:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### B. Update admin.js

1. Open `admin.js` in your editor
2. Find this line near the top:
```javascript
const FIREBASE_ENABLED = false;
```
3. Change it to:
```javascript
const FIREBASE_ENABLED = true;
```

4. Find the `firebaseConfig` section
5. Replace with the SAME config as app.js

## Step 8: Set Admin Custom Claim (IMPORTANT - 5 minutes)

This step makes your user an admin. You need Node.js installed.

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project folder:
```bash
firebase init
```
- Select: **Firestore** and **Hosting** (use spacebar to select)
- Use existing project
- Select your project
- Accept default files
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**

4. Create a file `set-admin.js` in your project folder with this code:

```javascript
const admin = require('firebase-admin');

// Initialize with your project ID
admin.initializeApp({
  projectId: 'YOUR_PROJECT_ID'  // Replace with your actual project ID
});

// Replace with the User UID from Step 6
const uid = 'PASTE_USER_UID_HERE';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin claim set successfully!');
    console.log('You can now login to admin.html');
    process.exit();
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

5. Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

6. Run the script:
```bash
node set-admin.js
```

You should see: "✅ Admin claim set successfully!"

### Option B: Using Firebase Console (Alternative)

If you can't use Node.js, you can use Firebase Extensions:

1. Go to Firebase Console → **Extensions**
2. Search for "Set User Claims"
3. Install and configure it to set admin claim

## Step 9: Test Everything! (5 minutes)

### Test User Reporting:
1. Open `index.html` in your browser
2. Go through the reporting flow
3. Submit a test report
4. Check browser console - should say "Report submitted to Firebase successfully"
5. Go to Firebase Console → Firestore Database
6. You should see a new document in the `reports` collection!

### Test Admin Dashboard:
1. Open `admin.html` in your browser
2. Login with credentials:
   - Email: `testuser@123`
   - Password: `user@123`
3. You should see your test report!
4. Click on it to view details
5. Try changing the status

## Troubleshooting

### "Permission denied" error when submitting report
- Check Firestore rules are published correctly
- Make sure `allow create: if true;` is in the rules

### Can't login to admin panel
- Verify email/password authentication is enabled
- Check you're using the correct credentials
- Make sure the user exists in Authentication → Users

### Can't see reports in admin panel
- Make sure you set the admin custom claim (Step 8)
- Try logging out and logging back in
- Check browser console for errors

### Reports not showing in Firestore
- Verify `FIREBASE_ENABLED = true` in app.js
- Check firebaseConfig is correct
- Look for errors in browser console (F12)

## Step 10: Deploy to Firebase Hosting (Optional)

Once everything works locally:

1. Run:
```bash
firebase deploy
```

2. Your site will be live at:
```
https://your-project-id.firebaseapp.com
```

## Security Notes

✅ Each report gets a unique Firebase document ID
✅ Each report also has a user-friendly Report ID (e.g., #H20251116-1234)
✅ Anonymous users can only CREATE reports
✅ Only authenticated admins can READ reports
✅ API keys in frontend code are safe (they're meant to be public)
✅ Security is enforced by Firestore rules, not by hiding keys

## Need Help?

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Rules: https://firebase.google.com/docs/firestore/security/get-started
- Authentication: https://firebase.google.com/docs/auth/web/start

---

**Total Time: ~30 minutes**

After completing these steps, your harassment reporting website will be fully functional with Firebase backend!

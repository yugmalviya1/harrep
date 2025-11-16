# Quick Start - Firebase Integration

## 🚀 Fast Track (30 minutes)

### 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Click "Add project"
- Name it and create

### 2. Get Config
- Click ⚙️ → Project settings
- Scroll down → Click `</>` web icon
- Copy the `firebaseConfig` object

### 3. Enable Services
- **Firestore Database**: Click "Create database" → Production mode
- **Authentication**: Enable Email/Password sign-in
- **Create Admin User**: Authentication → Users → Add user

### 4. Update Code

**In both `app.js` and `admin.js`:**

Change:
```javascript
const FIREBASE_ENABLED = false;
```
To:
```javascript
const FIREBASE_ENABLED = true;
```

Paste your config:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 5. Set Firestore Rules

In Firebase Console → Firestore → Rules tab:

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

### 6. Make User Admin

```bash
npm install firebase-admin
```

Edit `set-admin.js`:
- Replace `YOUR_PROJECT_ID` with your project ID
- Replace `PASTE_USER_UID_HERE` with user UID from Firebase Console

Run:
```bash
node set-admin.js
```

### 7. Test!
- Open `index.html` → Submit a report
- Open `admin.html` → Login with:
  - Email: `testuser@123`
  - Password: `user@123`

## 📝 Files to Edit

1. **app.js** (line 2): Change `FIREBASE_ENABLED` to `true`
2. **app.js** (line 10-17): Paste your Firebase config
3. **admin.js** (line 2): Change `FIREBASE_ENABLED` to `true`
4. **admin.js** (line 10-17): Paste your Firebase config
5. **set-admin.js** (line 11): Add your project ID
6. **set-admin.js** (line 15): Add your user UID

## ✅ Checklist

- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user created
- [ ] Firebase config copied
- [ ] `FIREBASE_ENABLED = true` in app.js
- [ ] `FIREBASE_ENABLED = true` in admin.js
- [ ] Firebase config pasted in both files
- [ ] Firestore rules published
- [ ] Admin claim set (ran set-admin.js)
- [ ] Tested report submission
- [ ] Tested admin login

## 🆘 Quick Troubleshooting

**Can't submit reports?**
→ Check Firestore rules are published

**Can't login to admin?**
→ Check Authentication is enabled and user exists

**Can't see reports in admin?**
→ Run `set-admin.js` to set admin claim

**Still not working?**
→ Open browser console (F12) and check for errors

---

For detailed instructions, see `FIREBASE_SETUP.md`

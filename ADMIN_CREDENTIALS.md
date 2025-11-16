# Admin Login Credentials

## Firebase Authentication Setup

To access the admin dashboard, you need to create a user in Firebase Authentication with these credentials:

### Admin Credentials
- **Email**: `testuser@123`
- **Password**: `user@123`

## How to Set Up

### Step 1: Create User in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/harrep/authentication)
2. Click on **Authentication** in the left menu
3. Click **"Get started"** (if first time)
4. Go to **"Users"** tab
5. Click **"Add user"**
6. Enter:
   - Email: `testuser@123`
   - Password: `user@123`
7. Click **"Add user"**
8. **Copy the User UID** (you'll need it for the next step)

### Step 2: Set Admin Custom Claim

The user needs admin privileges to view reports. 

1. Edit `set-admin.js` file:
   - Line 11: Make sure it says `projectId: 'harrep'` ✅ (already set)
   - Line 15: Replace `PASTE_USER_UID_HERE` with the UID you copied

2. Install dependencies:
```bash
npm install firebase-admin
```

3. Run the script:
```bash
node set-admin.js
```

You should see: "✅ SUCCESS! Admin claim set successfully!"

### Step 3: Login to Admin Dashboard

1. Open `admin.html` in your browser
2. Enter credentials:
   - Email: `testuser@123`
   - Password: `user@123`
3. Click **Login**

You should now see the admin dashboard with all submitted reports!

## Security Notes

⚠️ **Important**: These credentials are for demonstration purposes. In production:

1. **Use a strong password** (at least 12 characters with mixed case, numbers, symbols)
2. **Use a real email address** for password recovery
3. **Enable 2FA** (Two-Factor Authentication) in Firebase Console
4. **Limit admin access** to only trusted personnel
5. **Regularly audit** admin access logs

## Troubleshooting

**Can't login?**
- Verify the user exists in Firebase Console → Authentication → Users
- Check that Email/Password authentication is enabled
- Make sure you're using the exact credentials: `testuser@123` / `user@123`

**Can see login page but can't see reports?**
- You need to set the admin custom claim (Step 2 above)
- Run `node set-admin.js` with the correct User UID
- Logout and login again after setting the claim

**"Permission denied" error?**
- Check Firestore rules are published correctly
- Verify the admin custom claim is set
- Check browser console for detailed error messages

## Changing Credentials

If you want to use different credentials:

1. Create a new user in Firebase Authentication with your desired email/password
2. Copy the new User UID
3. Run `set-admin.js` with the new UID
4. Update this documentation file

---

**Current Admin User:**
- Email: `testuser@123`
- Password: `user@123`
- Project: harrep
- Status: Active

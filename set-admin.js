const admin = require('firebase-admin');

// INSTRUCTIONS:
// 1. Replace YOUR_PROJECT_ID with your actual Firebase project ID
// 2. Replace PASTE_USER_UID_HERE with the UID from Firebase Console → Authentication → Users
// 3. Run: npm install firebase-admin
// 4. Run: node set-admin.js

// Initialize with your project ID
admin.initializeApp({
  projectId: 'harrep'
});

// Replace with the User UID from Firebase Console
const uid = 'PASTE_USER_UID_HERE';  // ← Replace this with the UID from Firebase Console → Authentication → Users

console.log('Setting admin claim for user:', uid);

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ SUCCESS! Admin claim set successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. The user needs to logout and login again');
    console.log('2. Open admin.html and login with your admin credentials');
    console.log('3. You should now be able to see all reports!');
    console.log('');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ ERROR setting admin claim:', error.message);
    console.log('');
    console.log('Common issues:');
    console.log('- Make sure you replaced YOUR_PROJECT_ID with your actual project ID');
    console.log('- Make sure you replaced PASTE_USER_UID_HERE with the actual user UID');
    console.log('- Make sure you ran: npm install firebase-admin');
    console.log('');
    process.exit(1);
  });

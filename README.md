# Safe Report - Anonymous Harassment Reporting Website

A compassionate, anonymous harassment reporting platform with Firebase backend. Users can safely report incidents of harassment while maintaining their anonymity, and administrators can manage reports through a secure dashboard.

![Safe Report](https://img.shields.io/badge/status-active-success.svg)
![Firebase](https://img.shields.io/badge/firebase-enabled-orange.svg)

## 🌟 Features

- **Anonymous Reporting**: Users can submit reports without creating an account
- **Multi-step Guided Flow**: Compassionate, step-by-step reporting process
- **Multiple Harassment Types**: Verbal, Physical, Online, Workplace, and Other
- **Unique Report IDs**: Each report gets a unique identifier for tracking
- **Admin Dashboard**: Secure portal for viewing and managing reports
- **Status Management**: Track reports as New, In Progress, or Resolved
- **Emergency Resources**: Display of helpline numbers and crisis resources
- **Real-time Updates**: Firebase integration for instant data sync
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- A modern web browser
- [Node.js](https://nodejs.org/) (for admin setup)
- [Firebase account](https://firebase.google.com/) (free tier works)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/safe-report.git
cd safe-report
```

### 2. Set Up Firebase

Follow the detailed instructions in `FIREBASE_SETUP.md` or use the quick checklist in `QUICK_START.md`.

**Quick summary:**
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Email/Password Authentication
4. Update Firebase config in `app.js` and `admin.js`
5. Set Firestore security rules
6. Create an admin user
7. Run the admin setup script

### 3. Configure Your Firebase

Replace the Firebase configuration in both `app.js` and `admin.js` with your own:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 4. Set Up Admin Access

```bash
npm install firebase-admin
node set-admin.js
```

### 5. Run Locally

Simply open `index.html` in your browser, or use a local server:

```bash
npx serve .
```

## 📁 Project Structure

```
safe-report/
├── index.html              # Main reporting page
├── admin.html              # Admin dashboard
├── app.js                  # Main application logic
├── admin.js                # Admin dashboard logic
├── styles.css              # Main page styles
├── admin-styles.css        # Admin dashboard styles
├── set-admin.js            # Script to set admin claims
├── package.json            # Node.js dependencies
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── FIREBASE_SETUP.md       # Detailed Firebase setup guide
├── QUICK_START.md          # Quick reference guide
└── README.md               # This file
```

## 🔒 Security

- **Anonymous Reporting**: No authentication required to submit reports
- **Admin-Only Access**: Only authenticated admins can view reports
- **Firestore Rules**: Database-level security prevents unauthorized access
- **Custom Claims**: Admin access controlled via Firebase custom claims
- **No PII Required**: Users can choose to remain completely anonymous

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow create: if true;  // Anyone can create reports
      allow read, update, delete: if request.auth != null;  // Only authenticated users
    }
  }
}
```

## 🎨 User Flow

### For Users (Reporting)

1. **Welcome Screen**: Compassionate greeting
2. **Choose Action**: File a report or just talk
3. **Select Type**: Choose harassment type(s)
4. **Describe Incident**: Optional detailed description
5. **Date Selection**: When the incident occurred
6. **Contact Info**: Optional email/phone for follow-up
7. **Confirmation**: Receive unique report ID
8. **Resources**: Emergency helpline numbers displayed

### For Admins (Dashboard)

1. **Login**: Secure authentication
2. **Dashboard**: View statistics and all reports
3. **Filter**: By status or harassment type
4. **View Details**: Click any report for full information
5. **Update Status**: Mark as New, In Progress, or Resolved
6. **Logout**: Secure session management

## 🛠️ Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Firestore, Authentication)
- **Hosting**: Firebase Hosting (optional)
- **Icons**: Unicode emoji for accessibility

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
firebase login
firebase init hosting
firebase deploy
```

Your site will be live at: `https://your-project-id.firebaseapp.com`

### Deploy to Other Platforms

This is a static website and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support Resources

The application displays these emergency resources:

- **National Domestic Violence Hotline**: 1-800-799-7233
- **Crisis Text Line**: Text HOME to 741741
- **RAINN National Sexual Assault Hotline**: 1-800-656-HOPE (4673)
- **Emergency Services**: 911

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- All contributors and supporters
- Organizations fighting harassment and supporting survivors

---

**Note**: This is a tool to help report harassment. If you're in immediate danger, please call emergency services (911 in the US).

## 📊 Data Structure

Reports are stored in Firestore with the following structure:

```javascript
{
  reportId: "#H20251116-1234",
  reportType: "file" | "talk",
  harassmentType: ["verbal", "online"],
  description: "User's description",
  date: "2025-11-16",
  contact: {
    email: "optional@email.com",
    phone: "optional-phone"
  },
  timestamp: Firestore.Timestamp,
  status: "new" | "in-progress" | "resolved"
}
```

## 🔧 Troubleshooting

See `FIREBASE_SETUP.md` for detailed troubleshooting steps.

**Common Issues:**

- **Can't submit reports**: Check Firestore rules are published
- **Can't login to admin**: Verify Authentication is enabled
- **Can't see reports**: Run `set-admin.js` to set admin claim
- **Firebase errors**: Check browser console for detailed error messages

---

Made with ❤️ to support safer communities

# ⬡ VercelVirgo — MLM Coin Platform

> **Complete Setup Guide** | Firebase + GitHub Pages | HTML/CSS/JS

---

## 📋 Table of Contents

1. [Project Overview](#overview)
2. [Step 1 — Create Firebase Project](#step1)
3. [Step 2 — Enable Authentication](#step2)
4. [Step 3 — Create Firestore Database](#step3)
5. [Step 4 — Get Firebase Config](#step4)
6. [Step 5 — Paste Config Into Project](#step5)
7. [Step 6 — Set Up First Admin Account](#step6)
8. [Step 7 — Firestore Security Rules](#step7)
9. [Step 8 — Deploy to GitHub Pages](#step8)
10. [Admin Panel Guide](#admin-guide)
11. [First-Time Admin Checklist](#checklist)
12. [File Structure](#structure)

---

## <a name="overview"></a>🌐 Project Overview

**VercelVirgo** is a full-featured MLM coin earning platform:

- Users **register** and get a unique referral link
- Users **buy coins** via USDT TRC20 — admin approves
- Buying coins triggers **unlimited MLM commissions** to upline members
- Users can **sell coins** back or **withdraw** as USDT
- Full **admin panel** with approval workflows
- **Leaderboard** and **team tree** visualization

**Tech Stack:** Pure HTML + CSS + Vanilla JS | Firebase Auth + Firestore | GitHub Pages hosting

---

## <a name="step1"></a>🔥 Step 1 — Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Create a project"**
3. Name it `vercelvirgo` (or any name you like)
4. Disable Google Analytics (optional) → Click **Create project**
5. Wait for it to set up → Click **Continue**

---

## <a name="step2"></a>🔐 Step 2 — Enable Authentication

1. In Firebase console, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Under **Sign-in providers**, click **Email/Password**
4. Toggle **"Enable"** → Click **Save**

---

## <a name="step3"></a>🗄️ Step 3 — Create Firestore Database

1. In Firebase console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** → Click **Next**
4. Choose your server location (pick closest to your users) → Click **Enable**

---

## <a name="step4"></a>📋 Step 4 — Get Firebase Config

1. In Firebase console, click the **gear icon** (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** → Choose the **Web** icon `</>`
4. Register the app with nickname `vercelvirgo-web`
5. Copy the `firebaseConfig` object shown

It looks like this:
```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vercelvirgo.firebaseapp.com",
  projectId: "vercelvirgo",
  storageBucket: "vercelvirgo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefabcdef"
};
```

---

## <a name="step5"></a>✏️ Step 5 — Paste Config Into Project

1. Open the file **`js/firebase-config.js`**
2. Find these placeholder lines:
```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  ...
};
```
3. Replace each `"YOUR_..."` value with your actual Firebase values
4. **Save the file**

---

## <a name="step6"></a>👑 Step 6 — Set Up First Admin Account

> **Important:** You must do this manually via the Firebase Console.

### 6a. Create the admin user account

1. Open your site and go to `register.html`
2. Register a new account with your admin email
3. Note down the user's **UID** (go to Firebase Console → Authentication → Users → copy the UID)

### 6b. Set the admin role in Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click the `users` collection
3. Find the document with your admin UID
4. Click the `role` field → Edit it → Change value from `"user"` to `"admin"`
5. Click **Update**

### 6c. Login to admin panel

Go to: `your-site.github.io/vercelvirgo/admin/`

Login with the same email/password you registered with.

---

## <a name="step7"></a>🛡️ Step 7 — Firestore Security Rules

1. In Firebase Console, go to **Firestore Database → Rules**
2. Replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      // Admin can read all users
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Transactions: users create, only admin updates
    match /coins_transactions/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Commission logs: read-only for users
    match /commission_logs/{id} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Settings: read by all, write by admin only
    match /settings/{doc} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **Publish**

---

## <a name="step8"></a>🚀 Step 8 — Deploy to GitHub Pages

### 8a. Create GitHub Repository

1. Go to **https://github.com** → Login
2. Click **"New repository"**
3. Name it: `vercelvirgo`
4. Set to **Public**
5. Click **Create repository**

### 8b. Upload All Files

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop ALL project files maintaining folder structure:
   ```
   vercelvirgo/
   ├── index.html
   ├── register.html
   ├── login.html
   ├── dashboard.html
   ├── buy-coins.html
   ├── sell-coins.html
   ├── withdraw.html
   ├── team.html
   ├── leaderboard.html
   ├── css/style.css
   ├── js/ (all JS files)
   └── admin/ (all admin pages)
   ```
3. Click **Commit changes**

### 8c. Enable GitHub Pages

1. Go to your repo → **Settings** tab
2. Click **Pages** in the left sidebar
3. Under **Source**, select **"Deploy from a branch"**
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes → Your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/vercelvirgo/
   ```

---

## <a name="admin-guide"></a>🛡️ Admin Panel Guide

**Admin URL:** `https://your-site.github.io/vercelvirgo/admin/`

### Admin Features:

| Page | Description |
|------|-------------|
| `/admin/dashboard.html` | Overview stats & recent activity |
| `/admin/deposits.html` | Approve/reject coin buy requests |
| `/admin/withdrawals.html` | Process withdrawal requests |
| `/admin/sell-requests.html` | Process sell-back requests |
| `/admin/users.html` | Manage all users & adjust balances |
| `/admin/settings.html` | Set coin price, commissions, wallet |

### Approving a Deposit:
1. Go to **Deposits** page
2. Review TX hash and payment proof screenshot
3. Verify payment received in your USDT wallet
4. Click **✅ Approve**
5. Coins are added to user wallet automatically
6. MLM commissions distributed to all upline members automatically

---

## <a name="checklist"></a>✅ First-Time Admin Checklist

After deploying, complete these steps:

- [ ] Go to **Settings** and set **Coin Price** (e.g. $0.10)
- [ ] Set **Level 1 Commission** (default: 10%)
- [ ] Set **Level 2 Commission** (default: 5%)
- [ ] Set **Level 3+ Commission** (default: 2%)
- [ ] Enter your **USDT TRC20 wallet address** (users send payments here)
- [ ] Set **Minimum Withdrawal** amount
- [ ] Set **Minimum Sell** coins amount
- [ ] Click **Save All Settings**
- [ ] Test by registering a user account
- [ ] Test the buy coins flow
- [ ] Verify admin approval works

---

## <a name="structure"></a>📁 File Structure

```
vercelvirgo/
├── index.html              # Landing page with stats ticker
├── register.html           # User registration with referral code
├── login.html              # Login with forgot password
├── dashboard.html          # User dashboard with wallet & stats
├── buy-coins.html          # Buy coins via USDT proof submission
├── sell-coins.html         # Sell coins back to platform
├── withdraw.html           # Withdrawal request
├── team.html               # Visual MLM team tree by levels
├── leaderboard.html        # Top 50 earners leaderboard
│
├── admin/
│   ├── index.html          # Admin login
│   ├── dashboard.html      # Admin overview & activity
│   ├── users.html          # User management & balance adjustment
│   ├── deposits.html       # Deposit approval (triggers commissions)
│   ├── withdrawals.html    # Withdrawal processing
│   ├── sell-requests.html  # Sell-back processing
│   └── settings.html       # Platform configuration
│
├── css/
│   └── style.css           # Complete global styles (dark luxury theme)
│
├── js/
│   ├── firebase-config.js  # Firebase credentials (edit this!)
│   ├── utils.js            # Toast, spinner, formatters, validators
│   ├── auth.js             # Auth guard helpers
│   ├── dashboard.js        # Data loading helpers
│   ├── coins.js            # Coin tx logic + commission distribution
│   ├── referral.js         # MLM tree helpers
│   ├── admin.js            # Admin stats & verification
│   └── admin-sidebar.js    # Shared admin sidebar HTML
│
└── README.md               # This file
```

---

## 💡 Tips

- **Firestore indexes:** If you get "index required" errors, Firebase will show a link to create them automatically — just click it.
- **Image uploads:** Payment proof images are stored as base64 in Firestore. Keep images under 2MB.
- **CORS:** No CORS issues since everything runs client-side.
- **Custom domain:** You can add a custom domain via GitHub Pages settings.

---

## 🆘 Support

Built with ❤️ by **Bajwa Saab** | [@samibajwaisking](https://www.facebook.com/samibajwaisking)

- Facebook: https://www.facebook.com/samibajwaisking
- Instagram: https://www.instagram.com/samibajwaisking
- WhatsApp Channel: https://whatsapp.com/channel/0029VbCNzQeISTkQR04DvX3r

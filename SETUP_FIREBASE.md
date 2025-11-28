# 🔥 Firebase Setup Guide

## ⚠️ IMPORTANT: You must complete this setup before running the app!

The application is currently failing because Firebase credentials are not configured. Follow these steps:

## Step 1: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: **"TechSphere"** (or any name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Enable Services (2 minutes)

### Enable Authentication
1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Google"** → Toggle **Enable** → Click **"Save"**
4. Click **"Email/Password"** → Toggle **Enable** → Click **"Save"**

### Enable Firestore Database
1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose your location (closest to you)
5. Click **"Enable"**

### Enable Storage
1. Click **"Storage"** in sidebar
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **"Done"**

## Step 3: Get Frontend Credentials (1 minute)

1. Click the **⚙️ Settings icon** → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the **Web icon** `</>`
4. Register app with nickname: **"TechSphere Web"**
5. Copy the `firebaseConfig` object

### Update Frontend Config

Open: `frontend/src/firebaseClient.js`

Replace lines 7-13 with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 4: Get Backend Credentials (1 minute)

1. Still in **Project Settings**
2. Click **"Service Accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (downloads a JSON file)
5. Open the downloaded JSON file

### Update Backend Config

Open: `backend/.env`

Replace these lines with values from your JSON file:

```env
FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

**IMPORTANT:** 
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Keep the `\n` characters in the private key
- Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

## Step 5: Run the Application

### Option 1: Using the Batch Script (Easiest)
```bash
# Just double-click: start.bat
```

### Option 2: Manual Start
```bash
cd backend
npm start
```

The backend will automatically launch the frontend!

## ✅ Verification

Once running, you should see:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

Try signing in with Google to verify everything works!

## 🆘 Troubleshooting

### "Failed to parse private key"
→ Make sure you copied the ENTIRE private key including BEGIN and END markers
→ Keep the `\n` characters in the key
→ Keep quotes around the entire key value

### "Firebase config error" in browser
→ Check that you updated `frontend/src/firebaseClient.js` with YOUR config

### "Module not found"
→ Run `npm install` in both backend and frontend folders

### Still having issues?
→ Check that all Firebase services (Auth, Firestore, Storage) are enabled
→ Verify your Firebase project is in "Test mode" for development

---

**After completing these steps, run `start.bat` or `npm start` in the backend folder!**

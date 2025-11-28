# 🚀 Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js 18+ installed
- ✅ Groq API Key (already provided)
- ⚠️ Firebase project (needs setup)

## 5-Minute Setup

### Step 1: Firebase Setup (2 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "TechSphere" (or any name)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Enable "Google" sign-in method
   - Enable "Email/Password" sign-in method

3. **Enable Firestore**
   - Go to "Firestore Database"
   - Click "Create database"
   - Start in "Test mode" (for development)
   - Choose your location
   - Click "Enable"

4. **Enable Storage**
   - Go to "Storage"
   - Click "Get started"
   - Start in "Test mode"
   - Click "Done"

### Step 2: Get Firebase Credentials (1 minute)

#### For Frontend:
1. Go to Project Settings (⚙️ icon) > General
2. Scroll to "Your apps" section
3. Click the Web icon (</>)
4. Register app with nickname "TechSphere Web"
5. Copy the `firebaseConfig` object
6. Open `frontend/src/firebaseClient.js`
7. Replace the config object (lines 7-13)

#### For Backend:
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Open the downloaded JSON file
5. Copy these values to `backend/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Step 3: Install & Run (2 minutes)

Open **TWO** terminal windows:

#### Terminal 1 - Backend:
```bash
cd "C:/Users/dell/Desktop/rls hackathon more/techsphere/backend"
npm install
npm start
```

Wait for: `🚀 TechSphere API server running on port 5000`

#### Terminal 2 - Frontend:
```bash
cd "C:/Users/dell/Desktop/rls hackathon more/techsphere/frontend"
npm install
npm run dev
```

Wait for: `Local: http://localhost:3000`

### Step 4: Open & Enjoy! 🎉

Open your browser to: **http://localhost:3000**

## First Steps in the App

1. **Sign In** - Click "Sign In" button (top right)
2. **Create a Blog** - Click "Write a Blog" or go to `/blog/create`
3. **Try AI Generator** - Click "AI Essay Generator" in navbar
4. **Explore** - Browse blogs, rate them, add comments!

## Common Issues & Fixes

### "Firebase config error"
→ Make sure you updated `frontend/src/firebaseClient.js` with YOUR Firebase config

### "Failed to generate essay"
→ The Groq API key is already set. If it fails, check your internet connection

### "CORS error"
→ Make sure backend is running on port 5000 and frontend on port 3000

### "Module not found"
→ Run `npm install` in both frontend and backend directories

## Need Help?

Check the full README.md for detailed documentation!

---

**Happy coding! 🚀**

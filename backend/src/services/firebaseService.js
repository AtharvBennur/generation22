import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

// Firestore database
export const db = admin.firestore()

// Firebase Auth
export const auth = admin.auth()

// Collections
export const collections = {
  BLOGS: 'blogs',
  USERS: 'users',
  COMMENTS: 'comments',
  RATINGS: 'ratings',
}

/**
 * Verify Firebase ID token
 */
export const verifyToken = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    throw new Error('Invalid token')
  }
}

/**
 * Get user by UID
 */
export const getUserByUid = async (uid) => {
  try {
    const userRecord = await auth.getUser(uid)
    return userRecord
  } catch (error) {
    throw new Error('User not found')
  }
}

export default admin

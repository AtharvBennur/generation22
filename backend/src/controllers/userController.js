import { db, collections, getUserByUid } from '../services/firebaseService.js'

/**
 * Get user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const userRecord = await getUserByUid(userId)

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      createdAt: userRecord.metadata.creationTime,
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(404).json({ error: 'User not found' })
  }
}

/**
 * Get user's blogs
 */
export const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params

    const snapshot = await db
      .collection(collections.BLOGS)
      .where('authorId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const blogs = []
    snapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() })
    })

    res.json(blogs)
  } catch (error) {
    console.error('Get user blogs error:', error)
    res.status(500).json({ error: 'Failed to fetch user blogs' })
  }
}

/**
 * Update user profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const { displayName, photoURL } = req.body

    // Update in Firebase Auth
    const updateData = {}
    if (displayName) updateData.displayName = displayName
    if (photoURL) updateData.photoURL = photoURL

    await admin.auth().updateUser(userId, updateData)

    res.json({ message: 'Profile updated successfully', ...updateData })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export default {
  getUserProfile,
  getUserBlogs,
  updateUserProfile,
}

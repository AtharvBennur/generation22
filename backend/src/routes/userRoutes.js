import express from 'express'
import {
  getUserProfile,
  getUserBlogs,
  updateUserProfile,
} from '../controllers/userController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// User routes
router.get('/:userId', getUserProfile)
router.get('/:userId/blogs', getUserBlogs)
router.put('/:userId', authenticateUser, updateUserProfile)

export default router

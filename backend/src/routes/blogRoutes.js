import express from 'express'
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getTrendingBlogs,
  rateBlog,
  addComment,
  getComments,
} from '../controllers/blogController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', optionalAuth, getAllBlogs)
router.get('/search', optionalAuth, searchBlogs)
router.get('/trending', optionalAuth, getTrendingBlogs)
router.get('/:id', optionalAuth, getBlogById)
router.get('/:id/comments', getComments)

// Protected routes (require authentication)
router.post('/', createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)
router.post('/:id/rate', rateBlog)
router.post('/:id/comments', addComment)

export default router

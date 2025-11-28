import { db, collections } from '../services/firebaseService.js'
import { validateBlogData, validateCommentData, validateRatingData } from '../services/validationService.js'
import { sanitizeBlogData, sanitizeComment } from '../utils/sanitizeInput.js'

/**
 * Get all blogs
 */
export const getAllBlogs = async (req, res) => {
  try {
    const { limit = 50, orderBy = 'createdAt', order = 'desc' } = req.query

    const blogsRef = db.collection(collections.BLOGS)
    const snapshot = await blogsRef
      .orderBy(orderBy, order)
      .limit(parseInt(limit))
      .get()

    const blogs = []
    snapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() })
    })

    res.json(blogs)
  } catch (error) {
    console.error('Get all blogs error:', error)
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
}

/**
 * Get single blog by ID
 */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params

    const blogRef = db.collection(collections.BLOGS).doc(id)
    const doc = await blogRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Increment view count
    await blogRef.update({
      views: (doc.data().views || 0) + 1,
    })

    res.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    console.error('Get blog error:', error)
    res.status(500).json({ error: 'Failed to fetch blog' })
  }
}

/**
 * Create new blog
 */
export const createBlog = async (req, res) => {
  try {
    const sanitizedData = sanitizeBlogData(req.body)
    const validation = validateBlogData(sanitizedData)

    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const blogData = {
      ...sanitizedData,
      authorId: req.body.authorId,
      author: req.body.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      rating: 0,
      ratingCount: 0,
    }

    const docRef = await db.collection(collections.BLOGS).add(blogData)

    res.status(201).json({ id: docRef.id, ...blogData })
  } catch (error) {
    console.error('Create blog error:', error)
    res.status(500).json({ error: 'Failed to create blog' })
  }
}

/**
 * Update blog
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params
    const sanitizedData = sanitizeBlogData(req.body)
    const validation = validateBlogData(sanitizedData)

    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const blogRef = db.collection(collections.BLOGS).doc(id)
    const doc = await blogRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const updateData = {
      ...sanitizedData,
      updatedAt: new Date().toISOString(),
    }

    await blogRef.update(updateData)

    res.json({ id, ...updateData })
  } catch (error) {
    console.error('Update blog error:', error)
    res.status(500).json({ error: 'Failed to update blog' })
  }
}

/**
 * Delete blog
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params

    const blogRef = db.collection(collections.BLOGS).doc(id)
    const doc = await blogRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    await blogRef.delete()

    // Also delete associated comments and ratings
    const commentsSnapshot = await db
      .collection(collections.COMMENTS)
      .where('blogId', '==', id)
      .get()

    const ratingsSnapshot = await db
      .collection(collections.RATINGS)
      .where('blogId', '==', id)
      .get()

    const batch = db.batch()
    commentsSnapshot.forEach((doc) => batch.delete(doc.ref))
    ratingsSnapshot.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()

    res.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Delete blog error:', error)
    res.status(500).json({ error: 'Failed to delete blog' })
  }
}

/**
 * Search blogs
 */
export const searchBlogs = async (req, res) => {
  try {
    const { q, tags } = req.query

    let blogsRef = db.collection(collections.BLOGS)
    const snapshot = await blogsRef.get()

    let blogs = []
    snapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() })
    })

    // Filter by search query
    if (q) {
      const query = q.toLowerCase()
      blogs = blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(query) ||
          blog.content?.toLowerCase().includes(query) ||
          blog.excerpt?.toLowerCase().includes(query)
      )
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim())
      blogs = blogs.filter((blog) =>
        tagArray.some((tag) => blog.tags?.includes(tag))
      )
    }

    res.json(blogs)
  } catch (error) {
    console.error('Search blogs error:', error)
    res.status(500).json({ error: 'Failed to search blogs' })
  }
}

/**
 * Get trending blogs
 */
export const getTrendingBlogs = async (req, res) => {
  try {
    const { limit = 6 } = req.query

    const snapshot = await db.collection(collections.BLOGS).get()

    let blogs = []
    snapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() })
    })

    // Calculate trending score (rating * 0.7 + views * 0.3)
    blogs = blogs
      .map((blog) => ({
        ...blog,
        trendingScore: (blog.rating || 0) * 0.7 + (blog.views || 0) * 0.001,
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, parseInt(limit))

    res.json(blogs)
  } catch (error) {
    console.error('Get trending blogs error:', error)
    res.status(500).json({ error: 'Failed to fetch trending blogs' })
  }
}

/**
 * Rate blog
 */
export const rateBlog = async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body

    const validation = validateRatingData({ rating })
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const blogRef = db.collection(collections.BLOGS).doc(id)
    const doc = await blogRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const blogData = doc.data()
    const currentRating = blogData.rating || 0
    const currentCount = blogData.ratingCount || 0

    // Calculate new average rating
    const newCount = currentCount + 1
    const newRating = ((currentRating * currentCount) + rating) / newCount

    await blogRef.update({
      rating: newRating,
      ratingCount: newCount,
    })

    res.json({ rating: newRating, ratingCount: newCount })
  } catch (error) {
    console.error('Rate blog error:', error)
    res.status(500).json({ error: 'Failed to rate blog' })
  }
}

/**
 * Add comment to blog
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment, author } = req.body

    const validation = validateCommentData({ comment })
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const blogRef = db.collection(collections.BLOGS).doc(id)
    const doc = await blogRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const commentData = {
      blogId: id,
      content: sanitizeComment(comment),
      author,
      createdAt: new Date().toISOString(),
    }

    const commentRef = await db.collection(collections.COMMENTS).add(commentData)

    res.status(201).json({ id: commentRef.id, ...commentData })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

/**
 * Get comments for blog
 */
export const getComments = async (req, res) => {
  try {
    const { id } = req.params

    const snapshot = await db
      .collection(collections.COMMENTS)
      .where('blogId', '==', id)
      .orderBy('createdAt', 'desc')
      .get()

    const comments = []
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() })
    })

    res.json(comments)
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
}

export default {
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
}

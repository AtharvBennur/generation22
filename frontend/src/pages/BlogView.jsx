import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Clock, Eye, Edit, Trash2, Send, Bookmark, BookmarkCheck } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RatingStars from '../components/RatingStars'
import AnimatedSection from '../components/AnimatedSection'
import { blogAPI } from '../utils/api'
import { formatDate, formatFullDate, getReadingTime } from '../utils/formatDate'
import { useUserStore } from '../store/userStore'
import { useSavedBlogsStore } from '../store/blogStore'
import toast from 'react-hot-toast'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUserStore()
  const { savedBlogs, addSavedBlog, removeSavedBlog } = useSavedBlogsStore()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userRating, setUserRating] = useState(0)
  const isSaved = savedBlogs.includes(id)

  useEffect(() => {
    fetchBlog()
    fetchComments()
  }, [id])

  const fetchBlog = async () => {
    try {
      const data = await blogAPI.getBlog(id)
      setBlog(data)
    } catch (error) {
      console.error('Failed to fetch blog:', error)
      toast.error('Blog not found')
      navigate('/blogs')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const data = await blogAPI.getComments(id)
      setComments(data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate')
      return
    }
    try {
      await blogAPI.rateBlog(id, rating)
      setUserRating(rating)
      toast.success('Rating submitted!')
      fetchBlog()
    } catch (error) {
      toast.error('Failed to submit rating')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please sign in to comment')
      return
    }
    if (!newComment.trim()) return

    try {
      await blogAPI.addComment(id, newComment)
      setNewComment('')
      toast.success('Comment added!')
      fetchComments()
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return
    
    try {
      await blogAPI.deleteBlog(id)
      toast.success('Blog deleted successfully')
      navigate('/blogs')
    } catch (error) {
      toast.error('Failed to delete blog')
    }
  }

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedBlog(id)
      toast.success('Removed from saved')
    } else {
      addSavedBlog(id)
      toast.success('Saved!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 shimmer" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 shimmer" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) return null

  const isAuthor = user?.uid === blog.authorId

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection>
          <div className="glass-card p-8 mb-8">
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                {blog.author?.photoURL ? (
                  <img
                    src={blog.author.photoURL}
                    alt={blog.author.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {blog.author?.displayName?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {blog.author?.displayName}
                  </div>
                  <div className="text-sm">{formatFullDate(blog.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(blog.content)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleSaveToggle}
                className="btn-secondary flex items-center space-x-2"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-5 h-5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5" />
                    <span>Save</span>
                  </>
                )}
              </button>
              {isAuthor && (
                <>
                  <Link
                    to={`/blog/edit/${id}`}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="btn-secondary flex items-center space-x-2 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-8 mb-8">
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>
        </AnimatedSection>

        {/* Rating */}
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Rate this blog</h3>
            <div className="flex items-center space-x-4">
              <RatingStars
                rating={userRating || blog.rating || 0}
                onRate={handleRate}
                size="lg"
              />
              <span className="text-gray-600 dark:text-gray-400">
                ({blog.ratingCount || 0} ratings)
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Comments */}
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-6">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                  rows="3"
                />
                <button
                  type="submit"
                  className="btn-primary mt-3 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 glass rounded-xl text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Please sign in to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="glass p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    {comment.author?.photoURL ? (
                      <img
                        src={comment.author.photoURL}
                        alt={comment.author.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {comment.author?.displayName?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">
                          {comment.author?.displayName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default BlogView

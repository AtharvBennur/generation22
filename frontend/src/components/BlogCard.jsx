import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Eye, Bookmark, BookmarkCheck } from 'lucide-react'
import RatingStars from './RatingStars'
import { formatDate, getReadingTime } from '../utils/formatDate'
import { useSavedBlogsStore } from '../store/blogStore'

/**
 * Blog card component with 3D hover effect
 */
const BlogCard = ({ blog }) => {
  const { savedBlogs, addSavedBlog, removeSavedBlog } = useSavedBlogsStore()
  const isSaved = savedBlogs.includes(blog.id)

  const handleSaveToggle = (e) => {
    e.preventDefault()
    if (isSaved) {
      removeSavedBlog(blog.id)
    } else {
      addSavedBlog(blog.id)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8, rotateX: 2 }}
      transition={{ duration: 0.3 }}
      className="card-3d"
    >
      <Link to={`/blog/${blog.id}`} className="block">
        <div className="glass-card p-6 h-full">
          {/* Image */}
          {blog.coverImage && (
            <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={handleSaveToggle}
                  className="p-2 glass rounded-lg hover:scale-110 transition-transform"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {blog.excerpt || blog.content?.substring(0, 150) + '...'}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center mb-4">
            <RatingStars rating={blog.rating || 0} readonly size="sm" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({blog.ratingCount || 0})
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(blog.content)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0}</span>
              </div>
            </div>
            <span>{formatDate(blog.createdAt)}</span>
          </div>

          {/* Author */}
          {blog.author && (
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {blog.author.photoURL ? (
                <img
                  src={blog.author.photoURL}
                  alt={blog.author.displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {blog.author.displayName?.charAt(0) || 'A'}
                </div>
              )}
              <span className="text-sm font-medium">{blog.author.displayName}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default BlogCard

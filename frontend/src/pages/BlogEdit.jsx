import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import MarkdownEditor from '../components/MarkdownEditor'
import AnimatedSection from '../components/AnimatedSection'
import { blogAPI } from '../utils/api'
import { useUserStore } from '../store/userStore'
import toast from 'react-hot-toast'

const TAGS = ['tech', 'AI', 'cloud', 'cybersecurity', 'gadgets', 'data science']

const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to edit')
      navigate('/')
      return
    }
    fetchBlog()
  }, [id, isAuthenticated])

  const fetchBlog = async () => {
    try {
      const blog = await blogAPI.getBlog(id)
      
      // Check if user is the author
      if (blog.authorId !== user.uid) {
        toast.error('You can only edit your own blogs')
        navigate(`/blog/${id}`)
        return
      }

      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
      })
    } catch (error) {
      console.error('Failed to fetch blog:', error)
      toast.error('Blog not found')
      navigate('/blogs')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Please enter content')
      return
    }

    try {
      setLoading(true)
      const blogData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      }
      
      await blogAPI.updateBlog(id, blogData)
      toast.success('Blog updated successfully!')
      navigate(`/blog/${id}`)
    } catch (error) {
      console.error('Failed to update blog:', error)
      toast.error('Failed to update blog')
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  if (fetching) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 shimmer" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 shimmer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            Edit <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your blog content
          </p>
        </AnimatedSection>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <AnimatedSection delay={0.1} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog title..."
              className="input-field"
              required
            />
          </AnimatedSection>

          {/* Excerpt */}
          <AnimatedSection delay={0.15} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of your blog..."
              className="input-field resize-none"
              rows="3"
            />
          </AnimatedSection>

          {/* Cover Image */}
          <AnimatedSection delay={0.2} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="input-field"
            />
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="mt-3 w-full h-48 object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none'
                  toast.error('Invalid image URL')
                }}
              />
            )}
          </AnimatedSection>

          {/* Tags */}
          <AnimatedSection delay={0.25} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Tags (Select up to 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  disabled={!formData.tags.includes(tag) && formData.tags.length >= 5}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'glass hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {formData.tags.join(', ')}
              </p>
            )}
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={0.3} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </AnimatedSection>

          {/* Actions */}
          <AnimatedSection delay={0.35} className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/blog/${id}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </AnimatedSection>
        </form>
      </div>
    </div>
  )
}

export default BlogEdit

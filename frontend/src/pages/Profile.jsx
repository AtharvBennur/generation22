import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Bookmark, User } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import { useUserStore } from '../store/userStore'
import { useSavedBlogsStore } from '../store/blogStore'
import { userAPI, blogAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUserStore()
  const { savedBlogs } = useSavedBlogsStore()
  const [userBlogs, setUserBlogs] = useState([])
  const [savedBlogData, setSavedBlogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('my-blogs')

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to view profile')
      navigate('/')
      return
    }
    fetchUserData()
  }, [isAuthenticated])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Fetch user's blogs
      const blogs = await userAPI.getUserBlogs(user.uid)
      setUserBlogs(blogs)

      // Fetch saved blogs
      const savedBlogsData = await Promise.all(
        savedBlogs.map(async (id) => {
          try {
            return await blogAPI.getBlog(id)
          } catch (error) {
            return null
          }
        })
      )
      setSavedBlogData(savedBlogsData.filter(Boolean))
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <AnimatedSection>
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center space-x-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">
                  {user.displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {user.email}
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-2xl gradient-text">
                      {userBlogs.length}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">Blogs</p>
                  </div>
                  <div>
                    <span className="font-semibold text-2xl gradient-text">
                      {savedBlogs.length}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">Saved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('my-blogs')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'my-blogs'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'glass hover:scale-105'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>My Blogs</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'glass hover:scale-105'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span>Saved Blogs</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.2}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : activeTab === 'my-blogs' ? (
            userBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-card">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold mb-2">No blogs yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start sharing your knowledge with the community
                </p>
                <button
                  onClick={() => navigate('/blog/create')}
                  className="btn-primary"
                >
                  Write Your First Blog
                </button>
              </div>
            )
          ) : savedBlogData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedBlogData.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold mb-2">No saved blogs</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Save blogs to read them later
              </p>
              <button
                onClick={() => navigate('/blogs')}
                className="btn-primary"
              >
                Explore Blogs
              </button>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  )
}

export default Profile

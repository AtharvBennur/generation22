import { useEffect, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import { blogAPI } from '../utils/api'
import { useBlogStore } from '../store/blogStore'
import AnimatedSection from '../components/AnimatedSection'

const TAGS = ['tech', 'AI', 'cloud', 'cybersecurity', 'gadgets', 'data science']

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getAllBlogs()
      setBlogs(data)
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.searchBlogs(searchQuery, selectedTags)
      setBlogs(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    fetchBlogs()
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => blog.tags?.includes(tag))

    return matchesSearch && matchesTags
  })

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            Explore <span className="gradient-text">Tech Blogs</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover amazing content from our community of tech enthusiasts
          </p>
        </AnimatedSection>

        {/* Search and Filters */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="glass-card p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search blogs by title or content..."
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Tag Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium mb-3">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'glass hover:scale-105'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {selectedTags.length > 0 && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => toggleTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {loading ? 'Loading...' : `${filteredBlogs.length} blog${filteredBlogs.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">No blogs found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList

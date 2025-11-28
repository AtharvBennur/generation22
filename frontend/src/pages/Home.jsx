import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, BookOpen, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import { blogAPI } from '../utils/api'

const Home = () => {
  const [trendingBlogs, setTrendingBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingBlogs()
  }, [])

  const fetchTrendingBlogs = async () => {
    try {
      const data = await blogAPI.getTrendingBlogs(6)
      setTrendingBlogs(data)
    } catch (error) {
      console.error('Failed to fetch trending blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                Welcome to{' '}
                <span className="gradient-text">AI-Assign-Eval</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Explore cutting-edge tech blogs and generate AI-powered essays with our advanced platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link to="/blogs" className="btn-primary text-lg flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Explore Blogs</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/ai-essay" className="btn-secondary text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>AI Essay Generator</span>
              </Link>
              <a
                href="https://your-main-website.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>My Main Website</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: 'Tech Articles', value: '1000+', icon: BookOpen },
                { label: 'AI Generated', value: '5000+', icon: Sparkles },
                { label: 'Active Users', value: '10K+', icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-transparent to-purple-50/50 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="gradient-text">AI-Assign-Eval</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The ultimate platform for tech enthusiasts and content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Rich Blog System',
                description: 'Write, read, and interact with tech blogs. Rate, comment, and bookmark your favorites.',
                icon: BookOpen,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'AI-Powered Essays',
                description: 'Generate comprehensive essays on any topic using advanced AI technology.',
                icon: Sparkles,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Trending Content',
                description: 'Discover the most popular and highly-rated content from our community.',
                icon: TrendingUp,
                gradient: 'from-orange-500 to-red-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="glass-card p-8"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Trending Blogs Section */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-2">
                <span className="gradient-text">Trending</span> Blogs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most popular content from our community
              </p>
            </div>
            <Link
              to="/blogs"
              className="btn-secondary flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : trendingBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No blogs yet. Be the first to write one!
              </p>
              <Link to="/blog/create" className="btn-primary mt-4 inline-flex items-center space-x-2">
                <span>Write a Blog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-bold mb-4">
                Ready to Start Writing?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our community of tech enthusiasts and share your knowledge with the world
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/blog/create" className="btn-primary text-lg flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Write Your First Blog</span>
                </Link>
                <Link to="/ai-essay" className="btn-secondary text-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Try AI Generator</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default Home

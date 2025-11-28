import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Menu, X, Sparkles, BookOpen, User, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useThemeStore, useUserStore } from '../store/userStore'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const { user, isAuthenticated, setUser, logout } = useUserStore()
  const navigate = useNavigate()

  // Handle Demo Sign In (works without Firebase)
  const handleSignIn = () => {
    setUser({
      uid: 'demo-user-' + Date.now(),
      email: 'demo@ai-assign-eval.com',
      displayName: 'Demo User',
      photoURL: null,
    })
    toast.success('Welcome to AI-Assign-Eval! (Demo Mode)')
  }

  // Handle Sign Out
  const handleSignOut = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'AI Essay', path: '/ai-essay', icon: Sparkles },
  ]

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-display font-bold gradient-text">
              AI-Assign-Eval
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Main Website Button */}
            <a
              href="https://your-main-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              My Main Website
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 glass px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{user?.displayName?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg glass hover:scale-110 transition-transform"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="btn-primary text-sm flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}

            <a
              href="https://your-main-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              My Main Website
            </a>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg glass"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleSignIn()
                  setIsOpen(false)
                }}
                className="w-full btn-primary text-sm"
              >
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar

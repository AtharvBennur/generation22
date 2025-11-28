import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useThemeStore } from './store/userStore'

// Pages
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogView from './pages/BlogView'
import BlogCreate from './pages/BlogCreate'
import BlogEdit from './pages/BlogEdit'
import EssayGenerator from './pages/EssayGenerator'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogView />} />
            <Route path="/blog/create" element={<BlogCreate />} />
            <Route path="/blog/edit/:id" element={<BlogEdit />} />
            <Route path="/ai-essay" element={<EssayGenerator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { spawn, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import axios from 'axios'

// Load environment variables
dotenv.config()

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// AUTO INSTALL & SETUP
// ============================================
async function setupAndStart() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║                                                                ║')
  console.log('║          🚀 AI-Assign-Eval - Auto Setup & Launch              ║')
  console.log('║                                                                ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  const frontendPath = path.join(__dirname, '..', 'frontend')
  const backendPath = __dirname
  const isWindows = process.platform === 'win32'
  const npmCmd = isWindows ? 'npm.cmd' : 'npm'

  // Check and install backend dependencies
  if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
    console.log('📦 Installing backend dependencies...')
    try {
      execSync(`${npmCmd} install`, { cwd: backendPath, stdio: 'inherit' })
      console.log('✅ Backend dependencies installed!\n')
    } catch (error) {
      console.error('❌ Failed to install backend dependencies')
    }
  } else {
    console.log('✅ Backend dependencies already installed')
  }

  // Check and install frontend dependencies
  if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
    console.log('📦 Installing frontend dependencies...')
    try {
      execSync(`${npmCmd} install`, { cwd: frontendPath, stdio: 'inherit' })
      console.log('✅ Frontend dependencies installed!\n')
    } catch (error) {
      console.error('❌ Failed to install frontend dependencies')
    }
  } else {
    console.log('✅ Frontend dependencies already installed')
  }

  console.log('\n🎯 Starting servers...\n')
  
  // Start the main server
  startServer()
}

// ============================================
// MOCK DATA STORAGE (Demo Mode)
// ============================================
let blogs = [
  {
    id: '1',
    title: 'Welcome to AI-Assign-Eval!',
    content: '# Welcome to AI-Assign-Eval\n\nThis is your premium blog and AI essay platform.\n\n## Features\n- **Create blogs** with Markdown editor\n- **AI Essay Generator** powered by Groq\n- **Rate and comment** on posts\n- **Search and filter** content\n\n## Getting Started\n1. Click **Sign In** to use demo mode\n2. Create your first blog post\n3. Try the AI Essay Generator\n\nEnjoy! 🚀',
    excerpt: 'Welcome to AI-Assign-Eval - your premium blog and AI essay platform',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    tags: ['tech', 'AI'],
    authorId: 'demo-user',
    author: {
      displayName: 'Demo User',
      photoURL: null,
      email: 'demo@ai-assign-eval.com'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 42,
    rating: 4.5,
    ratingCount: 10
  }
]
let comments = []

// ============================================
// EXPRESS APP SETUP
// ============================================
const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============================================
// API ROUTES (All inline for demo mode)
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI-Assign-Eval API is running', mode: 'DEMO' })
})

// Blog routes
app.get('/api/blogs', (req, res) => res.json(blogs))

app.get('/api/blogs/trending', (req, res) => res.json(blogs.slice(0, 6)))

app.get('/api/blogs/search', (req, res) => {
  const { q, tags } = req.query
  let filtered = blogs
  if (q) {
    filtered = filtered.filter(blog => 
      blog.title.toLowerCase().includes(q.toLowerCase()) ||
      blog.content.toLowerCase().includes(q.toLowerCase())
    )
  }
  if (tags) {
    const tagArray = tags.split(',')
    filtered = filtered.filter(blog => tagArray.some(tag => blog.tags?.includes(tag)))
  }
  res.json(filtered)
})

app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  blog.views++
  res.json(blog)
})

app.post('/api/blogs', (req, res) => {
  const newBlog = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    rating: 0,
    ratingCount: 0
  }
  blogs.push(newBlog)
  res.status(201).json(newBlog)
})

app.put('/api/blogs/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Blog not found' })
  blogs[index] = { ...blogs[index], ...req.body, updatedAt: new Date().toISOString() }
  res.json(blogs[index])
})

app.delete('/api/blogs/:id', (req, res) => {
  blogs = blogs.filter(b => b.id !== req.params.id)
  res.json({ message: 'Blog deleted' })
})

app.post('/api/blogs/:id/rate', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  const { rating } = req.body
  blog.ratingCount++
  blog.rating = ((blog.rating * (blog.ratingCount - 1)) + rating) / blog.ratingCount
  res.json({ rating: blog.rating, ratingCount: blog.ratingCount })
})

app.get('/api/blogs/:id/comments', (req, res) => {
  res.json(comments.filter(c => c.blogId === req.params.id))
})

app.post('/api/blogs/:id/comments', (req, res) => {
  const newComment = {
    id: Date.now().toString(),
    blogId: req.params.id,
    content: req.body.comment,
    author: req.body.author || { displayName: 'Anonymous' },
    createdAt: new Date().toISOString()
  }
  comments.push(newComment)
  res.status(201).json(newComment)
})

// AI routes
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { topic, style = 'academic', length = 'medium' } = req.body
    console.log('🤖 AI Request:', { topic, style, length })
    
    if (!topic) return res.status(400).json({ error: 'Topic is required' })
    
    const wordCounts = { short: '250', medium: '500', long: '1000' }
    const wordCount = wordCounts[length] || '500'
    
    const stylePrompts = {
      academic: `Write a well-researched academic essay about "${topic}". Use formal language. Approximately ${wordCount} words.`,
      creative: `Write a creative essay about "${topic}". Use vivid language. Approximately ${wordCount} words.`,
      simple: `Write a simple essay about "${topic}". Use clear language. Approximately ${wordCount} words.`,
      formal: `Write a formal essay about "${topic}". Use professional language. Approximately ${wordCount} words.`
    }
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: stylePrompts[style] || stylePrompts.academic }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )
    
    console.log('✅ AI Response received')
    res.json({ essay: response.data.choices[0].message.content, metadata: { topic, style, length, generatedAt: new Date().toISOString() } })
  } catch (error) {
    console.error('❌ AI Error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to generate essay', details: error.response?.data?.error?.message || error.message })
  }
})

// User routes
app.get('/api/users/:userId', (req, res) => {
  res.json({ uid: req.params.userId, email: 'demo@ai-assign-eval.com', displayName: 'Demo User', photoURL: null })
})

app.get('/api/users/:userId/blogs', (req, res) => {
  res.json(blogs.filter(b => b.authorId === req.params.userId))
})

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// ============================================
// SERVER START FUNCTION
// ============================================
function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Backend API running on: http://localhost:${PORT}`)
    console.log(`📝 Mode: DEMO (In-memory storage)`)
    console.log(`🔑 AI API Key: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}\n`)
    
    // Launch frontend
    launchFrontend()
  })
}

// ============================================
// FRONTEND LAUNCHER
// ============================================
function launchFrontend() {
  console.log('🎨 Launching frontend...\n')
  
  const frontendPath = path.join(__dirname, '..', 'frontend')
  const isWindows = process.platform === 'win32'
  const npmCommand = isWindows ? 'npm.cmd' : 'npm'
  
  const frontend = spawn(npmCommand, ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'inherit',
    shell: true
  })
  
  frontend.on('error', (error) => {
    console.error('❌ Failed to start frontend:', error.message)
  })
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...')
    frontend.kill()
    process.exit()
  })
  
  process.on('SIGTERM', () => {
    frontend.kill()
    process.exit()
  })
}

// ============================================
// START THE APPLICATION
// ============================================
setupAndStart()

export default app

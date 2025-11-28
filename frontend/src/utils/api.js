import axios from 'axios'

// API base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Blog API calls
export const blogAPI = {
  // Get all blogs
  getAllBlogs: async (params = {}) => {
    const response = await api.get('/blogs', { params })
    return response.data
  },

  // Get single blog
  getBlog: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response.data
  },

  // Create blog
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData)
    return response.data
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData)
    return response.data
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`)
    return response.data
  },

  // Rate blog
  rateBlog: async (id, rating) => {
    const response = await api.post(`/blogs/${id}/rate`, { rating })
    return response.data
  },

  // Add comment
  addComment: async (id, comment) => {
    const response = await api.post(`/blogs/${id}/comments`, { comment })
    return response.data
  },

  // Get comments
  getComments: async (id) => {
    const response = await api.get(`/blogs/${id}/comments`)
    return response.data
  },

  // Search blogs
  searchBlogs: async (query, tags = []) => {
    const response = await api.get('/blogs/search', {
      params: { q: query, tags: tags.join(',') }
    })
    return response.data
  },

  // Get trending blogs
  getTrendingBlogs: async (limit = 6) => {
    const response = await api.get('/blogs/trending', { params: { limit } })
    return response.data
  },
}

// AI API calls
export const aiAPI = {
  // Generate essay
  generateEssay: async (topic, style = 'academic', length = 'medium') => {
    const response = await api.post('/ai/generate', { topic, style, length })
    return response.data
  },

  // Refine essay
  refineEssay: async (essay, instructions) => {
    const response = await api.post('/ai/refine', { essay, instructions })
    return response.data
  },
}

// User API calls
export const userAPI = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}`, profileData)
    return response.data
  },

  // Get user blogs
  getUserBlogs: async (userId) => {
    const response = await api.get(`/users/${userId}/blogs`)
    return response.data
  },
}

export default api

import { create } from 'zustand'

// Blog store for managing blog state
export const useBlogStore = create((set) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  
  // Set blogs
  setBlogs: (blogs) => set({ blogs }),
  
  // Set current blog
  setCurrentBlog: (blog) => set({ currentBlog: blog }),
  
  // Set loading state
  setLoading: (loading) => set({ loading }),
  
  // Set error
  setError: (error) => set({ error }),
  
  // Set search query
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Set selected tags
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  
  // Add tag to selected tags
  addTag: (tag) => set((state) => ({
    selectedTags: [...state.selectedTags, tag]
  })),
  
  // Remove tag from selected tags
  removeTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.filter(t => t !== tag)
  })),
  
  // Clear filters
  clearFilters: () => set({ searchQuery: '', selectedTags: [] }),
}))

// Saved blogs store
export const useSavedBlogsStore = create(
  (set) => ({
    savedBlogs: [],
    
    // Add blog to saved
    addSavedBlog: (blogId) => set((state) => ({
      savedBlogs: [...state.savedBlogs, blogId]
    })),
    
    // Remove blog from saved
    removeSavedBlog: (blogId) => set((state) => ({
      savedBlogs: state.savedBlogs.filter(id => id !== blogId)
    })),
    
    // Check if blog is saved
    isSaved: (blogId) => {
      const state = useSavedBlogsStore.getState()
      return state.savedBlogs.includes(blogId)
    },
  })
)

/**
 * Sanitize user input to prevent XSS and injection attacks
 */

/**
 * Sanitize string input
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 10000) // Limit length
}

/**
 * Sanitize blog data
 */
export const sanitizeBlogData = (data) => {
  return {
    title: sanitizeString(data.title),
    content: data.content?.trim().substring(0, 50000),
    excerpt: data.excerpt ? sanitizeString(data.excerpt) : '',
    coverImage: data.coverImage ? data.coverImage.trim().substring(0, 500) : '',
    tags: Array.isArray(data.tags) 
      ? data.tags.slice(0, 10).map(tag => sanitizeString(tag))
      : [],
  }
}

/**
 * Sanitize comment
 */
export const sanitizeComment = (comment) => {
  return sanitizeString(comment).substring(0, 1000)
}

export default {
  sanitizeString,
  sanitizeBlogData,
  sanitizeComment,
}

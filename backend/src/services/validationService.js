/**
 * Validation service for request data
 */

/**
 * Validate blog data
 */
export const validateBlogData = (data) => {
  const errors = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required')
  }

  if (data.content && data.content.length > 50000) {
    errors.push('Content must be less than 50000 characters')
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array')
  }

  if (data.tags && data.tags.length > 10) {
    errors.push('Maximum 10 tags allowed')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate comment data
 */
export const validateCommentData = (data) => {
  const errors = []

  if (!data.comment || data.comment.trim().length === 0) {
    errors.push('Comment is required')
  }

  if (data.comment && data.comment.length > 1000) {
    errors.push('Comment must be less than 1000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate rating data
 */
export const validateRatingData = (data) => {
  const errors = []

  if (!data.rating) {
    errors.push('Rating is required')
  }

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push('Rating must be between 1 and 5')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate AI generation data
 */
export const validateAIGenerationData = (data) => {
  const errors = []

  if (!data.topic || data.topic.trim().length === 0) {
    errors.push('Topic is required')
  }

  if (data.topic && data.topic.length > 500) {
    errors.push('Topic must be less than 500 characters')
  }

  const validStyles = ['academic', 'creative', 'simple', 'formal']
  if (data.style && !validStyles.includes(data.style)) {
    errors.push('Invalid style. Must be one of: academic, creative, simple, formal')
  }

  const validLengths = ['short', 'medium', 'long']
  if (data.length && !validLengths.includes(data.length)) {
    errors.push('Invalid length. Must be one of: short, medium, long')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export default {
  validateBlogData,
  validateCommentData,
  validateRatingData,
  validateAIGenerationData,
}

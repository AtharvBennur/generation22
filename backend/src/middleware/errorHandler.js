/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Default error
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401
    message = 'Unauthorized access'
  }

  if (err.code === 'auth/id-token-expired') {
    statusCode = 401
    message = 'Token expired'
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler

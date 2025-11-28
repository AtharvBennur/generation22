import { verifyToken } from '../services/firebaseService.js'

/**
 * Middleware to verify Firebase authentication token
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split('Bearer ')[1]

    // Verify token with Firebase
    const decodedToken = await verifyToken(token)
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await verifyToken(token)
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

export default {
  authenticateUser,
  optionalAuth,
}

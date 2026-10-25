const jwt   = require('jsonwebtoken')
const Admin = require('../models/Admin')

/**
 * Protect routes — verifies JWT from Authorization header or cookie.
 * Attaches req.admin on success.
 */
const protect = async (req, res, next) => {
  let token

  // 1. Check Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // 2. Fallback: HTTP-only cookie
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = await Admin.findById(decoded.id).select('-password')

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — admin account not found',
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token invalid or expired',
    })
  }
}

module.exports = { protect }

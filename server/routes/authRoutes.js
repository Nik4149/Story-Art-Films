const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
} = require('../controllers/authController')

// POST /api/auth/register  — First-time admin setup (blocked if admin exists)
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/logout
router.post('/logout', protect, logout)

// GET  /api/auth/me
// PUT  /api/auth/me
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)

module.exports = router

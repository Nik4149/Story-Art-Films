const asyncHandler   = require('express-async-handler')
const Admin          = require('../models/Admin')
const generateToken  = require('../utils/generateToken')

// ── Cookie options ─────────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const safeAdmin = (admin, token) => ({
  _id:   admin._id,
  name:  admin.name,
  email: admin.email,
  token,
})

// ── Controllers ────────────────────────────────────────────────────────────────

/**
 * @desc    Register first admin (only when no admin exists)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const count = await Admin.countDocuments()
  if (count > 0) {
    res.status(403)
    throw new Error('Admin already exists. Use the login endpoint.')
  }

  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email and password are required')
  }

  const admin = await Admin.create({ name, email, password })
  const token = generateToken(admin._id)

  res.cookie('jwt', token, cookieOptions)

  res.status(201).json({
    success: true,
    data:    safeAdmin(admin, token),
    message: 'Admin account created successfully',
  })
})

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  // Explicitly include password for comparison
  const admin = await Admin.findOne({ email }).select('+password')

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const token = generateToken(admin._id)

  res.cookie('jwt', token, cookieOptions)

  res.json({
    success: true,
    data:    safeAdmin(admin, token),
    message: 'Login successful',
  })
})

/**
 * @desc    Admin logout — clears cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' })
  res.json({ success: true, message: 'Logged out successfully' })
})

/**
 * @desc    Get current logged-in admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin })
})

/**
 * @desc    Update admin profile (name / email)
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id)

  if (req.body.name)  admin.name  = req.body.name
  if (req.body.email) admin.email = req.body.email

  // Password change requires current password
  if (req.body.newPassword) {
    if (!req.body.currentPassword) {
      res.status(400)
      throw new Error('Current password is required to set a new one')
    }
    const match = await admin.matchPassword(req.body.currentPassword)
    if (!match) {
      res.status(401)
      throw new Error('Current password is incorrect')
    }
    admin.password = req.body.newPassword
  }

  const updated = await admin.save()

  res.json({
    success: true,
    data:    { _id: updated._id, name: updated.name, email: updated.email },
    message: 'Profile updated',
  })
})

module.exports = { register, login, logout, getMe, updateMe }

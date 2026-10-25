const asyncHandler = require('express-async-handler')
const Newsletter   = require('../models/Newsletter')

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter
 * @access  Public
 */
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    res.status(400)
    throw new Error('Email is required')
  }

  // Check if already subscribed
  const existing = await Newsletter.findOne({ email })

  if (existing) {
    if (existing.isActive) {
      return res.json({
        success: true,
        message: 'You are already subscribed!',
      })
    }
    // Re-activate
    existing.isActive = true
    await existing.save()
    return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' })
  }

  await Newsletter.create({ email })

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing!',
  })
})

/**
 * @desc    Get all subscribers
 * @route   GET /api/newsletter
 * @access  Private
 */
const getSubscribers = asyncHandler(async (req, res) => {
  const { active, page = 1, limit = 50 } = req.query

  const filter = {}
  if (active !== undefined) filter.isActive = active === 'true'

  const total       = await Newsletter.countDocuments(filter)
  const subscribers = await Newsletter.find(filter)
    .sort({ subscribedAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({
    success: true,
    count:   subscribers.length,
    total,
    data:    subscribers,
  })
})

/**
 * @desc    Unsubscribe (soft-delete)
 * @route   DELETE /api/newsletter/:id
 * @access  Private
 */
const unsubscribe = asyncHandler(async (req, res) => {
  const sub = await Newsletter.findById(req.params.id)
  if (!sub) { res.status(404); throw new Error('Subscriber not found') }

  sub.isActive = false
  await sub.save()

  res.json({ success: true, message: 'Subscriber removed' })
})

module.exports = { subscribe, getSubscribers, unsubscribe }

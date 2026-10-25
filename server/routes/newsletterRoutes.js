const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  subscribe,
  getSubscribers,
  unsubscribe,
} = require('../controllers/newsletterController')

// POST /api/newsletter  — public
// GET  /api/newsletter  — admin only
router.route('/')
  .post(subscribe)
  .get(protect, getSubscribers)

// DELETE /api/newsletter/:id  — admin only
router.delete('/:id', protect, unsubscribe)

module.exports = router

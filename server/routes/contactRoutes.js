const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  createContact,
  getContacts,
  markAsRead,
  deleteContact,
} = require('../controllers/contactController')

// POST /api/contact  — public
// GET  /api/contact  — admin only
router.route('/')
  .post(createContact)
  .get(protect, getContacts)

// PUT    /api/contact/:id  — admin (mark as read)
// DELETE /api/contact/:id  — admin
router.route('/:id')
  .put(protect, markAsRead)
  .delete(protect, deleteContact)

module.exports = router

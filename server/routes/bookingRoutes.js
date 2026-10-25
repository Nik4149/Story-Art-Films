const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController')

// POST /api/bookings  — public (customer submits)
// GET  /api/bookings  — admin only
router.route('/')
  .post(createBooking)
  .get(protect, getBookings)

// GET    /api/bookings/:id  — admin only
// PUT    /api/bookings/:id  — admin only (update status / notes)
// DELETE /api/bookings/:id  — admin only
router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking)

module.exports = router

const asyncHandler         = require('express-async-handler')
const Booking              = require('../models/Booking')
const { sendBookingEmails } = require('../utils/emailService')

/**
 * @desc    Submit a new booking (customer-facing)
 * @route   POST /api/bookings
 * @access  Public
 */
const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, type, date, location, hours, budget, message } = req.body

  // Required field validation
  const missing = []
  if (!name)    missing.push('name')
  if (!email)   missing.push('email')
  if (!phone)   missing.push('phone')
  if (!type)    missing.push('type')
  if (!date)    missing.push('date')
  if (!message) missing.push('message')

  if (missing.length) {
    res.status(400)
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }

  const booking = await Booking.create({
    name, email, phone, type, date, location, hours, budget, message,
    status: 'Pending',
  })

  // Fire emails (non-blocking — we don't fail the response if email errors)
  const emailSent = await sendBookingEmails(booking)
  if (emailSent) {
    booking.emailSent = true
    await booking.save()
  }

  res.status(201).json({
    success: true,
    data:    { _id: booking._id, name: booking.name, email: booking.email },
    message: 'Booking request received. We will contact you within 24 hours.',
  })
})

/**
 * @desc    Get all bookings (with optional status filter + pagination)
 * @route   GET /api/bookings
 * @access  Private
 */
const getBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query

  const filter = {}
  if (status) filter.status = status

  const total    = await Booking.countDocuments(filter)
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  // Counts by status for dashboard summary
  const [pending, confirmed, completed, cancelled] = await Promise.all([
    Booking.countDocuments({ status: 'Pending' }),
    Booking.countDocuments({ status: 'Confirmed' }),
    Booking.countDocuments({ status: 'Completed' }),
    Booking.countDocuments({ status: 'Cancelled' }),
  ])

  res.json({
    success: true,
    count:   bookings.length,
    total,
    pages:   Math.ceil(total / Number(limit)),
    summary: { pending, confirmed, completed, cancelled },
    data:    bookings,
  })
})

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  res.json({ success: true, data: booking })
})

/**
 * @desc    Update booking (status, admin notes)
 * @route   PUT /api/bookings/:id
 * @access  Private
 */
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  const { status, adminNotes } = req.body

  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
  if (status && !validStatuses.includes(status)) {
    res.status(400)
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
  }

  if (status)      booking.status     = status
  if (adminNotes !== undefined) booking.adminNotes = adminNotes

  const updated = await booking.save()

  res.json({
    success: true,
    data:    updated,
    message: `Booking updated to ${updated.status}`,
  })
})

/**
 * @desc    Delete booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  await booking.deleteOne()

  res.json({ success: true, message: 'Booking deleted' })
})

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
}

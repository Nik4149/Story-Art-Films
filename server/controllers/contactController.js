const asyncHandler          = require('express-async-handler')
const Contact               = require('../models/Contact')
const { sendContactEmail }  = require('../utils/emailService')

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body

  if (!name || !email || !message) {
    res.status(400)
    throw new Error('Name, email and message are required')
  }

  const contact = await Contact.create({ name, email, phone, message })

  // Notify admin (non-blocking)
  await sendContactEmail(contact)

  res.status(201).json({
    success: true,
    data:    { _id: contact._id },
    message: 'Message received. Thank you for reaching out!',
  })
})

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Private
 */
const getContacts = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query

  const filter = {}
  if (isRead !== undefined) filter.isRead = isRead === 'true'

  const total    = await Contact.countDocuments(filter)
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  const unread = await Contact.countDocuments({ isRead: false })

  res.json({
    success: true,
    count:   contacts.length,
    total,
    unread,
    data:    contacts,
  })
})

/**
 * @desc    Mark contact as read
 * @route   PUT /api/contact/:id
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) { res.status(404); throw new Error('Message not found') }

  contact.isRead = true
  await contact.save()

  res.json({ success: true, data: contact, message: 'Marked as read' })
})

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/:id
 * @access  Private
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) { res.status(404); throw new Error('Message not found') }

  await contact.deleteOne()
  res.json({ success: true, message: 'Message deleted' })
})

module.exports = { createContact, getContacts, markAsRead, deleteContact }

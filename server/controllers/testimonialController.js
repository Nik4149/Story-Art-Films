const asyncHandler  = require('express-async-handler')
const Testimonial   = require('../models/Testimonial')

/**
 * @desc    Get all published testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
const getTestimonials = asyncHandler(async (req, res) => {
  const { all } = req.query
  const filter = all ? {} : { isPublished: true }

  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 })

  res.json({ success: true, count: items.length, data: items })
})

/**
 * @desc    Get single testimonial
 * @route   GET /api/testimonials/:id
 * @access  Private
 */
const getTestimonialById = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id)
  if (!item) { res.status(404); throw new Error('Testimonial not found') }
  res.json({ success: true, data: item })
})

/**
 * @desc    Create testimonial
 * @route   POST /api/testimonials
 * @access  Private
 */
const createTestimonial = asyncHandler(async (req, res) => {
  const { quote, name, role, rating, isPublished, order } = req.body

  if (!quote || !name || !role) {
    res.status(400)
    throw new Error('Quote, name and role are required')
  }

  const item = await Testimonial.create({
    quote, name, role,
    rating:      Number(rating  || 5),
    isPublished: isPublished !== false,
    order:       Number(order   || 0),
  })

  res.status(201).json({ success: true, data: item, message: 'Testimonial created' })
})

/**
 * @desc    Update testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private
 */
const updateTestimonial = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id)
  if (!item) { res.status(404); throw new Error('Testimonial not found') }

  const { quote, name, role, rating, isPublished, order } = req.body

  if (quote       !== undefined) item.quote       = quote
  if (name        !== undefined) item.name        = name
  if (role        !== undefined) item.role        = role
  if (rating      !== undefined) item.rating      = Number(rating)
  if (isPublished !== undefined) item.isPublished = isPublished
  if (order       !== undefined) item.order       = Number(order)

  const updated = await item.save()
  res.json({ success: true, data: updated, message: 'Testimonial updated' })
})

/**
 * @desc    Delete testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private
 */
const deleteTestimonial = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id)
  if (!item) { res.status(404); throw new Error('Testimonial not found') }

  await item.deleteOne()
  res.json({ success: true, message: 'Testimonial deleted' })
})

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
}

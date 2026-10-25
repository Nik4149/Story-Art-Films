const asyncHandler = require('express-async-handler')
const Pricing      = require('../models/Pricing')

/**
 * @desc    Get all active pricing packages
 * @route   GET /api/pricing
 * @access  Public
 */
const getPricing = asyncHandler(async (req, res) => {
  const { all } = req.query
  const filter  = all ? {} : { isActive: true }

  const packages = await Pricing.find(filter).sort({ order: 1 })
  res.json({ success: true, count: packages.length, data: packages })
})

/**
 * @desc    Get single package
 * @route   GET /api/pricing/:id
 * @access  Private
 */
const getPricingById = asyncHandler(async (req, res) => {
  const pkg = await Pricing.findById(req.params.id)
  if (!pkg) { res.status(404); throw new Error('Pricing package not found') }
  res.json({ success: true, data: pkg })
})

/**
 * @desc    Create pricing package
 * @route   POST /api/pricing
 * @access  Private
 */
const createPricing = asyncHandler(async (req, res) => {
  const { name, tagline, price, duration, features, isPopular, isActive, order } = req.body

  if (!name || !price) {
    res.status(400)
    throw new Error('Name and price are required')
  }

  // Ensure only one package is marked as popular
  if (isPopular) {
    await Pricing.updateMany({ isPopular: true }, { isPopular: false })
  }

  const pkg = await Pricing.create({
    name,
    tagline:  tagline  || '',
    price,
    duration: duration || '',
    features: Array.isArray(features) ? features : [],
    isPopular: Boolean(isPopular),
    isActive:  isActive !== false,
    order:     Number(order || 0),
  })

  res.status(201).json({ success: true, data: pkg, message: 'Pricing package created' })
})

/**
 * @desc    Update pricing package
 * @route   PUT /api/pricing/:id
 * @access  Private
 */
const updatePricing = asyncHandler(async (req, res) => {
  const pkg = await Pricing.findById(req.params.id)
  if (!pkg) { res.status(404); throw new Error('Pricing package not found') }

  const { name, tagline, price, duration, features, isPopular, isActive, order } = req.body

  // Enforce single popular
  if (isPopular && !pkg.isPopular) {
    await Pricing.updateMany({ _id: { $ne: pkg._id }, isPopular: true }, { isPopular: false })
  }

  if (name        !== undefined) pkg.name        = name
  if (tagline     !== undefined) pkg.tagline     = tagline
  if (price       !== undefined) pkg.price       = price
  if (duration    !== undefined) pkg.duration    = duration
  if (features    !== undefined) pkg.features    = features
  if (isPopular   !== undefined) pkg.isPopular   = Boolean(isPopular)
  if (isActive    !== undefined) pkg.isActive    = Boolean(isActive)
  if (order       !== undefined) pkg.order       = Number(order)

  const updated = await pkg.save()
  res.json({ success: true, data: updated, message: 'Pricing package updated' })
})

/**
 * @desc    Delete pricing package
 * @route   DELETE /api/pricing/:id
 * @access  Private
 */
const deletePricing = asyncHandler(async (req, res) => {
  const pkg = await Pricing.findById(req.params.id)
  if (!pkg) { res.status(404); throw new Error('Pricing package not found') }

  await pkg.deleteOne()
  res.json({ success: true, message: 'Pricing package deleted' })
})

module.exports = { getPricing, getPricingById, createPricing, updatePricing, deletePricing }

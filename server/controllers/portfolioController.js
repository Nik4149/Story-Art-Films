const asyncHandler   = require('express-async-handler')
const cloudinary     = require('../config/cloudinary')
const Portfolio      = require('../models/Portfolio')

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Build a thumbnail URL from a Cloudinary full URL */
const toThumbnail = (url) =>
  url.replace('/upload/', '/upload/w_500,c_limit,q_auto,f_auto/')

/** Map a multer-cloudinary file to our image schema shape */
const fileToImage = (file) => ({
  url:          file.path,
  thumbnailUrl: toThumbnail(file.path),
  publicId:     file.filename,
  caption:      '',
})

// ── Controllers ────────────────────────────────────────────────────────────────

/**
 * @desc    Get all published portfolio items (public)
 * @route   GET /api/portfolio
 * @access  Public
 */
const getPortfolio = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 20, all } = req.query

  const filter = {}
  // Non-admin only sees published items
  if (!all) filter.isPublished = true
  if (category && category !== 'All') filter.category = category

  const total = await Portfolio.countDocuments(filter)
  const items = await Portfolio.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({
    success: true,
    count:   items.length,
    total,
    pages:   Math.ceil(total / Number(limit)),
    data:    items,
  })
})

/**
 * @desc    Get single portfolio item
 * @route   GET /api/portfolio/:id
 * @access  Public
 */
const getPortfolioById = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id)

  if (!item) {
    res.status(404)
    throw new Error('Portfolio item not found')
  }

  res.json({ success: true, data: item })
})

/**
 * @desc    Create portfolio item (with optional image uploads)
 * @route   POST /api/portfolio
 * @access  Private
 */
const createPortfolio = asyncHandler(async (req, res) => {
  const { title, category, description, location, date, order, isPublished } = req.body

  if (!title || !category) {
    res.status(400)
    throw new Error('Title and category are required')
  }

  const images = req.files?.length ? req.files.map(fileToImage) : []

  const item = await Portfolio.create({
    title,
    category,
    description: description || '',
    location:    location    || '',
    date:        date        || null,
    order:       Number(order || 0),
    isPublished: isPublished !== 'false',
    images,
  })

  res.status(201).json({
    success: true,
    data:    item,
    message: 'Portfolio item created',
  })
})

/**
 * @desc    Update portfolio item
 * @route   PUT /api/portfolio/:id
 * @access  Private
 */
const updatePortfolio = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id)

  if (!item) {
    res.status(404)
    throw new Error('Portfolio item not found')
  }

  const { title, category, description, location, date, order, isPublished, coverImage } = req.body

  if (title)                       item.title       = title
  if (category)                    item.category    = category
  if (description !== undefined)   item.description = description
  if (location    !== undefined)   item.location    = location
  if (date        !== undefined)   item.date        = date || null
  if (order       !== undefined)   item.order       = Number(order)
  if (isPublished !== undefined)   item.isPublished = isPublished !== 'false'
  if (coverImage  !== undefined)   item.coverImage  = Number(coverImage)

  // Append newly uploaded images
  if (req.files?.length) {
    item.images.push(...req.files.map(fileToImage))
  }

  const updated = await item.save()

  res.json({
    success: true,
    data:    updated,
    message: 'Portfolio item updated',
  })
})

/**
 * @desc    Delete portfolio item + all Cloudinary images
 * @route   DELETE /api/portfolio/:id
 * @access  Private
 */
const deletePortfolio = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id)

  if (!item) {
    res.status(404)
    throw new Error('Portfolio item not found')
  }

  // Remove images from Cloudinary
  const destroyPromises = item.images
    .filter((img) => img.publicId)
    .map((img) => cloudinary.uploader.destroy(img.publicId))

  await Promise.allSettled(destroyPromises)
  await item.deleteOne()

  res.json({ success: true, message: 'Portfolio item and all images deleted' })
})

/**
 * @desc    Delete a single image from a portfolio item
 * @route   DELETE /api/portfolio/:id/images/:publicId
 * @access  Private
 */
const deletePortfolioImage = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id)

  if (!item) {
    res.status(404)
    throw new Error('Portfolio item not found')
  }

  const publicId = decodeURIComponent(req.params.publicId)

  // Destroy in Cloudinary
  await cloudinary.uploader.destroy(publicId)

  // Remove from array
  item.images = item.images.filter((img) => img.publicId !== publicId)

  // Adjust cover index if needed
  if (item.coverImage >= item.images.length) {
    item.coverImage = 0
  }

  await item.save()

  res.json({ success: true, message: 'Image deleted', data: item })
})

module.exports = {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  deletePortfolioImage,
}

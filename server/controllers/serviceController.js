const asyncHandler = require('express-async-handler')
const Service      = require('../models/Service')

/**
 * @desc    Get all active services
 * @route   GET /api/services
 * @access  Public
 */
const getServices = asyncHandler(async (req, res) => {
  const { all } = req.query
  const filter  = all ? {} : { isActive: true }

  const services = await Service.find(filter).sort({ order: 1 })
  res.json({ success: true, count: services.length, data: services })
})

/**
 * @desc    Get single service
 * @route   GET /api/services/:id
 * @access  Private
 */
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) { res.status(404); throw new Error('Service not found') }
  res.json({ success: true, data: service })
})

/**
 * @desc    Create service
 * @route   POST /api/services
 * @access  Private
 */
const createService = asyncHandler(async (req, res) => {
  const { number, icon, title, description, isActive, order } = req.body

  if (!title || !description) {
    res.status(400)
    throw new Error('Title and description are required')
  }

  const service = await Service.create({
    number:   number   || '01',
    icon:     icon     || 'Camera',
    title,
    description,
    isActive: isActive !== false,
    order:    Number(order || 0),
  })

  res.status(201).json({ success: true, data: service, message: 'Service created' })
})

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private
 */
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) { res.status(404); throw new Error('Service not found') }

  const { number, icon, title, description, isActive, order } = req.body

  if (number      !== undefined) service.number      = number
  if (icon        !== undefined) service.icon        = icon
  if (title       !== undefined) service.title       = title
  if (description !== undefined) service.description = description
  if (isActive    !== undefined) service.isActive    = isActive
  if (order       !== undefined) service.order       = Number(order)

  const updated = await service.save()
  res.json({ success: true, data: updated, message: 'Service updated' })
})

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private
 */
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) { res.status(404); throw new Error('Service not found') }

  await service.deleteOne()
  res.json({ success: true, message: 'Service deleted' })
})

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
}

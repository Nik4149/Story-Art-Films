const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController')

router.route('/')
  .get(getServices)
  .post(protect, createService)

router.route('/:id')
  .get(protect, getServiceById)
  .put(protect, updateService)
  .delete(protect, deleteService)

module.exports = router

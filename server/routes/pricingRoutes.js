const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getPricing,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing,
} = require('../controllers/pricingController')

router.route('/')
  .get(getPricing)
  .post(protect, createPricing)

router.route('/:id')
  .get(protect, getPricingById)
  .put(protect, updatePricing)
  .delete(protect, deletePricing)

module.exports = router

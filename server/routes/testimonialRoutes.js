const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController')

// GET  /api/testimonials  — public (published only)
// POST /api/testimonials  — admin only
router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial)

// GET    /api/testimonials/:id  — admin
// PUT    /api/testimonials/:id  — admin
// DELETE /api/testimonials/:id  — admin
router.route('/:id')
  .get(protect, getTestimonialById)
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial)

module.exports = router

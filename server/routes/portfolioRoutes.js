const express  = require('express')
const router   = express.Router()
const { protect }                = require('../middleware/authMiddleware')
const { uploadPortfolioImages }  = require('../middleware/uploadMiddleware')
const {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  deletePortfolioImage,
} = require('../controllers/portfolioController')

// GET  /api/portfolio        — public (filtered to published)
// POST /api/portfolio        — admin only, accepts up to 10 image files
router.route('/')
  .get(getPortfolio)
  .post(protect, uploadPortfolioImages, createPortfolio)

// GET    /api/portfolio/:id  — public
// PUT    /api/portfolio/:id  — admin only, can add more images
// DELETE /api/portfolio/:id  — admin only
router.route('/:id')
  .get(getPortfolioById)
  .put(protect, uploadPortfolioImages, updatePortfolio)
  .delete(protect, deletePortfolio)

// DELETE /api/portfolio/:id/images/:publicId  — admin only
router.delete('/:id/images/:publicId', protect, deletePortfolioImage)

module.exports = router

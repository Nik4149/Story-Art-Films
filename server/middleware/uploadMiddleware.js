const multer                 = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary             = require('../config/cloudinary')

// ── Portfolio / general image storage ─────────────────────────────────────────
const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          'lumora/portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [
      { width: 1920, height: 1280, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' },
    ],
    public_id: `portfolio_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
})

// ── File filter — images only ──────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are accepted'), false)
  }
  cb(null, true)
}

// ── Exported middleware ────────────────────────────────────────────────────────

/** Upload up to 10 portfolio images at once */
const uploadPortfolioImages = multer({
  storage:    portfolioStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 15 * 1024 * 1024 }, // 15 MB per file
}).array('images', 10)

/** Upload a single image (e.g. profile, service icon) */
const uploadSingleImage = multer({
  storage:    portfolioStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('image')

/**
 * Wraps a multer middleware in a promise so async controllers can use
 * try/catch instead of the callback pattern.
 */
const runMiddleware = (middleware) => (req, res) =>
  new Promise((resolve, reject) => {
    middleware(req, res, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

module.exports = { uploadPortfolioImages, uploadSingleImage, runMiddleware }

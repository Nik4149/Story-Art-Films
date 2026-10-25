// ── Environment (reads root-level .env) ────────────────────────────────────────
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// ── Core imports ───────────────────────────────────────────────────────────────
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

// ── Config ─────────────────────────────────────────────────────────────────────
const connectDB = require('./config/db')
require('./config/cloudinary') // configure cloudinary on startup

// ── Route imports ──────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes')
const portfolioRoutes   = require('./routes/portfolioRoutes')
const bookingRoutes     = require('./routes/bookingRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes')
const serviceRoutes     = require('./routes/serviceRoutes')
const contactRoutes     = require('./routes/contactRoutes')
const pricingRoutes     = require('./routes/pricingRoutes')
const newsletterRoutes  = require('./routes/newsletterRoutes')

// ── Error middleware ───────────────────────────────────────────────────────────
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// ── Database ───────────────────────────────────────────────────────────────────
connectDB()

// ── App ────────────────────────────────────────────────────────────────────────
const app = express()

// ── CORS ───────────────────────────────────────────────────────────────────────
// In development the Vite proxy handles CORS (browser → port 5173 → port 5001).
// In production, allow only the configured frontend URL.
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL].filter(Boolean)
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
      ]

app.use(
  cors({
    origin(origin, cb) {
      // Allow requests with no Origin header (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: origin "${origin}" not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body parsers ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({
    success: true,
    message: 'Lumora Photography API is running',
    env:  process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  })
)

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/portfolio',    portfolioRoutes)
app.use('/api/bookings',     bookingRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/services',     serviceRoutes)
app.use('/api/contact',      contactRoutes)
app.use('/api/pricing',      pricingRoutes)
app.use('/api/newsletter',   newsletterRoutes)

// ── 404 + Error handler (must be LAST) ────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`\n🚀  Lumora API  →  http://localhost:${PORT}`)
  console.log(`🔗  Health      →  http://localhost:${PORT}/api/health`)
  console.log(`🌐  Frontend    →  http://localhost:5173\n`)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message)
  process.exit(1)
})

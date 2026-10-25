/**
 * 404 handler — catches unknown routes
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404)
  next(err)
}

/**
 * Global error handler — must be the LAST middleware registered.
 * Formats all errors into a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // If res.status was already set (e.g. from a controller), use it; else 500
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500

  // Mongoose: bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    err.message = `Resource not found — invalid id: ${err.value}`
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  // Mongoose: validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    err.message = 'Invalid token'
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    err.message = 'Token has expired'
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }

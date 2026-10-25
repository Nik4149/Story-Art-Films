const jwt = require('jsonwebtoken')

/**
 * Generate a signed JWT for the given admin id.
 * @param {string} id - MongoDB ObjectId of the Admin document
 * @returns {string} Signed JWT string
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

module.exports = generateToken

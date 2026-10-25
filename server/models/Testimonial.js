const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    quote: {
      type:     String,
      required: [true, 'Quote is required'],
      trim:     true,
    },
    name: {
      type:     String,
      required: [true, 'Client name is required'],
      trim:     true,
    },
    role: {
      type:     String,
      required: [true, 'Role/context is required'],
      trim:     true,
    },
    rating: {
      type:    Number,
      min:     1,
      max:     5,
      default: 5,
    },
    isPublished: {
      type:    Boolean,
      default: true,
    },
    order: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)

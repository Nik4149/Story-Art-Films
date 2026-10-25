const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  url:          { type: String, required: true },
  thumbnailUrl: { type: String },
  publicId:     { type: String, required: true },
  caption:      { type: String, default: '' },
})

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     ['Wedding', 'Portrait', 'Fashion', 'Events', 'Travel', 'Commercial'],
    },
    description: {
      type:    String,
      default: '',
    },
    location: {
      type:    String,
      default: '',
    },
    date: {
      type: Date,
    },
    images: [imageSchema],
    coverImage: {
      // Index of images[] to use as cover, or first image by default
      type:    Number,
      default: 0,
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

// Text index for search
portfolioSchema.index({ title: 'text', description: 'text', location: 'text' })

module.exports = mongoose.model('Portfolio', portfolioSchema)

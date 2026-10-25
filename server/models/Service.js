const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    number: {
      type:     String,
      required: [true, 'Service number is required'],
      trim:     true,
    },
    icon: {
      type:    String,
      default: 'Camera',
    },
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
      trim:     true,
    },
    isActive: {
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

module.exports = mongoose.model('Service', serviceSchema)

const mongoose = require('mongoose')

const pricingSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Package name is required'],
      trim:     true,
    },
    tagline: {
      type:    String,
      default: '',
      trim:    true,
    },
    price: {
      type:     String,
      required: [true, 'Price is required'],
      trim:     true,
    },
    duration: {
      type:    String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type:    Boolean,
      default: false,
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

module.exports = mongoose.model('Pricing', pricingSchema)

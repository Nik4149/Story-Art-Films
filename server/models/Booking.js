const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,
      match:    [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
    },
    type: {
      type:     String,
      required: [true, 'Photography type is required'],
      enum: [
        'Wedding Photography',
        'Portrait Photography',
        'Fashion Photography',
        'Event Photography',
        'Commercial Photography',
        'Travel Photography',
      ],
    },
    date: {
      type:     Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type:    String,
      default: '',
      trim:    true,
    },
    hours: {
      type:    String,
      default: '',
    },
    budget: {
      type:    String,
      default: '',
    },
    message: {
      type:     String,
      required: [true, 'Message is required'],
      trim:     true,
    },
    status: {
      type:    String,
      enum:    ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    adminNotes: {
      type:    String,
      default: '',
    },
    emailSent: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

bookingSchema.index({ status: 1, createdAt: -1 })
bookingSchema.index({ email: 1 })

module.exports = mongoose.model('Booking', bookingSchema)

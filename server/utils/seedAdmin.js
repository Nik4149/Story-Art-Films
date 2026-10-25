/**
 * Create the first admin account.
 * Run once from the project root:  npm run seed:admin
 *
 * Configure credentials in .env:
 *   ADMIN_NAME, ADMIN_EMAIL_SEED, ADMIN_PASSWORD
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

const mongoose = require('mongoose')
const Admin    = require('../models/Admin')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅  Connected to MongoDB')

    const count = await Admin.countDocuments()
    if (count > 0) {
      console.log('⚠️   Admin already exists. Aborting — use /api/auth/login instead.')
      process.exit(0)
    }

    const admin = await Admin.create({
      name:     process.env.ADMIN_NAME        || 'Alex Lumora',
      email:    process.env.ADMIN_EMAIL_SEED  || 'admin@lumoraphotography.com',
      password: process.env.ADMIN_PASSWORD    || 'ChangeMe@2026',
    })

    console.log(`\n✅  Admin created!`)
    console.log(`    Email   : ${admin.email}`)
    console.log(`    Password: ${process.env.ADMIN_PASSWORD || 'ChangeMe@2026'}`)
    console.log(`\n⚠️   Change your password immediately after first login.\n`)
    process.exit(0)
  } catch (err) {
    console.error('❌  Seed error:', err.message)
    process.exit(1)
  }
}

seed()

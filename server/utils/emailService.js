const nodemailer = require('nodemailer')

// ── Transporter ────────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

// ── Shared brand styles ────────────────────────────────────────────────────────
const brandStyles = `
  body { margin:0; padding:0; background:#f5f3ef; font-family: Georgia, serif; }
  .wrapper { max-width:580px; margin:0 auto; background:#ffffff; }
  .header  { background:#0a0908; padding:32px 40px; }
  .logo    { color:#c9a96e; font-size:22px; letter-spacing:0.35em; font-weight:300; margin:0; }
  .body    { padding:40px; }
  .title   { font-size:22px; color:#0a0908; font-weight:300; margin:0 0 20px; }
  .label   { font-size:11px; color:#7a766f; letter-spacing:0.15em; text-transform:uppercase; margin:20px 0 6px; }
  .value   { font-size:15px; color:#0a0908; margin:0 0 4px; }
  .divider { height:1px; background:#e8e4dc; margin:28px 0; }
  .badge   { display:inline-block; background:#c9a96e; color:#0a0908; padding:6px 16px; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; }
  .footer  { background:#0a0908; padding:24px 40px; text-align:center; }
  .footer p{ color:#7a766f; font-size:12px; margin:0; font-family:Arial,sans-serif; }
`

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>${brandStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><p class="logo">LUMORA</p></div>
    <div class="body">${content}</div>
    <div class="footer"><p>© 2026 Lumora Photography · Pune, India · hello@lumoraphotography.com</p></div>
  </div>
</body>
</html>`

// ── Templates ──────────────────────────────────────────────────────────────────

/** Email sent to ADMIN when a new booking arrives */
const adminBookingTemplate = (b) => emailWrapper(`
  <h2 class="title">New Booking Request</h2>
  <span class="badge">${b.status || 'Pending'}</span>
  <div class="divider"></div>

  <p class="label">Client</p>
  <p class="value">${b.name}</p>

  <p class="label">Email</p>
  <p class="value"><a href="mailto:${b.email}" style="color:#c9a96e">${b.email}</a></p>

  <p class="label">Phone</p>
  <p class="value">${b.phone}</p>

  <div class="divider"></div>

  <p class="label">Photography Type</p>
  <p class="value">${b.type}</p>

  <p class="label">Event Date</p>
  <p class="value">${new Date(b.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>

  <p class="label">Location</p>
  <p class="value">${b.location || '—'}</p>

  <p class="label">Hours Requested</p>
  <p class="value">${b.hours || '—'}</p>

  <p class="label">Budget</p>
  <p class="value">${b.budget || '—'}</p>

  <div class="divider"></div>

  <p class="label">Message</p>
  <p class="value" style="line-height:1.7">${b.message}</p>
`)

/** Confirmation email sent to the CUSTOMER */
const customerBookingTemplate = (b) => emailWrapper(`
  <h2 class="title">We've received your request.</h2>
  <p style="color:#7a766f;font-size:15px;line-height:1.7;margin:0 0 28px">
    Thank you, ${b.name.split(' ')[0]}. Your booking request has been received and we'll be in touch 
    within 24 hours to discuss the details of your session.
  </p>
  <div class="divider"></div>

  <p class="label">Your Request Summary</p>
  <p class="value">${b.type}</p>
  <p style="color:#7a766f;font-size:13px;margin:4px 0 0">
    ${new Date(b.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
    ${b.location ? ' · ' + b.location : ''}
  </p>

  <div class="divider"></div>
  <p style="color:#7a766f;font-size:13px;line-height:1.7;margin:0">
    If you have any immediate questions, you can reach us at
    <a href="mailto:hello@lumoraphotography.com" style="color:#c9a96e">hello@lumoraphotography.com</a>
    or call <a href="tel:+919876543210" style="color:#c9a96e">+91 98765 43210</a>.
  </p>
  <br/>
  <p style="color:#0a0908;font-size:14px;font-style:italic;margin:0">
    Stories are everywhere. We simply help you remember them.
  </p>
`)

/** Admin notification for new contact message */
const adminContactTemplate = (c) => emailWrapper(`
  <h2 class="title">New Contact Message</h2>
  <div class="divider"></div>

  <p class="label">From</p>
  <p class="value">${c.name}</p>

  <p class="label">Email</p>
  <p class="value"><a href="mailto:${c.email}" style="color:#c9a96e">${c.email}</a></p>

  ${c.phone ? `<p class="label">Phone</p><p class="value">${c.phone}</p>` : ''}

  <div class="divider"></div>

  <p class="label">Message</p>
  <p class="value" style="line-height:1.7">${c.message}</p>
`)

// ── Send helpers ───────────────────────────────────────────────────────────────

/**
 * Send booking notification to admin + confirmation to customer.
 * Non-throwing: logs error but does not crash the request.
 */
const sendBookingEmails = async (booking) => {
  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from:    `"Lumora Photography" <${process.env.EMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `📸 New Booking — ${booking.name} (${booking.type})`,
      html:    adminBookingTemplate(booking),
    })

    await transporter.sendMail({
      from:    `"Lumora Photography" <${process.env.EMAIL_USER}>`,
      to:      booking.email,
      subject: 'Your Booking Request — Lumora Photography',
      html:    customerBookingTemplate(booking),
    })

    return true
  } catch (err) {
    console.error('📧  Email send failed:', err.message)
    return false
  }
}

/**
 * Send contact message notification to admin.
 */
const sendContactEmail = async (contact) => {
  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from:    `"Lumora Photography" <${process.env.EMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `💬 New Message — ${contact.name}`,
      html:    adminContactTemplate(contact),
    })

    return true
  } catch (err) {
    console.error('📧  Email send failed:', err.message)
    return false
  }
}

module.exports = { sendBookingEmails, sendContactEmail }

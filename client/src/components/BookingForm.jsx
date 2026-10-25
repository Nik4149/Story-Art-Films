import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

const INITIAL = {
  name: '', email: '', phone: '',
  type: '', date: '', location: '',
  hours: '', budget: '', message: '',
}

function validate(form) {
  const e = {}
  if (!form.name.trim())                               e.name    = 'Your name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email   = 'A valid email is required'
  if (!form.phone.trim())                              e.phone   = 'Phone number is required'
  if (!form.type)                                      e.type    = 'Please select a photography type'
  if (!form.date)                                      e.date    = 'Event date is required'
  if (!form.message.trim())                            e.message = 'Tell us a little about your session'
  return e
}

const fieldClass = (err) =>
  `w-full bg-transparent border-b py-3 text-sm text-primary outline-none
   placeholder:text-muted transition-colors duration-200
   focus:border-primary ${err ? 'border-red-400' : 'border-primary/20'}`

export default function BookingForm() {
  const [form, setForm]           = useState(INITIAL)
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [apiError, setApiError]   = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name])  setErrors(p => ({ ...p, [name]: '' }))
    if (apiError)      setApiError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')

    try {
      const res  = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        setForm(INITIAL)
        setErrors({})
      } else {
        setApiError(data.message || 'Something went wrong. Please try again.')
      }
    } catch (_err) {
      setApiError('Network error — please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="bg-warm py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">Let's Begin</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-primary font-light">
            Book a Session
          </h2>
          <p className="text-muted text-sm mt-3 max-w-sm">
            Fill in the details below and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg py-16 text-center"
            >
              <CheckCircle2 size={48} className="text-accent mx-auto mb-6" strokeWidth={1.2} />
              <h3 className="font-display text-3xl text-primary font-light mb-4">Thank You!</h3>
              <p className="text-muted text-sm leading-relaxed mb-8">
                Your booking request has been received. We'll review your details and get back to
                you within 24 hours. Check your email for a confirmation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-3 text-primary text-xs tracking-widest uppercase group"
              >
                <span>Submit Another Request</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-8">

                <div>
                  <input type="text" name="name" value={form.name} onChange={onChange}
                    placeholder="Full Name *" className={fieldClass(errors.name)} />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <input type="email" name="email" value={form.email} onChange={onChange}
                    placeholder="Email Address *" className={fieldClass(errors.email)} />
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                </div>

                <div>
                  <input type="tel" name="phone" value={form.phone} onChange={onChange}
                    placeholder="Phone Number *" className={fieldClass(errors.phone)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                <div>
                  <select name="type" value={form.type} onChange={onChange}
                    className={fieldClass(errors.type) + ' cursor-pointer bg-warm'}>
                    <option value="" disabled>Photography Type *</option>
                    <option>Wedding Photography</option>
                    <option>Portrait Photography</option>
                    <option>Fashion Photography</option>
                    <option>Event Photography</option>
                    <option>Commercial Photography</option>
                    <option>Travel Photography</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1.5">{errors.type}</p>}
                </div>

                <div>
                  <input type="date" name="date" value={form.date} onChange={onChange}
                    className={fieldClass(errors.date)} />
                  {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date}</p>}
                </div>

                <div>
                  <input type="text" name="location" value={form.location} onChange={onChange}
                    placeholder="Event Location" className={fieldClass()} />
                </div>

                <div>
                  <select name="hours" value={form.hours} onChange={onChange}
                    className={fieldClass() + ' cursor-pointer bg-warm'}>
                    <option value="" disabled>Number of Hours</option>
                    <option>2 Hours</option>
                    <option>4 Hours</option>
                    <option>5 Hours</option>
                    <option>Full Day (8+ Hours)</option>
                    <option>Multi-Day</option>
                  </select>
                </div>

                <div>
                  <select name="budget" value={form.budget} onChange={onChange}
                    className={fieldClass() + ' cursor-pointer bg-warm'}>
                    <option value="" disabled>Budget Range</option>
                    <option>Under ₹15,000</option>
                    <option>₹15,000 – ₹30,000</option>
                    <option>₹30,000 – ₹55,000</option>
                    <option>₹55,000+</option>
                    <option>Let's Discuss</option>
                  </select>
                </div>
              </div>

              <div className="mb-10">
                <textarea name="message" value={form.message} onChange={onChange}
                  placeholder="Tell us about your story... *" rows={4}
                  className={fieldClass(errors.message) + ' resize-none'} />
                {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
              </div>

              {/* API-level error */}
              {apiError && (
                <p className="text-red-500 text-sm mb-6 bg-red-50 border border-red-200 px-4 py-3">
                  {apiError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-4 px-12 py-4 bg-primary text-white text-xs tracking-widest uppercase hover:bg-canvas transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Request a Booking
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

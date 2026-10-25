import { useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Linkedin, Youtube, ArrowRight, Loader2 } from 'lucide-react'

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const navLinks = [
  { label: 'Home',         id: 'home' },
  { label: 'Portfolio',    id: 'portfolio' },
  { label: 'Services',     id: 'services' },
  { label: 'About',        id: 'about' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact',      id: 'contact' },
]

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
  { Icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  { Icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube' },
]

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Please enter a valid email.'); return }

    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setSubscribed(true)
        setEmail('')
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch (_err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-primary border-t border-white/[0.04]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-20 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <button
              onClick={() => scrollTo('home')}
              className="font-display text-3xl tracking-[0.35em] text-light font-light mb-5 block"
            >
              LUMORA
            </button>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-[200px]">
              Capturing life's most precious chapters with artistry and timeless care.
            </p>
            <div className="flex gap-4">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} className="text-muted hover:text-accent transition-colors duration-300">
                  <Icon size={17} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-light text-[10px] tracking-widest uppercase mb-6">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map(({ label, id }) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)}
                    className="text-muted text-sm hover:text-accent transition-colors duration-300">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-light text-[10px] tracking-widest uppercase mb-6">Contact</p>
            <div className="space-y-3 text-muted text-sm">
              <p>hello@lumoraphotography.com</p>
              <p>+91 98765 43210</p>
              <p>Pune, Maharashtra</p>
              <p>India</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-light text-[10px] tracking-widest uppercase mb-6">Stay Inspired</p>
            <p className="text-muted text-sm leading-relaxed mb-5">
              Occasional updates, new stories & photography inspiration.
            </p>

            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent text-sm"
              >
                Thank you for subscribing!
              </motion.p>
            ) : (
              <>
                <form
                  onSubmit={handleSubscribe}
                  className="flex border-b border-white/15 focus-within:border-accent transition-colors duration-300"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="Your email address"
                    className="flex-1 bg-transparent text-light text-sm py-2 outline-none placeholder:text-muted/50"
                  />
                  <button type="submit" disabled={loading} aria-label="Subscribe"
                    className="text-muted hover:text-accent transition-colors pl-3 py-2 disabled:opacity-50">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={15} />}
                  </button>
                </form>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © 2026 Lumora Photography. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted text-xs hover:text-accent transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-muted text-xs hover:text-accent transition-colors duration-300">Terms & Conditions</a>
            <a href="/admin/login" className="text-muted text-xs hover:text-accent transition-colors duration-300">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

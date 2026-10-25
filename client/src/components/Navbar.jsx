import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',         href: 'home' },
  { label: 'Portfolio',    href: 'portfolio' },
  { label: 'Services',     href: 'services' },
  { label: 'About',        href: 'about' },
  { label: 'Testimonials', href: 'testimonials' },
  { label: 'Contact',      href: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 70)

      // Active section tracker
      const ids = navLinks.map(l => l.href)
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(ids[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const isDark = !scrolled

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">

        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className={`font-display text-2xl tracking-[0.35em] font-light transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-primary'
          }`}
        >
          LUMORA
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className={`relative text-xs tracking-widest uppercase font-light transition-colors duration-300 py-1 group ${
                isDark ? 'text-white/75 hover:text-white' : 'text-muted hover:text-primary'
              } ${active === href ? (isDark ? '!text-white' : '!text-primary') : ''}`}
            >
              {label}
              <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                active === href ? 'w-full bg-accent' : 'w-0 group-hover:w-full bg-accent'
              }`} />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('booking')}
          className={`hidden lg:block px-6 py-2.5 text-xs tracking-widest uppercase font-light border transition-all duration-300 ${
            isDark
              ? 'border-white/50 text-white hover:bg-white hover:text-primary'
              : 'border-primary/40 text-primary hover:bg-primary hover:text-white'
          }`}
        >
          Book a Session
        </button>

        {/* Hamburger */}
        <button
          className={`lg:hidden p-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-primary'}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden bg-white border-t border-neutral-100"
          >
            <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-1">
              {navLinks.map(({ label, href }, i) => (
                <motion.button
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(href)}
                  className={`text-left py-3 text-sm tracking-wider font-light border-b border-neutral-50 transition-colors ${
                    active === href ? 'text-accent' : 'text-primary hover:text-accent'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
              <button
                onClick={() => scrollTo('booking')}
                className="mt-4 py-3 bg-primary text-white text-xs tracking-widest uppercase text-center"
              >
                Book a Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imgY   = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fadeOp = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-screen min-h-[640px] flex items-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
        <motion.img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85"
          alt="Lumora Photography — capturing timeless wedding moments"
          className="w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'linear' }}
        />
      </motion.div>

      {/* Layered overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: fadeOp }}
        className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 w-full"
      >
        <motion.p
          className="text-white/50 text-[10px] tracking-mega uppercase mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Est. 2012 · Pune, India
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(3.2rem,8vw,7.5rem)] text-white font-light leading-[0.92] tracking-wide uppercase mb-10 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Capturing<br />
          Moments That<br />
          <em className="not-italic text-accent font-light">Last Forever.</em>
        </motion.h1>

        <motion.p
          className="text-white/65 text-base md:text-lg font-light leading-relaxed max-w-sm mb-10 tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Photography crafted with emotion, creativity, and an eye for unforgettable moments.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => scrollTo('portfolio')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary text-xs tracking-widest uppercase font-medium hover:bg-accent transition-colors duration-300"
          >
            Explore Portfolio
          </button>
          <button
            onClick={() => scrollTo('booking')}
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/40 text-white text-xs tracking-widest uppercase font-light hover:border-white/80 hover:bg-white/8 transition-all duration-300"
          >
            Book a Session
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ opacity: fadeOp }}
      >
        <span className="text-[9px] tracking-mega uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      {/* Thin accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-accent"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2.5, delay: 1.5, ease: 'easeOut' }}
      />
    </section>
  )
}

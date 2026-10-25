import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { testimonials as fallbackTestimonials } from '../data/testimonialsData'

export default function Testimonials() {
  const [items, setItems] = useState(fallbackTestimonials)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()

        if (data.success && Array.isArray(data.data) && data.data.length) {
          setItems(data.data)
        }
      } catch {
        setItems(fallbackTestimonials)
      }
    }

    loadTestimonials()
  }, [])

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }
  const goNext = () => goTo((current + 1) % items.length)
  const goPrev = () => goTo((current - 1 + items.length) % items.length)

  useEffect(() => {
    if (!items.length) return
    const t = setInterval(goNext, 6000)
    return () => clearInterval(t)
  }, [current, items.length])

  const currentItem = items[current] || fallbackTestimonials[0]

  const variants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  }

  return (
    <section id="testimonials" className="bg-secondary py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">Kind Words</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-light font-light">
            Client Stories
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-center">
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                alt="Lumora Photography testimonials"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/40 to-transparent" />
            </div>
          </motion.div>

          <div>
            <p className="font-display text-[8rem] text-accent/10 leading-none -mb-6 select-none">"</p>

            <div className="relative min-h-[220px] flex flex-col justify-center">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentItem?._id || currentItem?.name || current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex gap-1 mb-7">
                    {Array.from({ length: currentItem.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>

                  <blockquote className="font-display text-[clamp(1.2rem,2.5vw,1.7rem)] text-light/85 font-light italic leading-relaxed mb-8">
                    "{currentItem.quote}"
                  </blockquote>

                  <div>
                    <p className="text-light text-sm font-medium tracking-wide">{currentItem.name}</p>
                    <p className="text-muted text-xs tracking-widest uppercase mt-1">{currentItem.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-6 mt-12">
              <button onClick={goPrev} aria-label="Previous" className="text-white/30 hover:text-white transition-colors p-1">
                <ChevronLeft size={22} />
              </button>

              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`rounded-full transition-all duration-400 ${
                      i === current ? 'w-6 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button onClick={goNext} aria-label="Next" className="text-white/30 hover:text-white transition-colors p-1">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

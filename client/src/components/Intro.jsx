import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { end: 12,  suffix: '+', label: 'Years of Experience' },
  { end: 850, suffix: '+', label: 'Sessions Completed' },
  { end: 120, suffix: '+', label: 'Weddings Captured' },
  { end: 25,  suffix: '+', label: 'Photography Awards' },
]

function Counter({ end, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    let raf
    const duration = 1800
    const start = Date.now()
    const tick = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const ease = [0.22, 1, 0.36, 1]

export default function Intro() {
  return (
    <section id="intro" className="bg-light py-24 lg:py-36">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease }}
          >
            <p className="text-accent text-[10px] tracking-ultra uppercase mb-5">The Art of Storytelling</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-primary font-light leading-tight mb-7">
              Every photograph holds a story.<br />
              <span className="italic">We make yours unforgettable.</span>
            </h2>
            <p className="text-muted leading-relaxed mb-5 max-w-md text-sm">
              At Lumora, we believe every moment carries a universe of emotion waiting to be preserved. 
              With over a decade of experience across weddings, portraits, fashion, and documentary work, 
              we craft images that transcend time.
            </p>
            <p className="text-muted leading-relaxed mb-10 max-w-md text-sm">
              Our approach is intimate and unhurried — we get to know you first, because the best 
              photographs come from genuine connection.
            </p>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-4 text-primary text-xs tracking-widest uppercase group"
            >
              <span>Discover Our Story</span>
              <span className="h-px w-10 bg-primary transition-all duration-300 group-hover:w-20" />
            </button>
          </motion.div>

          {/* Stats side */}
          <motion.div
            className="grid grid-cols-2 gap-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.15, ease }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`p-10 flex flex-col justify-center ${
                  i % 2 === 0 ? 'border-r border-primary/8' : ''
                } ${
                  i < 2 ? 'border-b border-primary/8' : ''
                }`}
              >
                <p className="font-display text-[clamp(2.8rem,5vw,4rem)] text-primary font-light leading-none mb-2">
                  <Counter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-muted text-[10px] tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

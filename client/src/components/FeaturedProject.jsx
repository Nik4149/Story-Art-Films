import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Camera } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const details = [
  { Icon: MapPin,   text: 'Tuscany, Italy' },
  { Icon: Calendar, text: 'September 2024' },
  { Icon: Camera,   text: 'Wedding · 600+ photographs' },
]

export default function FeaturedProject() {
  return (
    <section id="featured" className="bg-secondary overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">

          {/* Image */}
          <motion.div
            className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[640px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease }}
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt="The wedding of Emma & James — Lumora Photography"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
            {/* Subtle gradient towards the content panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/30 pointer-events-none" />

            {/* Floating label */}
            <div className="absolute top-8 left-8">
              <p className="inline-block bg-black/40 backdrop-blur-sm text-white/70 text-[9px] tracking-ultra uppercase px-4 py-2">
                Featured Story
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex flex-col justify-center px-10 py-16 lg:px-14 lg:py-20 bg-canvas"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
          >
            <p className="text-accent text-[10px] tracking-ultra uppercase mb-6">2024 — Favourite Work</p>

            <h2 className="font-display text-[clamp(1.9rem,3.5vw,3rem)] text-light font-light leading-tight mb-6">
              The Wedding of<br />
              <span className="italic text-accent">Emma & James</span>
            </h2>

            <p className="text-muted-light text-sm leading-relaxed mb-8">
              A love story captured across the golden vineyards of Tuscany. 
              We spent three days documenting their world — from quiet morning 
              rituals to the last dance under an Italian sky. Every frame was an act of trust.
            </p>

            <div className="space-y-3.5 mb-10">
              {details.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-muted-light text-sm">
                  <Icon size={13} className="text-accent flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Horizontal divider */}
            <div className="h-px bg-white/6 mb-10" />

            <button className="flex items-center gap-3 text-white text-xs tracking-widest uppercase group w-fit hover:text-accent transition-colors duration-300">
              <span>View Full Story</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

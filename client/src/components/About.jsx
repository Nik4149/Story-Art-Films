import { motion } from 'framer-motion'
import { MapPin, Award } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const badges = [
  { label: 'Wedding', value: 'Specialist' },
  { label: 'Available', value: 'Worldwide' },
  { label: 'Based in', value: 'Pune, India' },
]

export default function About() {
  return (
    <section id="about" className="bg-primary py-24 lg:py-32 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <motion.p
          className="text-accent text-[10px] tracking-ultra uppercase mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Behind the Lens
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Portrait */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=85"
                alt="Alex — photographer and visual storyteller at Lumora"
                className="w-full h-full object-cover"
              />
              {/* Subtle warm tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating accent card */}
            <motion.div
              className="absolute -bottom-6 -right-4 lg:-right-8 bg-accent px-8 py-7"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
            >
              <p className="font-display text-4xl text-primary font-light leading-none">12+</p>
              <p className="text-primary/65 text-[10px] tracking-widest uppercase mt-1">Years of Art</p>
            </motion.div>

            {/* Award badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2">
              <Award size={13} className="text-accent" />
              <span className="text-white/70 text-[9px] tracking-widest uppercase">25+ Awards</span>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            className="lg:pt-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
          >
            <h2 className="font-display text-[clamp(1.9rem,3.5vw,3rem)] text-light font-light leading-tight mb-6">
              Hi, I'm Alex —<br />
              <span className="italic text-accent">Photographer & Visual Storyteller.</span>
            </h2>

            <p className="text-muted-light text-sm leading-relaxed mb-5">
              Born with an eye for the extraordinary in everyday moments, I've spent over 12 years 
              documenting life's most significant chapters. From intimate elopements in rural Rajasthan 
              to editorial fashion campaigns in Mumbai's vibrant streets — each frame is a conversation.
            </p>

            <p className="text-muted-light text-sm leading-relaxed mb-8">
              My philosophy is rooted in trust. I believe the best photographs emerge when people 
              forget the camera is there. I create that space — patient, present, and entirely focused 
              on what's unfolding in front of me.
            </p>

            {/* Location line */}
            <div className="flex items-center gap-2.5 text-muted-light text-sm mb-10">
              <MapPin size={13} className="text-accent flex-shrink-0" />
              <span>Based in Pune · Available across India & internationally</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {badges.map(b => (
                <div key={b.label} className="px-4 py-2 border border-white/10 text-[10px] tracking-wider">
                  <span className="text-muted-light">{b.label}  </span>
                  <span className="text-white/80">{b.value}</span>
                </div>
              ))}
            </div>

            {/* Signature quote */}
            <blockquote className="border-l-2 border-accent pl-6 mb-10">
              <p className="font-display text-xl text-light/75 font-light italic leading-relaxed">
                "Stories are everywhere.<br />
                I simply help you remember them."
              </p>
            </blockquote>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 border border-white/25 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-primary transition-all duration-300"
            >
              More About Me
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

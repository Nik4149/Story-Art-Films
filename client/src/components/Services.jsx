import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, Camera, Aperture, Sparkles, Briefcase, Globe } from 'lucide-react'
import { services as fallbackServices } from '../data/servicesData'

const iconMap = { Heart, Camera, Aperture, Sparkles, Briefcase, Globe }

export default function Services() {
  const [services, setServices] = useState(fallbackServices)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()

        if (data.success && Array.isArray(data.data) && data.data.length) {
          setServices(data.data)
        }
      } catch {
        setServices(fallbackServices)
      }
    }

    loadServices()
  }, [])

  return (
    <section id="services" className="bg-light py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">What We Offer</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-primary font-light">
            Our Services
          </h2>
        </motion.div>

        {/* Cards grid — thin border between cells */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 md:divide-x divide-primary/8 border border-primary/8">
          {services.map((svc, i) => {
            const Icon = iconMap[svc.icon] || Camera
            return (
              <motion.div
                key={svc._id || svc.id || `${svc.title}-${i}`}
                className="group relative p-10 flex flex-col bg-light hover:bg-primary transition-colors duration-500 overflow-hidden cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: i * 0.08 }}
              >
                {/* Number watermark */}
                <span className="absolute top-6 right-6 font-display text-7xl text-primary/5 group-hover:text-white/5 font-light leading-none select-none transition-colors duration-500">
                  {svc.number || String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="mb-7 text-primary group-hover:text-accent transition-colors duration-500 w-fit">
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl text-primary group-hover:text-white transition-colors duration-500 font-light leading-tight mb-3">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-muted group-hover:text-white/55 transition-colors duration-500 text-sm leading-relaxed flex-1 mb-8">
                  {svc.description}
                </p>

                {/* Link */}
                <button className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-primary/40 group-hover:text-accent transition-colors duration-500 w-fit">
                  <span>Learn More</span>
                  <ArrowUpRight size={13} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

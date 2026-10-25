import { motion } from 'framer-motion'
import { MessageCircle, FileText, Camera, Package } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Connect',
    Icon: MessageCircle,
    description: 'We start with a relaxed conversation to understand your vision, personality, and what matters most to you.',
  },
  {
    number: '02',
    title: 'Plan',
    Icon: FileText,
    description: 'We carefully plan every detail — locations, timing, and style — so your session feels effortless and natural.',
  },
  {
    number: '03',
    title: 'Create',
    Icon: Camera,
    description: 'We capture authentic moments using creative direction, natural storytelling, and a deep respect for the moment.',
  },
  {
    number: '04',
    title: 'Deliver',
    Icon: Package,
    description: 'You receive professionally edited, timeless photographs in a private online gallery within three weeks.',
  },
]

export default function Process() {
  return (
    <section id="process" className="bg-warm py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">How We Work</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-primary font-light">
            Our Process
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-primary/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                {/* Mobile connector line */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-[15px] top-[60px] w-px h-10 bg-primary/15" />
                )}

                {/* Icon circle */}
                <div className="relative z-10 w-[30px] h-[30px] rounded-full bg-primary flex items-center justify-center mb-8 ring-4 ring-warm">
                  <step.Icon size={13} className="text-accent" />
                </div>

                {/* Number */}
                <p className="font-display text-xs text-accent tracking-widest uppercase mb-3">{step.number}</p>

                {/* Title */}
                <h3 className="font-display text-2xl text-primary font-light mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

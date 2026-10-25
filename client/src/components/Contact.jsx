import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'

const contacts = [
  { Icon: Mail,   label: 'Email',    value: 'hello@lumoraphotography.com', href: 'mailto:hello@lumoraphotography.com' },
  { Icon: Phone,  label: 'Phone',    value: '+91 98765 43210',             href: 'tel:+919876543210' },
  { Icon: MapPin, label: 'Location', value: 'Pune, Maharashtra, India',    href: '#' },
]

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
  { Icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  { Icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube' },
]

const ease = [0.22, 1, 0.36, 1]

export default function Contact() {
  return (
    <section id="contact" className="bg-secondary py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            <p className="text-accent text-[10px] tracking-ultra uppercase mb-6">Get in Touch</p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] text-light font-light leading-tight mb-8">
              Let's Create<br />
              <span className="italic text-accent">Something Beautiful.</span>
            </h2>

            <p className="text-muted-light text-sm leading-relaxed mb-10 max-w-sm">
              Whether you have a date in mind or just an idea, we'd love to hear from you. 
              Every great photograph starts with a conversation.
            </p>

            {/* Social links */}
            <div>
              <p className="text-muted text-[10px] tracking-widest uppercase mb-4">Follow Along</p>
              <div className="flex gap-5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-muted-light hover:text-accent transition-colors duration-300 p-1"
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — contact cards + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease }}
          >
            <div className="space-y-4 mb-12">
              {contacts.map(({ Icon, label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-5 p-6 border border-white/6 hover:border-accent/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 border border-white/10 group-hover:border-accent/40 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-muted text-[9px] tracking-widest uppercase mb-0.5">{label}</p>
                    <p className="text-light text-sm">{value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.a
              href="mailto:hello@lumoraphotography.com"
              className="inline-flex items-center gap-4 px-10 py-4 border border-accent text-accent text-xs tracking-widest uppercase hover:bg-accent hover:text-primary transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Start a Conversation
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

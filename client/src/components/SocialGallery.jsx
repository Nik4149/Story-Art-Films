import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const images = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=75', alt: 'Wedding first dance' },
  { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=75', alt: 'Portrait photography' },
  { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=75', alt: 'Fashion editorial' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=75', alt: 'Bride portrait' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=75', alt: 'Landscape travel' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=75', alt: 'Concert event' },
  { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=75', alt: 'Commercial photography' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=75', alt: 'Timeless portrait' },
  { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=75', alt: 'Travel waterfall' },
]

export default function SocialGallery() {
  return (
    <section id="gallery" className="bg-light py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <div>
            <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">Stay Connected</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-primary font-light">
              Follow the Journey
            </h2>
            <p className="text-muted text-sm mt-3 max-w-xs">
              Behind the scenes, recent stories, and everyday inspiration.
            </p>
          </div>

          <a
            href="https://instagram.com/lumoraphotography"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-xs tracking-widest uppercase text-primary border border-primary/25 px-6 py-3 hover:bg-primary hover:text-white transition-all duration-300 self-start sm:self-auto"
          >
            <Instagram size={14} />
            @lumoraphotography
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {images.map((img, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/lumoraphotography"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden aspect-square bg-warm block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-400 flex items-center justify-center">
                <Instagram
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

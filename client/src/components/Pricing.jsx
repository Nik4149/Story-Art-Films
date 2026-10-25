import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const fallbackPackages = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Perfect for intimate sessions',
    price: '₹15,000',
    duration: '2 Hours',
    features: [
      '2 Hours Coverage',
      '100 Edited Photographs',
      'Private Online Gallery',
      '1 Photographer',
      '2-Week Turnaround',
    ],
    popular: false,
  },
  {
    id: 'signature',
    name: 'Signature',
    tagline: 'Our most loved package',
    price: '₹30,000',
    duration: '5 Hours',
    features: [
      '5 Hours Coverage',
      '300 Edited Photographs',
      'Private Online Gallery',
      '2 Photographers',
      'Premium Lay-Flat Album',
      '3-Week Turnaround',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'The complete experience',
    price: '₹55,000',
    duration: 'Full Day',
    features: [
      'Full Day Coverage',
      '600+ Edited Photographs',
      'Private Online Gallery',
      '2 Photographers',
      'Premium Lay-Flat Album',
      'Cinematic Highlight Video',
      'Priority Turnaround',
    ],
    popular: false,
  },
]

export default function Pricing() {
  const [packages, setPackages] = useState(fallbackPackages)

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const res = await fetch('/api/pricing')
        const data = await res.json()

        if (data.success && Array.isArray(data.data) && data.data.length) {
          setPackages(data.data.map((pkg) => ({
            id: pkg._id || pkg.id,
            name: pkg.name,
            tagline: pkg.tagline || 'Custom package',
            price: pkg.price,
            duration: pkg.duration || 'Custom coverage',
            features: Array.isArray(pkg.features) ? pkg.features : [],
            popular: Boolean(pkg.isPopular),
          })))
        }
      } catch {
        setPackages(fallbackPackages)
      }
    }

    loadPricing()
  }, [])

  return (
    <section id="pricing" className="bg-primary py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">Investment</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-light font-light">
              Photography Packages
            </h2>
            <p className="text-muted text-sm max-w-xs">
              Packages can be customised — get in touch to discuss your specific needs.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id || pkg.name}
              className={`relative flex flex-col p-10 border transition-all duration-500 ${
                pkg.popular
                  ? 'bg-canvas border-accent/40 md:-mt-4 md:-mb-4 md:py-14'
                  : 'bg-secondary border-white/6 hover:border-white/15'
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent px-6 py-1 whitespace-nowrap">
                  <p className="text-primary text-[9px] tracking-widest uppercase font-medium">Most Popular</p>
                </div>
              )}

              <div className="mb-8">
                <p className="text-muted-light text-[10px] tracking-widest uppercase mb-1">{pkg.name}</p>
                <p className="text-muted text-xs mb-6">{pkg.tagline}</p>
                <p className="font-display text-[clamp(2.5rem,4vw,3.5rem)] text-light font-light leading-none">
                  {pkg.price}
                </p>
                <p className="text-muted text-xs mt-2 tracking-wider">{pkg.duration} of coverage</p>
              </div>

              <div className="h-px bg-white/6 mb-8" />

              <ul className="space-y-3.5 flex-1 mb-10">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-light">
                    <Check size={13} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className={`py-3.5 text-xs tracking-widest uppercase transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-accent text-primary hover:bg-accent/85'
                    : 'border border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                Choose {pkg.name}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-muted text-xs text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          All prices are in INR and subject to travel charges for destinations outside Pune.
        </motion.p>
      </div>
    </section>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { portfolioItems as fallbackPortfolioItems } from '../data/portfolioData'

const CATEGORIES = ['All', 'Weddings', 'Portraits', 'Fashion', 'Events', 'Travel', 'Commercial']

const normalizeCategory = (category) => {
  const map = {
    Wedding: 'Weddings',
    Portrait: 'Portraits',
    Fashion: 'Fashion',
    Events: 'Events',
    Travel: 'Travel',
    Commercial: 'Commercial',
  }

  return map[category] || category
}

const transformPortfolioItems = (items = []) =>
  items.map((item) => {
    const firstImage = item.images?.[0] || {}

    return {
      id: item._id || item.id,
      category: normalizeCategory(item.category),
      title: item.title,
      location: item.location || 'Custom Session',
      image: firstImage.thumbnailUrl || firstImage.url || '',
      fullImage: firstImage.url || firstImage.thumbnailUrl || '',
    }
  })

export default function Portfolio() {
  const [items, setItems] = useState(transformPortfolioItems(fallbackPortfolioItems))
  const [filter, setFilter] = useState('All')
  const [lbOpen, setLbOpen] = useState(false)
  const [lbIndex, setLbIndex] = useState(0)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio?limit=50')
        const data = await res.json()

        if (data.success && Array.isArray(data.data) && data.data.length) {
          setItems(transformPortfolioItems(data.data))
        } else {
          setItems(transformPortfolioItems(fallbackPortfolioItems))
        }
      } catch {
        setItems(transformPortfolioItems(fallbackPortfolioItems))
      }
    }

    loadPortfolio()
  }, [])

  const shown = filter === 'All'
    ? items
    : items.filter(p => p.category === filter)

  const openLb = (i) => {
    setLbIndex(i)
    setLbOpen(true)
    document.body.style.overflow = 'hidden'
  }
  const closeLb = useCallback(() => {
    setLbOpen(false)
    document.body.style.overflow = ''
  }, [])
  const goNext = useCallback(() => setLbIndex(i => (i + 1) % shown.length), [shown.length])
  const goPrev = useCallback(() => setLbIndex(i => (i - 1 + shown.length) % shown.length), [shown.length])

  useEffect(() => {
    if (!lbOpen) return
    const fn = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Escape')     closeLb()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lbOpen, goNext, goPrev, closeLb])

  useEffect(() => { setLbIndex(0) }, [filter])

  return (
    <section id="portfolio" className="bg-primary py-24 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <p className="text-accent text-[10px] tracking-ultra uppercase mb-4">Visual Stories</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-light font-light">
              Portfolio
            </h2>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                    filter === cat
                      ? 'bg-accent text-primary'
                      : 'border border-white/15 text-white/50 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <AnimatePresence mode="popLayout">
            {shown.map((item, i) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.35) }}
                onClick={() => openLb(i)}
                className="group relative cursor-pointer overflow-hidden bg-secondary aspect-[4/5]"
              >
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.category} photography by Lumora`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.06]"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-75">
                    <p className="text-accent text-[9px] tracking-widest uppercase mb-1">{item.category}</p>
                    <h3 className="text-white font-display text-xl font-light leading-tight">{item.title}</h3>
                    <p className="text-white/50 text-xs mt-1">{item.location}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={18} />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lbOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center"
            onClick={closeLb}
          >
            <div
              className="relative w-full max-w-5xl mx-auto px-14 sm:px-20 flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={shown[lbIndex]?.id}
                  src={shown[lbIndex]?.fullImage}
                  alt={shown[lbIndex]?.title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="max-h-[86vh] max-w-full object-contain"
                />
              </AnimatePresence>

              {/* Info bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-white/40 text-xs tracking-widest">
                  {shown[lbIndex]?.title} &nbsp;·&nbsp; {lbIndex + 1} / {shown.length}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={closeLb}
                className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors p-2"
                aria-label="Close"
              >
                <X size={22} />
              </button>

              {/* Prev */}
              <button
                onClick={goPrev}
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3"
                aria-label="Previous"
              >
                <ChevronLeft size={30} />
              </button>

              {/* Next */}
              <button
                onClick={goNext}
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3"
                aria-label="Next"
              >
                <ChevronRight size={30} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

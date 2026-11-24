import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from '../utils/CountUp'

const stats = [
  { value: 99.4, suffix: '%', label: 'Model Prediction Accuracy', desc: 'Ensemble machine learning trained on multi-regional soil datasets.' },
  { value: 22, suffix: '', label: 'Crops Supported', desc: 'Complete coverage from cash crops to grains, legumes, and fruits.' },
  { value: 7, suffix: 'D', label: 'Soil Telemetry Inputs', desc: 'Full diagnostic on N, P, K, soil pH, temperature, humidity, and rainfall.' },
]

const images = [
  {
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    alt: 'Aerial view of agricultural fields at golden hour',
  },
  {
    src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop',
    alt: 'Farmer working in lush green crop field',
  },
]

export default function InnovationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="innovation" ref={ref} className="bg-[#062D17] py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-xl"
          >
            INTELLIGENT CROP<br />RECOMMENDATION AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-[#B8C5B6] text-base max-w-xs leading-relaxed md:pt-4 md:self-end"
          >
            Kropylex integrates state-of-the-art machine learning models with agronomic chemistry to pinpoint optimal crops for any soil and climate profile.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Images — stacked, landscape proportions */}
          <div className="flex flex-col gap-5">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-3xl group cursor-pointer w-full"
                style={{ aspectRatio: i === 0 ? '16/9' : '4/3' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062D17]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col justify-center gap-10 pl-0 lg:pl-12 pt-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group border-b border-white/10 pb-10 last:border-b-0 last:pb-0"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-7xl md:text-8xl font-bold text-white group-hover:text-[#84C65A] transition-colors duration-300">
                    {isInView ? <CountUp end={stat.value} duration={2000} /> : '0'}
                  </span>
                  <span className="text-5xl font-bold text-[#84C65A]">{stat.suffix}</span>
                </div>
                <p className="text-white font-semibold text-xl mb-1">{stat.label}</p>
                <p className="text-[#B8C5B6] text-sm leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

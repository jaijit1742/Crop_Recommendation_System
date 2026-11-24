import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const stories = [
  {
    img: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=800&auto=format&fit=crop',
    title: 'Precision Nitrogen Balancing for High-Yield Cereals',
    desc: 'How Kropylex analyzes N-P-K mineral ratios to recommend whether your soil profile is primed for rice, maize, or high-protein legumes.',
  },
  {
    img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
    title: 'Predictive Climate Adaptation Across 22 Crop Species',
    desc: 'Leverage microclimate rainfall and temperature telemetry to forecast crop resilience before sowing a single seed.',
  },
  {
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop',
    title: 'Soil pH Diagnostic & Mineral Availability Mapping',
    desc: 'Learn how alkaline versus acidic soil dynamics dictate nutrient absorption curves for cash crops like cotton, coffee, and jute.',
  },
  {
    img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=800&auto=format&fit=crop',
    title: 'Out-Of-Distribution Validation in Agriculture AI',
    desc: 'Explore Kropylex multi-tier safety architecture ensuring physical bounds verification and out-of-range sensor detection.',
  },
]

function StoryCard({ story, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-[#0B351D] border border-white/5 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={story.img}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B351D] to-transparent" />
        {/* Lime accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ originX: 0 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#84C65A]"
        />
      </div>

      {/* Content */}
      <div className="p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-[#84C65A] transition-colors duration-300">
          {story.title}
        </h3>
        <p className="text-[#B8C5B6] text-sm leading-relaxed mb-5">{story.desc}</p>
        <div className="flex items-center gap-2 text-[#84C65A] text-sm font-semibold">
          <span>Read More</span>
          <div className="w-6 h-6 rounded-full border border-[#84C65A]/40 flex items-center justify-center group-hover:bg-[#84C65A] group-hover:border-[#84C65A] transition-all duration-300">
            <ArrowUpRight className="w-3 h-3 group-hover:text-[#062D17] transition-colors duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function StoryGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="stories" ref={ref} className="bg-[#062D17] py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-lg"
          >
            WHERE TECHNOLOGY MEETS THE ROOTS OF NATURE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-[#B8C5B6] text-sm max-w-xs leading-relaxed mt-2"
          >
            Harnessing the power of modern tools to nurture crops, support farmers, and protect the earth we all depend on.
          </motion.p>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <StoryCard key={i} story={story} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

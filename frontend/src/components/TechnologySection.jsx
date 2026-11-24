import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'

export default function TechnologySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section id="technology" ref={ref} className="bg-[#F4F5F0] py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold text-[#062D17] leading-tight max-w-lg"
          >
            WHERE MACHINE LEARNING MEETS SOIL GENOMICS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-[#062D17]/60 text-sm max-w-xs leading-relaxed mt-4 md:mt-2"
          >
            Watch how Kropylex continuously analyzes soil chemistry, precipitation forecasts, and thermal bands to prevent crop failure and double farm yields.
          </motion.p>
        </div>

        {/* Cinematic Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden aspect-video cursor-pointer group shadow-2xl shadow-black/20"
          onClick={() => setVideoOpen(true)}
        >
          <img
            src="https://images.unsplash.com/photo-1587334207525-884e9ba37af0?q=80&w=2000&auto=format&fit=crop"
            alt="Aerial drone view of agricultural fields"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#062D17]/30 group-hover:bg-[#062D17]/20 transition-colors duration-500" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-[#84C65A]/30 scale-125"
              />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md border border-[#84C65A]/60 rounded-full flex items-center justify-center group-hover:bg-[#84C65A]/30 transition-all duration-300">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/xFqecEtdGZ0?autoplay=1&mute=0"
                title="The Future of Farming — Sustainable Agriculture Documentary"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

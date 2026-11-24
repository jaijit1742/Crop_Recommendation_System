import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const words = ['Grow', 'the', 'Future', 'with', 'Sustainable', 'Agriculture']

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section id="home" ref={ref} className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: imgScale }}
      >
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
          alt="Sustainable Agriculture"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#062D17]/60 via-[#062D17]/30 to-[#062D17]/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#062D17]/50 to-transparent z-10" />

      {/* Atmospheric glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#84C65A]/5 rounded-full blur-[120px] z-10 pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto"
      >
        {/* Pill Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-8 w-fit"
        >
          <span className="w-2 h-2 rounded-full bg-[#84C65A] animate-pulse" />
          AI-Powered Precision Agriculture
        </motion.div>

        {/* Staggered Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
          {['Predict', 'the', 'Perfect', 'Crop', 'with', 'Kropylex', 'AI'].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {word === 'Kropylex' || word === 'Crop' ? (
                <span className="text-[#84C65A]">{word}</span>
              ) : word}
            </motion.span>
          ))}
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
        >
          Maximize your agricultural yield by matching soil nitrogen, phosphorus, potassium, pH, rainfall, and temperature against trained machine learning models across 22 crop species.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5, type: 'spring', stiffness: 200 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link
            to="/recommend"
            className="group inline-flex items-center gap-3 bg-[#84C65A] hover:bg-[#72BA56] text-[#062D17] pl-7 pr-2 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-lg shadow-[#84C65A]/20 hover:shadow-[#84C65A]/35 hover:scale-105"
          >
            <span>Launch Crop Analyzer</span>
            <div className="w-9 h-9 bg-[#062D17] group-hover:bg-[#082713] rounded-full flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-[#84C65A]" />
            </div>
          </Link>
          <a
            href="#innovation"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full text-base font-medium backdrop-blur-md transition-all duration-300"
          >
            Explore System Science
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}

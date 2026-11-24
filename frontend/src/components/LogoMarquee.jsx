import { useRef } from 'react'
import { motion } from 'framer-motion'

const brands = ['FocalPoint', 'Screentime', 'Segment', 'Shutterframe', 'Lightspeed', 'Mastermail']
const duplicated = [...brands, ...brands]

export default function LogoMarquee() {
  return (
    <section className="bg-[#062D17] border-t border-b border-white/5 py-8 overflow-hidden relative">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#062D17] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#062D17] to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex items-center gap-16 group">
        {duplicated.map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 opacity-50 group-hover:opacity-30 hover:!opacity-100 transition-opacity duration-300 cursor-default"
          >
            <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/60" />
            </div>
            <span className="text-white text-sm font-semibold tracking-widest uppercase whitespace-nowrap">
              {brand}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

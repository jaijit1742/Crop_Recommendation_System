import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronRight } from 'lucide-react'

export default function CropSelector({ crops, selected, onSelect }) {
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)

  const featured = crops.slice(0, 8)
  const filtered = crops.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="relative"
      style={{
        background: 'rgba(7,30,23,0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Full search panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search crops…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#84C65A]/40"
                />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-11 gap-2 max-h-32 overflow-y-auto">
                {filtered.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => { onSelect(crop); setPanelOpen(false) }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selected.id === crop.id
                        ? 'bg-[#84C65A]/20 border border-[#84C65A]/40'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-xl">{crop.emoji}</span>
                    <span className="text-[9px] text-white/60 text-center leading-tight">{crop.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick selector row */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Featured crops */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map(crop => (
            <button
              key={crop.id}
              onClick={() => onSelect(crop)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0 transition-all ${
                selected.id === crop.id
                  ? 'border border-[#84C65A]/60 shadow-lg'
                  : 'border border-white/8 hover:border-white/20'
              }`}
              style={selected.id === crop.id ? {
                background: 'rgba(132,198,90,0.15)',
                boxShadow: '0 0 15px rgba(132,198,90,0.25)',
              } : {
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <span className="text-base">{crop.emoji}</span>
              <span className={`text-xs font-medium ${selected.id === crop.id ? 'text-[#84C65A]' : 'text-white/50'}`}>
                {crop.label}
              </span>
            </button>
          ))}
        </div>

        {/* Add more / expand */}
        <button
          onClick={() => setPanelOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          {panelOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span className="text-xs">Add More</span>
        </button>
      </div>
    </div>
  )
}

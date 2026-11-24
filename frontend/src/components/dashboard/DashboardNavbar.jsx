import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, ChevronDown, Search, Sprout, LayoutDashboard, Leaf, FileText, Wrench, Bug } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard', icon: LayoutDashboard, active: true },
  { label: 'Crop Management', href: '/recommend',  icon: Leaf },
  { label: 'Crop Report',     href: '/recommend',  icon: FileText },
  { label: 'Equipments',      href: '/dashboard',  icon: Wrench },
  { label: 'Pest & Disease',  href: '/dashboard',  icon: Bug, highlighted: true },
]

export default function DashboardNavbar({ selectedCrop }) {
  const [notifOpen, setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav
      className="relative z-20 flex items-center justify-between px-4 h-16 flex-shrink-0"
      style={{
        background: 'rgba(7,30,23,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mr-6 flex-shrink-0 group">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #84C65A, #16A66A)', boxShadow: '0 0 15px rgba(132,198,90,0.35)' }}
        >
          <Sprout className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-extrabold text-lg tracking-tight leading-none">
            Kropylex<span style={{ color: '#84C65A' }}>.AI</span>
          </span>
          <span className="text-white/40 text-[9px] font-medium tracking-widest uppercase mt-0.5">Crop Intelligence</span>
        </div>
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              item.highlighted
                ? 'bg-[#84C65A]/20 text-[#84C65A] border border-[#84C65A]/30'
                : item.active
                ? 'text-white bg-white/8'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Link>
        ))}

        {/* Add New */}
        <button
          onClick={() => navigate('/recommend')}
          className="ml-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #84C65A, #16A66A)', boxShadow: '0 0 15px rgba(132,198,90,0.3)' }}
          title="Add New Scan"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all border border-white/8">
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all border border-white/8 relative"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#84C65A]" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="absolute right-0 top-10 w-72 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                style={{ background: 'rgba(11,48,36,0.98)', backdropFilter: 'blur(20px)' }}
              >
                <div className="p-3 border-b border-white/8">
                  <p className="text-white text-sm font-semibold">Notifications</p>
                </div>
                {[
                  { msg: `${selectedCrop?.label || 'Crop'} health scan completed`, time: 'just now', color: '#84C65A' },
                  { msg: 'Soil moisture below optimal for rice', time: '2h ago', color: '#E9B949' },
                  { msg: 'New recommendation available', time: '5h ago', color: '#84C65A' },
                ].map((n, i) => (
                  <div key={i} className="px-3 py-2.5 hover:bg-white/5 cursor-pointer border-b border-white/5">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
                      <div>
                        <p className="text-white/80 text-xs">{n.msg}</p>
                        <p className="text-white/30 text-xs mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/8 transition-all border border-white/8"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #84C65A, #16A66A)' }}
            >
              M
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-medium leading-none">Manager</p>
              <p className="text-white/40 text-[10px] mt-0.5">Farm Manager</p>
            </div>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="absolute right-0 top-10 w-48 rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                style={{ background: 'rgba(11,48,36,0.98)', backdropFilter: 'blur(20px)' }}
              >
                {['My Profile', 'Settings', 'Help & Support'].map((item) => (
                  <button key={item} className="w-full text-left px-4 py-2.5 text-white/70 text-sm hover:text-white hover:bg-white/5 transition-all">
                    {item}
                  </button>
                ))}
                <div className="border-t border-white/8">
                  <Link to="/" className="block px-4 py-2.5 text-red-400/80 text-sm hover:text-red-400 hover:bg-white/5 transition-all">
                    Sign Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

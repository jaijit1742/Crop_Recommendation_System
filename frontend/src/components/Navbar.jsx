import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X, Sprout } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#innovation' },
  { name: 'Our Farms', href: '#technology' },
  { name: 'Products', href: '#stories' },
  { name: 'Sustainability', href: '#faq' },
  { name: 'Blog', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href, name) => {
    e.preventDefault()
    setActive(name)
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 rounded-full px-6 py-3 flex items-center justify-between ${
          scrolled
            ? 'bg-[#062D17]/90 backdrop-blur-xl shadow-2xl shadow-black/30'
            : 'bg-black/20 backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-4 flex-shrink-0 group">
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href, link.name)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                active === link.name
                  ? 'text-[#082713] bg-[#84C65A]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Contact Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/recommend"
            className="group flex items-center gap-3 bg-white/10 hover:bg-[#84C65A] text-white hover:text-[#082713] border border-white/20 hover:border-[#84C65A] pl-5 pr-2 py-2 rounded-full text-sm font-semibold transition-all duration-300"
          >
            <span>Contact Us</span>
            <div className="w-7 h-7 bg-[#84C65A] group-hover:bg-[#082713] rounded-full flex items-center justify-center transition-colors duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#082713] group-hover:text-white transition-colors duration-300" />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-4 right-4 z-40 bg-[#062D17]/95 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active === link.name
                      ? 'bg-[#84C65A] text-[#082713]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/recommend"
                className="mt-4 flex items-center justify-center gap-2 bg-[#84C65A] text-[#082713] px-5 py-3 rounded-xl text-sm font-semibold"
              >
                Contact Us <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

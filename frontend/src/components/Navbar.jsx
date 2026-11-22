import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Key Features', href: '#' },
    { name: 'About us', href: '#' },
    { name: 'Service', href: '#' },
    { name: 'Testimonial', href: '#' },
    { name: 'FAQ', href: '#' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-medium text-[#4F8F3A] tracking-tight">Kropelyx</span>
          </Link>
          
          {/* Centered Navigation */}
          <div className="hidden md:flex space-x-10 items-center">
            {links.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className={`text-[15px] font-medium transition-colors ${
                  link.name === 'Home' && location.pathname === '/' 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            <button className="bg-[#3D711B] hover:bg-[#2c5313] text-white pl-6 pr-2 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-4">
              <span>Login</span>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#3D711B]" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}

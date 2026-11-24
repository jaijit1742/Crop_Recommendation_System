import { Link } from 'react-router-dom'
import { ArrowUpRight, Globe, Mail, Rss, Share2 } from 'lucide-react'

const footerLinks = {
  Company: ['About Us', 'Our Farms', 'Sustainability', 'Careers', 'News'],
  Platform: ['Crop Advisor', 'Smart Tools', 'Marketplace', 'Analytics', 'Pricing'],
  Resources: ['Documentation', 'Blog', 'Research Papers', 'Webinars', 'Press'],
}

export default function Footer() {
  return (
    <footer className="bg-[#082713] text-white">
      {/* CTA Banner */}
      <div className="bg-[#84C65A] px-6 md:px-16 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h3 className="text-3xl md:text-4xl font-bold text-[#062D17] leading-tight max-w-lg">
            Ready to find the ideal crop<br />for your soil conditions?
          </h3>
          <Link
            to="/recommend"
            className="group shrink-0 flex items-center gap-3 bg-[#062D17] hover:bg-[#0B351D] text-white pl-7 pr-2 py-3 rounded-full text-base font-bold transition-all duration-300"
          >
            <span>Launch Crop Analyzer</span>
            <div className="w-9 h-9 bg-[#84C65A] rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-[#062D17]" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-6 md:px-16 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="text-2xl font-extrabold tracking-tight mb-4 block">
                Kropylex<span className="text-[#84C65A]">.AI</span>
              </span>
              <p className="text-[#B8C5B6] text-sm leading-relaxed mb-6 max-w-xs">
                Next-generation precision agriculture AI platform providing machine learning-powered crop recommendations, soil telemetry analysis, and agricultural risk intelligence.
              </p>
              <div className="flex gap-3">
                {[Globe, Mail, Rss, Share2].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-[#84C65A]/20 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-[#84C65A] transition-all duration-300">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="font-semibold text-sm uppercase tracking-widest text-white/50 mb-6">{heading}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#B8C5B6] text-sm hover:text-[#84C65A] transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>© 2026 Kropylex.AI Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

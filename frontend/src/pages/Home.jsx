import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(1)

  const faqs = [
    { id: 0, question: "Do I need internet access to use Kropelyx?", answer: "Yes, you need a basic internet connection to use our prediction models and features." },
    { id: 1, question: "Can I sell directly through the platform?", answer: "Yes, Kropelyx allows you to list your farm produce and reach verified buyers. You can set prices, manage your listings, and track orders with ease. It helps reduce middlemen and puts you in control of your sales. Selling is fast, simple, and farmer-friendly." },
    { id: 2, question: "Is Kropelyx only for large farms?", answer: "No, Kropelyx is designed for smallholder farmers and large-scale agribusinesses alike." },
    { id: 3, question: "How much does it cost to use Kropelyx?", answer: "Our core prediction features are completely free. Premium analytics tools require a subscription." }
  ]

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-medium text-black leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Empowering Farmers with Technology and Support
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
          Kropelyx helps farmers, agribusinesses, and food producers increase productivity, access expert advice, and sell with confidence.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/recommend" className="bg-[#437A16] hover:bg-[#346210] text-white pl-6 pr-2 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-3">
            <span>Get Started</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-[#437A16]" />
            </div>
          </Link>
          <a href="#about" className="bg-white border border-gray-200 hover:border-gray-300 text-black pl-6 pr-2 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-3">
            <span>Learn More</span>
            <div className="w-8 h-8 bg-[#437A16] rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </a>
        </div>

        {/* Massive Hero Image with Glassmorphism overlay */}
        <div className="relative w-full rounded-[2rem] overflow-hidden aspect-[21/9] md:aspect-[21/10]">
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="absolute bottom-8 right-8 max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-sm font-medium">Our mission</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              At Kropelyx, our mission is to empower farmers with the tools, knowledge, and support they need to thrive. We aim to bridge the gap between traditional farming and modern technology, helping growers increase productivity, access fair markets, and build sustainable agricultural businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
          Kropelyx is built with farmers in mind. We make it easier to manage your farm, get expert advice, and sell your produce all from one place. Whether you're growing crops or raising livestock, Kropelyx helps you make smarter decisions, increase your yield, and grow your income with confidence. It's simple, reliable, and made for everyday farming needs.
        </p>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-[#437A16] text-white px-4 py-1 rounded-full text-sm font-medium mb-6">Services Section</div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">What We Offer</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-10">
          {[
            { title: "Crop Advisory", desc: "We provide personalized farming tips based on your crop type, weather, and season...", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600" },
            { title: "Agri-Marketplace", desc: "Find trusted buyers or suppliers in your area. Sell produce, buy equipment, and stay competitive.", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600" },
            { title: "Farm Financing Support", desc: "Connect with micro-lenders and financial partners who understand the agricultural cycle.", img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600" },
            { title: "Smart Tools & Analytics", desc: "Use mobile tools to track planting schedules, costs, and expenses. Make smarter decisions with real data.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600" }
          ].map((service, idx) => (
            <div key={idx} className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.img})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-xl mb-2">{service.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">{service.desc}</p>
                <div className="flex justify-end">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button className="w-10 h-10 bg-[#437A16] rounded-full flex items-center justify-center hover:bg-[#346210] transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-[#437A16] text-white px-4 py-1 rounded-full text-sm font-medium mb-6">Testimonials</div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-20">What Farmers Say About Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center mb-12">
          {[
            { name: "Adamu I.", role: "Maize Farmer", text: "Before using Kropelyx, I used to rely on guesswork and advice from neighbors. Now, I receive real-time weather updates, planting tips, and market price alerts all on my phone. It has completely changed how I farm. Last season, I increased my maize yield by 30% just by following the expert advice from the platform. I now sell faster and make more profit with less stress." },
            { name: "Musa A.", role: "Vegetable Farmer", text: "What makes Kropelyx stand out is the ability to connect directly with buyers. I used to go to local markets and bargain endlessly. Now, I list my vegetables on the platform, and buyers reach out to me. I even got a bulk order from a restaurant in Abuja. Plus, I can manage all my records and sales in one place. This is real progress for smallholder farmers like me.", featured: true },
            { name: "Ngozi U.", role: "Cassava Farmer", text: "As a cassava farmer, timing is everything. Before Kropelyx, I often planted late or missed out on good market prices. The app now helps me plan better with reminders and clear planting guides. I also appreciate the financial tools; it helped me track my spending and reduce waste. The customer support is quick and friendly too. I can say this is the best farming tool I've ever used." }
          ].map((test, idx) => (
            <div key={idx} className={`relative bg-white border border-[#437A16]/20 rounded-[2rem] p-8 text-center shadow-sm ${test.featured ? 'scale-105 shadow-md border-[#437A16]' : ''}`}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                <img src={`https://i.pravatar.cc/150?img=${idx + 10}`} alt={test.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-8 mb-4">
                <h4 className="font-bold text-gray-900">{test.name}</h4>
                <p className="text-sm text-gray-500">{test.role}</p>
              </div>
              <div className="text-[#437A16] text-3xl font-serif mb-2">"</div>
              <p className="text-gray-600 text-sm leading-relaxed">{test.text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button className="w-10 h-10 bg-[#437A16] rounded-full flex items-center justify-center hover:bg-[#346210] transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="bg-[#437A16] text-white px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block">FAQ Section</div>
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="md:w-2/3 flex flex-col gap-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${openFaq === faq.id ? 'border-transparent shadow-lg bg-white relative' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                onClick={() => setOpenFaq(faq.id === openFaq ? null : faq.id)}
              >
                {openFaq === faq.id && (
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#437A16] rounded-r-full"></div>
                )}
                <div className="flex justify-between items-center gap-4">
                  <h4 className={`font-semibold ${openFaq === faq.id ? 'text-[#437A16]' : 'text-gray-900'}`}>{faq.question}</h4>
                  {openFaq === faq.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                {openFaq === faq.id && (
                  <p className="text-gray-600 mt-4 leading-relaxed text-sm">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#437A16] rounded-[3rem] p-16 text-center relative overflow-hidden">
          {/* Faint leaf/line texture in background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-10 leading-tight">
              Looking for a smarter way to grow and sell your farm produce?
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="bg-[#346210] hover:bg-[#2c5313] text-white pl-6 pr-2 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-3">
                <span>Join Kropelyx</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-[#346210]" />
                </div>
              </button>
              <button className="bg-white hover:bg-gray-50 text-black pl-6 pr-2 py-2 rounded-full text-base font-medium transition-colors flex items-center gap-3">
                <span>Explore Features</span>
                <div className="w-8 h-8 bg-[#437A16] rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900">
            Join our newsletter to<br/>keep up to date with us!
          </h3>
          <div className="flex w-full md:w-auto max-w-md border border-gray-300 rounded-full p-1 pl-6 items-center">
            <input type="email" placeholder="Enter your email" className="bg-transparent border-none focus:outline-none flex-grow text-sm" />
            <button className="bg-[#437A16] hover:bg-[#346210] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <span className="text-2xl font-medium text-[#4F8F3A] tracking-tight block mb-4">Kropelyx</span>
            <p className="text-gray-500 text-sm">Empowering farmers with<br/>Technology and Support</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-gray-900">Plans & Pricing</a></li>
              <li><a href="#" className="hover:text-gray-900">Features</a></li>
              <li><a href="#" className="hover:text-gray-900">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">News</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
              <li><a href="#" className="hover:text-gray-900">Papers</a></li>
              <li><a href="#" className="hover:text-gray-900">Press Conferences</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Kropelyx Inc.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    id: 0,
    question: 'How does Kropylex determine crop recommendations?',
    answer: 'Kropylex uses trained ensemble machine learning models validated on multi-season agricultural datasets. It analyzes 7 key environmental parameters: Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, Soil pH, and Rainfall to output calibrated probability distributions.',
  },
  {
    id: 1,
    question: "What crops are supported by Kropylex?",
    answer: 'Kropylex currently supports 22 distinct crop varieties including staple grains (rice, maize), pulses (chickpea, kidneybeans, lentil, pigeonpeas, mungbean, blackgram, mothbeans), fruits (apple, banana, grapes, mango, orange, papaya, pomegranate, watermelon, muskmelon), and commercial crops (cotton, jute, coconut, coffee).',
  },
  {
    id: 2,
    question: 'How does Kropylex handle out-of-range or impossible sensor data?',
    answer: 'Kropylex incorporates a multi-tier safety architecture. Tier 1 rejects physically impossible values (e.g. negative rainfall or pH > 14). Tier 2 runs Out-Of-Distribution (OOD) checks against training bounds to protect farmers from false confidence when sensors drift.',
  },
  {
    id: 3,
    question: 'Can I test live predictions immediately?',
    answer: 'Yes! Simply navigate to our Crop Analyzer page, adjust your soil and microclimate telemetry sliders or enter test values, and run the real-time AI inference pipeline to inspect top matches with confidence scores.',
  },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isOpen ? 'border-[#84C65A]/40 bg-white/5' : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <h4 className={`font-semibold text-base ${isOpen ? 'text-[#062D17]' : 'text-gray-800'}`}>
          {faq.question}
        </h4>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#84C65A] text-[#062D17] rotate-0' : 'bg-gray-100 text-gray-500'
        }`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-6">
              <div className="h-px bg-[#84C65A]/30 mb-4" />
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openId, setOpenId] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="faq" ref={ref} className="bg-[#F4F5F0] py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold text-[#062D17] leading-tight max-w-md"
          >
            GOT QUESTIONS? WE'VE GOT YOU COVERED.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-[#062D17]/60 text-sm max-w-xs leading-relaxed mt-2"
          >
            Find quick answers to some of the most common questions about our sustainable farming technologies, services, and how we work.
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Search, Bell, User,
  LayoutDashboard, Map, Sprout, Activity, Settings,
  Loader2, Sparkles, AlertTriangle, Info
} from 'lucide-react'
import { predictionApi } from '../services/predictionApi'
import axios from 'axios'

// Typical ranges shown as helper text — not blocking
const FIELD_META = {
  N:           { label: 'Nitrogen (N)',      hint: 'Typical: 0–140 kg/ha' },
  P:           { label: 'Phosphorus (P)',    hint: 'Typical: 5–145 kg/ha' },
  K:           { label: 'Potassium (K)',     hint: 'Typical: 5–205 kg/ha' },
  temperature: { label: 'Temperature (°C)',  hint: 'Typical: 8–44 °C' },
  humidity:    { label: 'Humidity (%)',      hint: '0–100 %' },
  ph:          { label: 'pH Level',          hint: '0–14 (soil: 3.5–10)' },
  rainfall:    { label: 'Rainfall (mm)',     hint: 'Typical: 20–300 mm' },
}

const CROP_EMOJIS = {
  rice: '🌾', wheat: '🌿', maize: '🌽', cotton: '🌸',
  sugarcane: '🎋', jute: '🪢', coffee: '☕', coconut: '🥥',
  papaya: '🍈', orange: '🍊', apple: '🍎', muskmelon: '🍈',
  watermelon: '🍉', grapes: '🍇', mango: '🥭', banana: '🍌',
  pomegranate: '🍎', lentil: '🫘', blackgram: '🫘', mungbean: '🫘',
  mothbeans: '🫘', pigeonpeas: '🫘', kidneybeans: '🫘', chickpea: '🫘',
}

function getCropEmoji(crop) {
  return CROP_EMOJIS[crop?.toLowerCase()] ?? '🌱'
}

export default function Recommend() {
  const [formData, setFormData] = useState({
    N: '90',
    P: '42',
    K: '43',
    temperature: '20.8',
    humidity: '82.0',
    ph: '6.5',
    rainfall: '202.9',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult]             = useState(null)   // { status, recommendations, message, details }
  const [error, setError]               = useState(null)   // string — 422 or network error

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    const payload = {
      N:           parseFloat(formData.N),
      P:           parseFloat(formData.P),
      K:           parseFloat(formData.K),
      temperature: parseFloat(formData.temperature),
      humidity:    parseFloat(formData.humidity),
      ph:          parseFloat(formData.ph),
      rainfall:    parseFloat(formData.rainfall),
    }

    if (Object.values(payload).some(val => isNaN(val))) {
      setError('Please fill out all fields with valid numbers.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const data = await predictionApi.predict(payload)
      setResult(data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          // Pydantic validation error — physically impossible values
          const details = err.response.data?.detail
          if (Array.isArray(details) && details.length > 0) {
            const msgs = details.map(d => d.msg).join('; ')
            setError(`Invalid input: ${msgs}`)
          } else {
            setError('Invalid input values — please check that all fields are physically possible.')
          }
        } else if (err.response?.status === 503) {
          setError('Model is not loaded on the server. Please try again later.')
        } else if (!err.response) {
          setError('Backend is unreachable. Please ensure the API server is running.')
        } else {
          setError(err.response.data?.detail || 'An unexpected error occurred.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // -------------------------------------------------------------------------
  // Derived display state
  // -------------------------------------------------------------------------
  const isSuccess    = result?.status === 'success'
  const isOOD        = result?.status === 'out_of_range'
  const isLowConf    = result?.status === 'low_confidence'
  const hasAlert     = isOOD || isLowConf
  const showCards    = isSuccess && result.recommendations?.length > 0
  const topCrop      = showCards ? result.recommendations[0] : null

  return (
    <div
      className="min-h-screen bg-[#1a2b1f] text-white font-sans relative flex overflow-hidden"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c140f]/90 via-[#112316]/80 to-[#0c140f]/95 z-0" />

      {/* Sidebar */}
      <div className="w-16 flex-shrink-0 border-r border-white/5 flex flex-col items-center py-6 gap-8 z-10 bg-black/20 backdrop-blur-md">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-forest mb-4">
          <Sprout className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-6 text-white/40">
          <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:text-white transition-colors">
            <Map className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:text-white transition-colors">
            <Sprout className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:text-white transition-colors">
            <Activity className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto z-10">

        {/* Top Navbar */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0">
          <Link
            to="/"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1">
            <button className="px-6 py-2 bg-white text-[#1a2b1f] rounded-full text-sm font-medium shadow-sm">Overview</button>
            <button className="px-6 py-2 text-white/60 hover:text-white rounded-full text-sm font-medium transition-colors">Irrigation</button>
            <button className="px-6 py-2 text-white/60 hover:text-white rounded-full text-sm font-medium transition-colors">Weather</button>
            <button className="px-6 py-2 text-white/60 hover:text-white rounded-full text-sm font-medium transition-colors">Analytics</button>
          </div>

          <div className="flex gap-4">
            <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 border border-white/10 backdrop-blur-md text-white/70">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 border border-white/10 backdrop-blur-md text-white/70">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-gradient-to-tr from-[#2E7D32] to-[#A8C59A] rounded-full flex items-center justify-center shadow-lg border border-white/20">
              <User className="w-4 h-4 text-[#1a2b1f]" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 grid grid-cols-12 gap-6 flex-grow pb-12">

          {/* Left Column — Inputs */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

            {/* NPK Panel */}
            <div className="grid grid-cols-3 gap-6 h-64">
              <div className="col-span-2 relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 overflow-hidden flex flex-col justify-end">
                <div className="relative z-10 w-full">
                  <div className="text-white/50 text-xs tracking-wider uppercase mb-1">Soil Nutrients</div>
                  <div className="text-3xl font-light text-white mb-4">Input Profile</div>
                  <div className="flex gap-4">
                    {['N', 'P', 'K'].map(key => (
                      <div key={key} className="flex-1 bg-black/20 rounded-2xl p-3 border border-white/5">
                        <div className="text-white/40 text-xs mb-0.5">{FIELD_META[key].label}</div>
                        <input
                          type="number"
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          className="w-full bg-transparent text-xl font-medium focus:outline-none"
                        />
                        <div className="text-white/25 text-[10px] mt-0.5">{FIELD_META[key].hint}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Animated Sprout */}
              <div className="col-span-1 h-full flex">
                <div
                  className="w-full h-full relative border-[3px] border-[#A8C59A] shadow-[0_0_30px_rgba(168,197,154,0.15)] overflow-hidden bg-gradient-to-b from-[#1a2b1f]/80 to-transparent flex items-center justify-center"
                  style={{ borderRadius: '48px' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-24 h-24 bg-[#4F8F3A] rounded-full blur-[40px]"
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Sprout className="w-16 h-16 text-[#A8C59A] drop-shadow-[0_0_15px_rgba(168,197,154,0.8)]" />
                    </motion.div>
                    <motion.div
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_15px_#fff]"
                    />
                  </div>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-[#A8C59A]/60 rounded-full blur-[1px]"
                      initial={{ left: `${20 + Math.random() * 60}%`, top: '80%', opacity: 0, scale: 0 }}
                      animate={{ top: '20%', opacity: [0, 1, 0], scale: [0, 1.5, 0.5] }}
                      transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Environmental Inputs */}
            <div className="grid grid-cols-2 gap-6 flex-grow">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
                <h3 className="text-white/70 text-sm font-medium mb-5">Environmental Conditions</h3>
                <div className="flex flex-col justify-between flex-grow gap-3">
                  {['temperature', 'humidity', 'ph', 'rainfall'].map((key) => {
                    const maxMap = { temperature: 50, humidity: 100, ph: 14, rainfall: 300 }
                    return (
                      <div key={key}>
                        <div className="flex items-center gap-4 group">
                          <span className="w-24 text-xs text-white/40 font-medium tracking-wide shrink-0">
                            {FIELD_META[key].label}
                          </span>
                          <div className="flex-grow h-1.5 bg-black/30 rounded-full overflow-hidden relative">
                            <div
                              className="absolute top-0 left-0 h-full bg-[#A8C59A] rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (Number(formData[key] || 0) / maxMap[key]) * 100)}%` }}
                            />
                          </div>
                          <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-sm font-medium focus:outline-none focus:bg-white/10 transition-colors"
                          />
                        </div>
                        <div className="text-white/20 text-[10px] mt-0.5 pl-28">{FIELD_META[key].hint}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Radar Mock */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
                <h3 className="absolute top-6 left-6 text-white/70 text-sm font-medium">Data Balance</h3>
                <div className="w-40 h-40 relative mt-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                    <polygon points="50,10 90,35 90,80 50,95 10,75 10,25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <polygon points="50,30 70,45 70,65 50,75 30,60 30,40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="90" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="90" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="10" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="50" x2="10" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <polygon
                      points="50,20 80,42 72,70 50,85 22,62 28,32"
                      fill="rgba(79, 143, 58, 0.4)"
                      stroke="#A8C59A"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-white/50">N</div>
                  <div className="absolute top-1/4 -right-4 text-[10px] text-white/50">Temp</div>
                  <div className="absolute bottom-1/4 -right-4 text-[10px] text-white/50">Rain</div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/50">pH</div>
                  <div className="absolute bottom-1/4 -left-4 text-[10px] text-white/50">Hum</div>
                  <div className="absolute top-1/4 -left-4 text-[10px] text-white/50">K</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Results */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

            {/* Main Result Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-grow flex flex-col relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A8C59A]/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Orb */}
              <div className="h-48 flex items-center justify-center relative z-10 mt-4 mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FCFCF8] to-[#A8C59A] shadow-[0_0_80px_rgba(168,197,154,0.6)] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                  <div className="absolute top-2 left-4 w-12 h-6 bg-white/60 rounded-full blur-sm rotate-[-30deg]" />
                  {/* Show top crop emoji inside orb on success */}
                  {showCards && (
                    <span className="relative z-10 text-4xl select-none">
                      {getCropEmoji(topCrop.crop)}
                    </span>
                  )}
                </div>
              </div>

              {/* Result area */}
              <div className="text-center relative z-10 flex-grow flex flex-col items-center">
                <AnimatePresence mode="wait">

                  {/* Validation error (422) */}
                  {error && (
                    <motion.div
                      key="validation-error"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 items-start text-left"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-red-300 font-medium text-sm mb-0.5">Validation Error</div>
                        <div className="text-red-400/80 text-xs leading-relaxed">{error}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* OOD or Low-confidence alert */}
                  {!error && hasAlert && (
                    <motion.div
                      key="ood-alert"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-3 items-start text-left"
                    >
                      <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-amber-300 font-medium text-sm mb-1">
                          {isOOD ? 'Out-of-Range Inputs' : 'Low Confidence'}
                        </div>
                        <div className="text-amber-400/80 text-xs leading-relaxed mb-2">
                          {result.message}
                        </div>
                        {isOOD && result.details?.out_of_range_features && (
                          <ul className="text-amber-400/70 text-xs space-y-1">
                            {Object.entries(result.details.out_of_range_features).map(([feat, info]) => (
                              <li key={feat} className="font-mono">
                                <span className="text-amber-300 font-semibold">{feat}</span>
                                {' = '}{info.value}
                                {'  (supported: '}{info.supported_min.toFixed(1)}{'–'}{info.supported_max.toFixed(1)}{')'}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Success — Top 3 cards */}
                  {!error && showCards && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full mb-6"
                    >
                      <div className="text-white/50 text-xs tracking-widest uppercase mb-3">Top Recommendations</div>
                      <div className="flex flex-col gap-2">
                        {result.recommendations.map((rec, idx) => (
                          <div
                            key={rec.crop}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition-all
                              ${idx === 0
                                ? 'bg-[#A8C59A]/15 border-[#A8C59A]/40 shadow-[0_0_20px_rgba(168,197,154,0.1)]'
                                : 'bg-white/5 border-white/10'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getCropEmoji(rec.crop)}</span>
                              <div className="text-left">
                                <div className={`font-medium capitalize ${idx === 0 ? 'text-white text-base' : 'text-white/80 text-sm'}`}>
                                  {rec.crop}
                                </div>
                                {idx === 0 && (
                                  <div className="text-white/40 text-xs">Best match</div>
                                )}
                              </div>
                            </div>
                            <div className={`text-right ${idx === 0 ? 'text-[#A8C59A]' : 'text-white/50'}`}>
                              <div className="font-semibold text-sm">{rec.confidence.toFixed(1)}%</div>
                              <div className="text-xs opacity-60">confidence</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Default greeting */}
                  {!error && !result && (
                    <motion.div
                      key="greeting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-w-xs text-white/60 text-sm leading-relaxed mb-8"
                    >
                      Hello! I'm your AI Farming Assistant. Fill out the environmental parameters
                      on the left to analyze the optimal crop for your field.
                    </motion.div>
                  )}

                </AnimatePresence>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-auto w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl py-4 font-medium transition-all flex items-center justify-center gap-3 group backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-[#A8C59A] group-hover:scale-110 transition-transform" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Info Strip */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                  <Activity className="w-3 h-3" /> System Status
                </div>
                <div className="text-white text-lg font-light">Online &amp; Ready</div>
                <div className="text-white/30 text-[10px] mt-1">Model loaded &amp; validated</div>
              </div>
              <div className="border-l border-white/10 pl-4">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                  <Sprout className="w-3 h-3" /> Active AI Alerts
                </div>
                <div className="text-white text-lg font-light">0 Alerts</div>
                <div className="text-white/30 text-[10px] mt-1">Conditions optimal</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

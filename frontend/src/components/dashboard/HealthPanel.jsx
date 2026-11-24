import { motion } from 'framer-motion'
import { Ruler, Scissors, Shield, CheckCircle, XCircle } from 'lucide-react'

function CircularProgress({ value, size = 110, stroke = 8, color = '#84C65A' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Background track */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      {/* Progress */}
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  )
}

function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl p-3.5 ${className}`}
      style={{
        background: 'rgba(15,58,41,0.72)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </div>
  )
}

export default function HealthPanel({ healthScore, healthLabel, cropName, prediction, loading }) {
  const scoreColor =
    healthScore >= 75 ? '#84C65A' :
    healthScore >= 50 ? '#E9B949' : '#EF665B'

  const recommendations = prediction?.status === 'success'
    ? prediction.recommendations
    : []

  return (
    <div className="flex flex-col gap-3">
      {/* Header section */}
      <div className="px-1 pt-1 pb-1">
        <h2 className="text-white text-xl font-bold tracking-tight">Pest &amp; Disease</h2>
        <p className="text-white/40 text-xs mt-0.5">Live Diagnostic &amp; Telemetry Monitoring</p>
      </div>

      {/* Health Status card */}
      <GlassCard>
        <p className="text-white/60 text-xs font-medium mb-0.5">Health Status</p>
        <p className="text-white/30 text-[10px] mb-3">Total Disease points</p>

        {/* Circular gauge */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <CircularProgress value={healthScore} color={scoreColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={healthScore}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold"
                style={{ color: scoreColor }}
              >
                {healthScore}%
              </motion.span>
              <span className="text-white/60 text-[10px]">{healthLabel}</span>
            </div>
          </div>

          <div className="flex-1">
            {/* Disease indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-[#84C65A]" />
                  <span className="text-white/70 text-xs">Early Blight</span>
                </div>
                <span className="text-xs text-white/40">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3 h-3 text-[#EF665B]" />
                  <span className="text-white/70 text-xs">Leaf Rust</span>
                </div>
                <span className="text-xs text-[#EF665B]">Found</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-2 mt-3">
              {[
                { color: '#84C65A', label: 'Healthy' },
                { color: '#E9B949', label: 'Moderate' },
                { color: '#EF665B', label: 'Unhealthy' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-white/40 text-[9px]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Maintain Plant Spacing */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(132,198,90,0.15)' }}>
            <Ruler className="w-4 h-4" style={{ color: '#84C65A' }} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Maintain Plant Spacing</p>
            <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
              Good air circulation reduces disease risk for {cropName}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#84C65A]" />
              <span className="text-[#84C65A] text-xs">Spacing: Optimal</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Remove Affected Leaves */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,102,91,0.15)' }}>
            <Scissors className="w-4 h-4 text-[#EF665B]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Remove Affected Leaves</p>
            <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
              Prevent the spread to healthy plants
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF665B]" />
              <span className="text-[#EF665B] text-xs">2 leaves detected</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Use Disease Resistant Varieties */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(22,166,106,0.15)' }}>
            <Shield className="w-4 h-4 text-[#16A66A]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Use Disease Resistant Va…</p>
            <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
              Choose resistant varieties for long-term crop protection
            </p>
            {loading ? (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                <span className="text-white/30 text-xs">Analyzing…</span>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="mt-2 space-y-1">
                {recommendations.slice(0,3).map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white/60 text-xs capitalize">{r.crop}</span>
                    <span className="text-[#16A66A] text-xs">{r.confidence.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A66A]" />
                <span className="text-[#16A66A] text-xs">IR64, Jaya varieties</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

import { motion } from 'framer-motion'
import { QrCode, Calendar, MapPin, Sprout, Droplets, Thermometer, Wind, CloudRain } from 'lucide-react'

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

function SoilBar({ label, value, max, unit, color = '#84C65A', icon: Icon }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3 text-white/40" />}
          <span className="text-white/60 text-xs">{label}</span>
        </div>
        <span className="text-xs font-medium" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  )
}

function CropDistBar({ label, pct, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 text-xs text-white/60 flex-shrink-0 truncate">{label}</div>
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          style={{ background: color }}
        />
      </div>
      <div className="text-xs text-white/50 w-8 text-right">{pct}%</div>
    </div>
  )
}

export default function ScanPanel({ scanId, selectedCrop, growthStage, soilData, prediction, loading }) {
  const scanDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  // Build crop distribution from prediction if available
  const distribution = prediction?.status === 'success'
    ? prediction.recommendations.slice(0, 3).map((r, i) => ({
        label: r.crop.charAt(0).toUpperCase() + r.crop.slice(1),
        pct: Math.round(r.confidence),
        color: ['#84C65A', '#16A66A', '#5EAA38'][i],
      }))
    : [
        { label: selectedCrop.label, pct: 68, color: '#84C65A' },
        { label: 'Wheat',            pct: 32, color: '#E9B949' },
        { label: 'Beans',            pct: 20, color: '#16A66A' },
      ]

  return (
    <div className="flex flex-col gap-3">
      {/* Scan Overview */}
      <GlassCard>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white text-sm font-semibold">Scan Overview</p>
            <p className="text-white/40 text-xs">32 Active Assessments</p>
          </div>
          <QrCode className="w-5 h-5 text-white/30" />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
            <QrCode className="w-4 h-4 text-[#84C65A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Scan ID</p>
              <p className="text-white text-sm font-mono font-medium">{scanId}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
            <Sprout className="w-4 h-4 text-[#84C65A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Growth Stage</p>
              <p className="text-white text-sm font-medium">{growthStage}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: 'rgba(132,198,90,0.08)', border: '1px solid rgba(132,198,90,0.15)' }}>
            <div className="w-4 h-4 flex-shrink-0 mt-0.5 text-lg leading-none">{selectedCrop.emoji}</div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Selected Crop</p>
              <p className="text-[#84C65A] text-sm font-medium">{selectedCrop.label}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Crop Distribution matching screenshot */}
      <GlassCard>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white text-sm font-semibold">Crop Distrib.</p>
            <p className="text-white/40 text-[10px]">Crop distribution for better yield planning</p>
          </div>
        </div>
        <div className="space-y-2 mt-2">
          {[
            { name: 'Corn', ha: '34.0 ha', pct: 65, color: '#84C65A' },
            { name: 'Wheat', ha: '30.5 ha', pct: 55, color: '#6BBF3A' },
            { name: 'Beans', ha: '12.3 ha', pct: 28, color: '#E9B949' },
            { name: 'Red Soil', ha: '20.0 ha', pct: 38, color: '#EF665B' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="w-16 text-xs text-white/70 font-medium truncate">{item.name}</div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, background: item.color }}
                />
              </div>
              <div className="text-[11px] text-white/40 font-mono w-14 text-right">{item.ha}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Soil Condition with circular K P N indicators */}
      <GlassCard>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white text-sm font-semibold">Soil Condition</p>
            <p className="text-white/40 text-[10px]">Know your soil before you plant</p>
          </div>
        </div>

        {/* Circular badges K, P, N */}
        <div className="flex items-center justify-around py-2 border-b border-white/5 mb-3">
          {[
            { key: 'K', label: 'Potassium', val: soilData.K, color: '#16A66A' },
            { key: 'P', label: 'Phosphorus', val: soilData.P, color: '#6BBF3A' },
            { key: 'N', label: 'Nitrogen', val: `${Math.round(soilData.N / 5)}%`, color: '#84C65A' },
          ].map((circle) => (
            <div key={circle.key} className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md border"
                style={{
                  background: `${circle.color}22`,
                  borderColor: `${circle.color}66`,
                  color: circle.color,
                }}
              >
                {circle.key}
              </div>
              <span className="text-white/60 text-[10px] mt-1 font-mono">{circle.val}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <SoilBar label="Nitrogen (N)" value={soilData.N} max={150} unit=" kg/ha" color="#84C65A" icon={Sprout} />
          <SoilBar label="pH Level" value={soilData.ph} max={14} unit="" color="#E9B949" icon={Droplets} />
          <SoilBar label="Temperature" value={soilData.temperature} max={50} unit="°C" color="#EF665B" icon={Thermometer} />
          <SoilBar label="Humidity" value={soilData.humidity} max={100} unit="%" color="#84C65A" icon={Wind} />
        </div>
      </GlassCard>

      {/* Decorative Plant Visual matching screenshot bottom right */}
      <GlassCard className="relative overflow-hidden pt-4 pb-2">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-wider text-[#84C65A]">Field Plant Ready</p>
            <p className="text-white/60 text-sm font-medium mt-0.5">{selectedCrop.label}</p>
            <p className="text-white/30 text-[10px] italic">{selectedCrop.scientific}</p>
          </div>
          <div className="text-3xl filter drop-shadow-[0_0_12px_rgba(132,198,90,0.5)]">
            🪴
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5 relative z-10">
          <span>AI Status: Active</span>
          <span className="text-[#84C65A] font-medium">99.4% Model Health</span>
        </div>
      </GlassCard>
    </div>
  )
}

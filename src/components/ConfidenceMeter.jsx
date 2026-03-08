import { motion } from 'framer-motion'
import { COLORS } from '../utils/constants'
import { scaleIn3D } from '../animations/motionVariants'

const RADIUS = 54
const STROKE = 8

export default function ConfidenceMeter({ value, label = 'Confidence', size = 'md', className = '' }) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0))

  const sizeMap = {
    sm: { r: 36, stroke: 6, text: 'text-lg' },
    md: { r: RADIUS, stroke: STROKE, text: 'text-2xl' },
    lg: { r: 72, stroke: 10, text: 'text-3xl' },
  }
  const { r, stroke, text } = sizeMap[size]
  const c = 2 * Math.PI * r
  const o = c - (clamped / 100) * c

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center perspective-3d ${className}`}
      variants={scaleIn3D}
      initial="initial"
      animate="animate"
      style={{ perspective: 800 }}
    >
      <svg width={r * 2 + stroke * 2} height={r * 2 + stroke * 2} className="rotate-[-90deg]">
        <circle
          cx={r + stroke}
          cy={r + stroke}
          r={r}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={r + stroke}
          cy={r + stroke}
          r={r}
          fill="none"
          stroke={COLORS.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: o }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold tabular-nums ${text}`}
          style={{ color: COLORS.primary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(clamped)}%
        </motion.span>
        {label && (
          <span className="text-xs font-medium text-slate-500 mt-0.5">{label}</span>
        )}
      </div>
    </motion.div>
  )
}

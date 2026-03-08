import { motion } from 'framer-motion'

function getNumericSeverityStyle(value) {
  if (value <= 0.3) {
    return {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    }
  }
  if (value <= 0.7) {
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-700',
      border: 'border-amber-200',
    }
  }
  return {
    bg: 'bg-red-500/15',
    text: 'text-red-700',
    border: 'border-red-200',
  }
}

function getLabelSeverityStyle(label) {
  const normalized = String(label || '').toUpperCase()

  if (normalized === 'SEVERE') {
    return {
      bg: 'bg-red-500/10',
      text: 'text-red-700',
      border: 'border-red-200',
      displayLabel: 'SEVERE',
    }
  }
  if (normalized === 'MODERATE') {
    return {
      bg: 'bg-orange-500/10',
      text: 'text-orange-700',
      border: 'border-orange-200',
      displayLabel: 'MODERATE',
    }
  }
  if (normalized === 'MILD') {
    return {
      bg: 'bg-lime-500/10',
      text: 'text-lime-700',
      border: 'border-lime-200',
      displayLabel: 'MILD',
    }
  }
  if (normalized === 'NORMAL') {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      displayLabel: 'NORMAL',
    }
  }

  return {
    bg: 'bg-slate-500/10',
    text: 'text-slate-700',
    border: 'border-slate-200',
    displayLabel: normalized || 'UNKNOWN',
  }
}

export default function SeverityBadge({ severity, showLabel = true, className = '' }) {
  const isNumeric = typeof severity === 'number' || !Number.isNaN(Number(severity))

  if (!severity && severity !== 0) {
    return null
  }

  if (isNumeric) {
    const value = Number(severity) ?? 0
    const percent = Math.round(value * 100)
    const style = getNumericSeverityStyle(value)

    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${style.bg} ${style.text} ${style.border} ${className}`}
      >
        {showLabel && <span className="opacity-80">Severity:</span>}
        <span>{percent}%</span>
      </motion.span>
    )
  }

  const { bg, text, border, displayLabel } = getLabelSeverityStyle(severity)

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bg} ${text} ${border} ${className}`}
    >
      {showLabel && <span className="opacity-80">Severity:</span>}
      <span className="tracking-wide">{displayLabel}</span>
    </motion.span>
  )
}

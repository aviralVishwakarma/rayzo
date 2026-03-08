import { motion } from 'framer-motion'

function getStatusStyle(status) {
  const normalized = String(status || '').toUpperCase()

  if (normalized === 'ANALYZED') {
    return {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'ANALYZED',
    }
  }
  if (normalized === 'REVIEWED') {
    return {
      bg: 'bg-purple-500/10',
      text: 'text-purple-700',
      border: 'border-purple-200',
      label: 'REVIEWED',
    }
  }
  if (normalized === 'PENDING') {
    return {
      bg: 'bg-slate-500/10',
      text: 'text-slate-700',
      border: 'border-slate-200',
      label: 'PENDING',
    }
  }

  return {
    bg: 'bg-slate-500/10',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: normalized || 'UNKNOWN',
  }
}

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null
  const style = getStatusStyle(status)

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className="opacity-80">Status:</span>
      <span className="tracking-wide">{style.label}</span>
    </motion.span>
  )
}


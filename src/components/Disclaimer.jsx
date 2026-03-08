import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { DISCLAIMER_TEXT, COLORS } from '../utils/constants'
import { flipInY } from '../animations/motionVariants'

export default function Disclaimer({ className = '' }) {
  return (
    <motion.div
      variants={flipInY}
      initial="initial"
      animate="animate"
      className={`flex items-start gap-3 p-4 rounded-xl border ${className}`}
      style={{
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
        color: '#991B1B',
      }}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
      <p className="text-sm font-medium leading-relaxed">{DISCLAIMER_TEXT}</p>
    </motion.div>
  )
}

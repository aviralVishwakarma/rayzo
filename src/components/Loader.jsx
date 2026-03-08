import { motion } from 'framer-motion'

export default function Loader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-14 h-14 border-[3px]',
  }

  return (
    <motion.div
      className={`rounded-full border-blue-200 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      role="status"
      aria-label="Loading"
    />
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { ROUTES } from '../utils/constants'

export default function NavbarProButton({ className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      <Link
        to={ROUTES.pricing}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
        }}
      >
        <Crown className="w-4 h-4" />
        PRO
      </Link>
    </motion.div>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ChevronRight } from 'lucide-react'
import { COLORS } from '../utils/constants'
import { card3D } from '../animations/motionVariants'

export default function ReportCard({ id, disease, confidence, date, thumbnail }) {
  const reportPath = `/reports/${id}`

  return (
    <motion.div
      className="perspective-3d"
      style={{ perspective: 1000 }}
      variants={card3D}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={reportPath}>
        <motion.article
          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 overflow-hidden transform-3d"
          style={{
            backgroundColor: COLORS.surfaceCard,
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="w-8 h-8" style={{ color: COLORS.primary }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate">{disease}</p>
            <p className="text-sm text-slate-500">
              {confidence}% confidence · {date}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </motion.article>
      </Link>
    </motion.div>
  )
}

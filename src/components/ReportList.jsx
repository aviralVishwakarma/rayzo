import { motion } from 'framer-motion'
import ReportCard from './ReportCard'
import { fadeInUp } from '../animations/motionVariants'
import Loader from './Loader'

export default function ReportList({ reports, loading, emptyMessage = 'No reports yet.' }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader size="lg" className="mb-4" />
        <p className="text-sm text-slate-500">Loading reports...</p>
      </div>
    )
  }

  if (!reports?.length) {
    return (
      <motion.div
        className="text-center py-16 text-slate-500"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {emptyMessage}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
    >
      {reports.map((report) => (
        <motion.div key={report.id} variants={fadeInUp}>
          <ReportCard
            id={report.id}
            disease={report.disease}
            confidence={report.confidence}
            date={report.date}
            thumbnail={report.thumbnail}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReportList from '../components/ReportList'
import { pageTransition, fadeInUp } from '../animations/motionVariants'

export default function Reports({ getReportsList }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getReportsList?.()
      .then((list) => {
        if (!cancelled) setReports(list || [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [getReportsList])

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-4xl mx-auto"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Previous reports</h1>
        <p className="text-slate-500 mt-1">Browse and open past X-ray analyses.</p>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ReportList
          reports={reports}
          loading={loading}
          emptyMessage="No reports yet. Upload an X-ray to get started."
        />
      </motion.div>
    </motion.div>
  )
}

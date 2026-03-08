import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, Calendar, Scan } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { card3D, fadeInUp, stagger } from '../animations/motionVariants'

export default function Dashboard({ user, getReportsList }) {
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

  const totalScans = reports.length
  const lastScan = reports[0]?.date ?? null

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(' ')[1] || user?.name || 'Doctor'}
          </h1>
          <p className="text-slate-500 mt-1">Here’s an overview of your activity.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-slate-200 p-5 flex items-center gap-4"
            style={{ backgroundColor: COLORS.surfaceCard }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <Scan className="w-6 h-6" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total scans</p>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? '—' : totalScans}
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-slate-200 p-5 flex items-center gap-4"
            style={{ backgroundColor: COLORS.surfaceCard }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <Calendar className="w-6 h-6" style={{ color: COLORS.primary }} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Last scan</p>
              <p className="text-lg font-semibold text-slate-800">
                {loading ? '—' : lastScan || 'No scans yet'}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick actions</h2>
          <div className="grid sm:grid-cols-2 gap-4 perspective-3d" style={{ perspective: 1000 }}>
            <motion.div variants={card3D} initial="rest" whileHover="hover" whileTap="tap" className="transform-3d">
              <Link
                to={ROUTES.upload}
                className="flex items-center gap-4 p-6 rounded-xl border-2 border-dashed border-slate-200 transition-colors block"
                style={{ backgroundColor: '#F0F4F8' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <Upload className="w-7 h-7" style={{ color: COLORS.primary }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">Upload New X-ray</p>
                  <p className="text-sm text-slate-500">Analyze a new chest X-ray image</p>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={card3D} initial="rest" whileHover="hover" whileTap="tap" className="transform-3d">
              <Link
                to={ROUTES.reports}
                className="flex items-center gap-4 p-6 rounded-xl border border-slate-200 transition-all block"
                style={{ backgroundColor: COLORS.surfaceCard }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <FileText className="w-7 h-7" style={{ color: COLORS.primary }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">View Reports</p>
                  <p className="text-sm text-slate-500">Browse previous analyses</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

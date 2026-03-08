import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, ArrowLeft } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import ImagePreview from '../components/ImagePreview'
import ConfidenceMeter from '../components/ConfidenceMeter'
import Disclaimer from '../components/Disclaimer'
import Loader from '../components/Loader'
import { ROUTES, COLORS } from '../utils/constants'
import { pageTransition, fadeInUp, button3D } from '../animations/motionVariants'

export default function ReportView({ getReportById }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [heatmapOn, setHeatmapOn] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!id) return
    getReportById?.(id)
      .then((data) => {
        if (!cancelled) setReport(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, getReportById])

  const handleDownload = () => {
    // Placeholder: in production would generate PDF or trigger download
    window.alert('Report download will be implemented when backend is connected.')
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="lg" className="mb-4" />
        <p className="text-slate-500">Loading report...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto text-center py-16">
        <p className="text-slate-500">Report not found.</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.reports)}
          className="mt-4 text-blue-600 font-medium hover:text-blue-700"
        >
          Back to reports
        </button>
      </div>
    )
  }

  const chartData = report.confidenceBreakdown?.map((item) => ({
    name: item.name,
    value: item.value,
  })) || []

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-5xl mx-auto"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.reports)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[320px]">
            {report.imageUrl ? (
              <ImagePreview src={report.imageUrl} alt="X-ray" className="min-h-[320px]" />
            ) : (
              <div className="min-h-[320px] flex items-center justify-center text-slate-500">
                X-ray image (placeholder)
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={heatmapOn}
                onChange={(e) => setHeatmapOn(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Show heatmap overlay</span>
            </label>
            {heatmapOn && (
              <span className="text-xs text-slate-500">Heatmap placeholder (backend required)</span>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Disease</p>
            <p className="text-2xl font-semibold text-slate-800">{report.disease}</p>
          </div>
          <ConfidenceMeter value={report.confidence} label="Confidence" size="lg" />
          {report.explanation && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">AI explanation</p>
              <p className="text-sm text-slate-600 leading-relaxed">{report.explanation}</p>
            </div>
          )}
          {chartData.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Confidence breakdown</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Confidence']} />
                    <Bar dataKey="value" radius={4}>
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? COLORS.primary : COLORS.accent}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <motion.button
            type="button"
            onClick={handleDownload}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.accent }}
            variants={button3D}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Download className="w-5 h-5" /> Download report
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Disclaimer />
      </motion.div>
    </motion.div>
  )
}

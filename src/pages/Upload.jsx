import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import UploadCard from '../components/UploadCard'
import ImagePreview from '../components/ImagePreview'
import ConfidenceMeter from '../components/ConfidenceMeter'
import Disclaimer from '../components/Disclaimer'
import { ROUTES, COLORS } from '../utils/constants'
import { fadeInUp, pageTransition, flipInY, button3D } from '../animations/motionVariants'

export default function Upload({ uploadAndAnalyze }) {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = useCallback(
    async (selectedFile) => {
      if (!selectedFile || !uploadAndAnalyze) return
      setFile(selectedFile)
      setResult(null)
      setError(null)
      setAnalyzing(true)
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 95))
      }, 200)
      try {
        const data = await uploadAndAnalyze(selectedFile)
        clearInterval(interval)
        setProgress(100)
        setResult(data)
      } catch (err) {
        clearInterval(interval)
        setError(err?.message || 'Analysis failed.')
      } finally {
        setAnalyzing(false)
      }
    },
    [uploadAndAnalyze]
  )

  const viewReport = useCallback(() => {
    if (result?.id) navigate(`/reports/${result.id}`)
  }, [result, navigate])

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-4xl mx-auto"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Upload X-ray</h1>
        <p className="text-slate-500 mt-1">Upload a chest X-ray image for AI analysis.</p>
      </motion.div>

      {!result ? (
        <>
          <motion.div variants={fadeInUp} className="mb-6">
            <UploadCard
              onFileSelect={handleFileSelect}
              disabled={analyzing}
              isAnalyzing={analyzing}
              progress={progress}
            />
          </motion.div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="result"
            variants={flipInY}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {result.imageUrl ? (
                  <ImagePreview src={result.imageUrl} alt="X-ray" className="min-h-[280px]" />
                ) : (
                  <div className="min-h-[280px] flex items-center justify-center text-slate-500">
                    Image preview
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Disease</p>
                  <p className="text-xl font-semibold text-slate-800">{result.disease}</p>
                </div>
                <ConfidenceMeter value={result.confidence} label="Confidence" size="md" />
                {result.explanation && (
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">AI explanation</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
                  </div>
                )}
                <motion.button
                  type="button"
                  onClick={viewReport}
                  className="w-full py-3 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: COLORS.accent }}
                  variants={button3D}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  View full report
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <motion.div variants={fadeInUp} className="mt-8">
        <Disclaimer />
      </motion.div>
    </motion.div>
  )
}

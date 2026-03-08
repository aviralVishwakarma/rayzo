import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileImage, X } from 'lucide-react'
import { COLORS } from '../utils/constants'
import Loader from './Loader'

export default function UploadCard({
  onFileSelect,
  disabled,
  isAnalyzing,
  progress = 0,
  className = '',
}) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isAnalyzing) setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [disabled, isAnalyzing])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (disabled || isAnalyzing) return
      const file = e.dataTransfer?.files?.[0]
      if (file && file.type.startsWith('image/')) {
        onFileSelect?.(file)
        const url = URL.createObjectURL(file)
        setPreview(url)
      }
    },
    [disabled, isAnalyzing, onFileSelect]
  )

  const handleChange = useCallback(
    (e) => {
      const file = e.target?.files?.[0]
      if (file && file.type.startsWith('image/')) {
        onFileSelect?.(file)
        const url = URL.createObjectURL(file)
        setPreview(url)
      }
    },
    [onFileSelect]
  )

  const clearPreview = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }, [preview])

  return (
    <motion.div
      className={`rounded-2xl border-2 border-dashed overflow-hidden transition-colors ${className}`}
      style={{
        borderColor: dragActive ? COLORS.primary : '#E2E8F0',
        backgroundColor: dragActive ? '#EFF6FF' : COLORS.surface,
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {preview && !isAnalyzing ? (
        <div className="relative p-4">
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/90 shadow text-slate-600 hover:bg-white hover:text-slate-900 z-10"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded-xl bg-slate-100"
          />
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center min-h-[240px] p-8 cursor-pointer ${
            disabled || isAnalyzing ? 'pointer-events-none opacity-70' : ''
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader size="lg" className="mb-4" />
              <p className="text-sm font-medium text-slate-600">Analyzing X-ray...</p>
              <div className="mt-3 w-full max-w-xs h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.primary}14` }}
              >
                <Upload className="w-8 h-8" style={{ color: COLORS.primary }} />
              </div>
              <p className="text-slate-700 font-medium mb-1">Drop X-ray image here</p>
              <p className="text-sm text-slate-500 mb-4">or click to browse</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </>
          )}
        </label>
      )}
    </motion.div>
  )
}

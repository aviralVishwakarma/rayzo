import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

export default function ImagePreview({ src, alt = 'X-ray', className = '' }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 3)), [])
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.5)), [])
  const reset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }, [position])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[200px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="flex items-center justify-center origin-center transition-transform will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-white/90 backdrop-blur shadow-lg border border-slate-200">
        <button
          type="button"
          onClick={zoomOut}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-slate-600 min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

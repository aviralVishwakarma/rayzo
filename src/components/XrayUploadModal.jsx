import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function XrayUploadModal({
  open,
  onClose,
  onUpload,
  patient,
  loading = false,
}) {
  const fileInputRef = useRef(null)
  const [fileError, setFileError] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')

  const handleFileChange = (event) => {
    setFileError('')
    const file = event.target.files?.[0]
    if (!file) {
      setSelectedFileName('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, JPEG).')
      setSelectedFileName('')
      return
    }

    setSelectedFileName(file.name)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!fileInputRef.current?.files?.[0]) {
      setFileError('Please select an X-ray image to upload.')
      return
    }
    setFileError('')
    onUpload?.(fileInputRef.current.files[0])
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Upload X-ray
                </h2>
                {patient && (
                  <p className="text-xs text-slate-500 mt-1">
                    Patient: <span className="font-medium">{patient.fullName || patient.name}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm"
                onClick={onClose}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  X-ray image
                </label>
                <div
                  className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-50/60"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  <p className="text-xs text-slate-600 text-center">
                    Click to select a chest X-ray image (PNG, JPG, JPEG).
                  </p>
                  {selectedFileName && (
                    <p className="text-xs font-medium text-slate-800 mt-1">
                      Selected: {selectedFileName}
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {fileError && (
                  <p className="mt-2 text-xs text-red-600">
                    {fileError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading ? 'Uploading...' : 'Upload X-ray'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


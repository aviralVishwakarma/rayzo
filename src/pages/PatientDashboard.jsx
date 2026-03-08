import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan, User, FileText } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { fadeInUp, stagger, card3D } from '../animations/motionVariants'
import api from '../services/api'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName') || 'Patient'
  const [hasDoctor, setHasDoctor] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .get('/user/my-profile')
      .then((res) => {
        if (!cancelled) {
          setHasDoctor(!!res.data?.doctorId)
        }
      })
      .catch(() => {
        if (!cancelled) setHasDoctor(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Welcome, {fullName}
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Upload X-ray images and receive AI-assisted medical analysis.
              Get quick insights and connect with your doctor for follow-up care.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <motion.div
              variants={card3D}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="perspective-3d transform-3d"
            >
              <button
                onClick={() => navigate(ROUTES.patientProfile)}
                className="w-full p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 backdrop-blur shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4"
                style={{ minHeight: '180px' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <Scan className="w-10 h-10" style={{ color: COLORS.primary }} />
                </div>
                <span className="text-xl font-semibold text-slate-800">
                  Scan / Upload X-ray
                </span>
                <span className="text-sm text-slate-500 text-center">
                  Go to your profile to upload a new chest X-ray for AI analysis.
                </span>
              </button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                variants={fadeInUp}
                onClick={() => navigate(ROUTES.patientProfile)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <User className="w-6 h-6" style={{ color: COLORS.primary }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">View Profile</p>
                  <p className="text-xs text-slate-500">Manage your info & doctor</p>
                </div>
              </motion.button>

              <motion.button
                variants={fadeInUp}
                onClick={() => navigate(ROUTES.patientResults)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <FileText className="w-6 h-6" style={{ color: COLORS.primary }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">View Results</p>
                  <p className="text-xs text-slate-500">AI results & doctor notes</p>
                </div>
              </motion.button>
            </div>

            {!hasDoctor && (
              <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                Assign a doctor in your profile to enable X-ray uploads and detailed AI reports.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, User } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { fadeInUp, stagger, card3D } from '../animations/motionVariants'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem('fullName') || 'Doctor'

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
              Review patient submissions sorted by AI severity.
              Prioritize high-risk cases and provide expert analysis.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <motion.button
              variants={card3D}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(ROUTES.doctorRequests)}
              className="w-full p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 backdrop-blur shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4 perspective-3d transform-3d"
              style={{ minHeight: '140px' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#EFF6FF' }}
              >
                <ClipboardList className="w-8 h-8" style={{ color: COLORS.primary }} />
              </div>
              <span className="text-xl font-semibold text-slate-800">
                View Requests
              </span>
            </motion.button>

            <motion.button
              variants={fadeInUp}
              onClick={() => navigate(ROUTES.doctorProfile)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#EFF6FF' }}
              >
                <User className="w-6 h-6" style={{ color: COLORS.primary }} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800">View Profile</p>
                <p className="text-sm text-slate-500">Manage your professional info</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

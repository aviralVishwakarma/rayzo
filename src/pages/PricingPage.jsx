import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, ArrowLeft } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import PlanCard from '../components/PlanCard'
import Footer from '../components/Footer'
import NavbarProButton from '../components/NavbarProButton'

const plans = [
  {
    name: 'Patient Plan',
    price: 'Minimal Fee',
    priceSuffix: '',
    description:
      'Patients do not have a fixed subscription. The consultation fee is determined by the consulting doctor, government regulations, and hospital policies. Government hospitals may set very low regulated fees.',
    features: [
      'Upload X-ray images',
      'AI fracture detection',
      'Doctor-reviewed diagnosis',
      'Access medical report',
      'Secure patient records',
    ],
    buttonText: 'Use as Patient',
    isPopular: false,
    accentColor: '#059669',
  },
  {
    name: 'Doctor Plan',
    price: '₹2,000',
    priceSuffix: '/ month',
    description:
      'For individual doctors who want to use the AI fracture detection system in their clinic.',
    features: [
      'Unlimited patient checkups',
      'Upload and analyze X-ray images',
      'AI fracture detection with heatmap visualization',
      'Access patient reports',
      'Write clinician notes',
      'Patient history tracking',
      'Secure cloud storage',
    ],
    buttonText: 'Get Doctor Plan',
    isPopular: true,
    accentColor: COLORS.primary,
  },
  {
    name: 'Hospital / Enterprise',
    price: '₹1,000',
    priceSuffix: '/ doctor / month',
    description:
      'Designed for hospitals and institutions. Minimum 5 doctors must register. Example: 5 Doctors = ₹5,000 per month.',
    features: [
      'All Doctor Plan features',
      'Multi-doctor account management',
      'Shared patient database',
      'Hospital dashboard',
      'Centralized reports',
      'Priority support',
    ],
    buttonText: 'Register Hospital',
    isPopular: false,
    accentColor: '#7C3AED',
  },
]

export default function PricingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex flex-col">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${COLORS.primaryLight}55 0%, transparent 70%)`,
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: `radial-gradient(circle, #7C3AED44 0%, transparent 70%)`,
          }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={ROUTES.home} className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-800 text-lg">Rayzo</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={ROUTES.register}
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  Get started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Choose Your{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight}, #7C3AED)`,
              }}
            >
              Plan
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Whether you're a patient seeking affordable diagnosis, a doctor running a clinic,
            or a hospital managing multiple departments — we have the right plan for you.
          </p>
        </motion.div>

        {/* Plan cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-400 mt-16"
        >
          All plans include SSL encryption, HIPAA-compliant storage, and 24/7 uptime monitoring.
        </motion.p>
      </main>

      <Footer />
    </div>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, ScanSearch, FileCheck, Shield } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { fadeInUp, stagger, float3D, button3D, card3D } from '../animations/motionVariants'
import Footer from "../components/Footer"
import NavbarProButton from '../components/NavbarProButton'
import lungs from "../images/lungs.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-red-50/20">
      {/* Animated gradient overlays – blue & red medical theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, ${COLORS.primaryLight}44 0%, transparent 70%)`,
          }}
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${COLORS.accent}33 0%, transparent 70%)`,
          }}
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

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
              <NavbarProButton />
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <motion.div variants={button3D} initial="rest" whileHover="hover" whileTap="tap">
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">

        {/* ================= HERO SECTION ================= */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT VISUAL (BIGGER NOW) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center order-1 lg:order-1 px-4 sm:px-0"
          >
            <div className="relative w-full max-w-md sm:max-w-lg h-[420px] sm:h-[480px] rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl flex items-center justify-center">

              {/* Bigger Lung Image */}
              <img
                src="/images/lungs.png"
                alt="Rayzo lung X-ray analysis"
                className="w-full max-w-xs sm:max-w-sm opacity-95"
              />

              {/* Disease Indicators */}
              <div className="absolute top-8 left-8 bg-white shadow-lg px-5 py-3 rounded-xl text-sm">
                Pneumonia
                <div className="font-semibold text-blue-600">87% Confidence</div>
              </div>

              <div className="absolute bottom-10 right-8 bg-white shadow-lg px-5 py-3 rounded-xl text-sm">
                Effusion
                <div className="font-semibold text-red-500">42% Confidence</div>
              </div>

              <div className="absolute bottom-16 left-10 bg-white shadow-lg px-5 py-3 rounded-xl text-sm">
                Atelectasis
                <div className="font-semibold text-purple-600">65% Confidence</div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT TEXT CONTENT */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-xl order-2 lg:order-2"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
            >
              AI-Powered Lung
              <span className="block" style={{ color: COLORS.primary }}>
                X-Ray Intelligence
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-slate-600"
            >
              Detect pneumonia and other lung diseases instantly
              with AI-generated confidence scoring and structured medical reports.
              Built for both doctors and patients.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
              <motion.div variants={button3D} initial="rest" whileHover="hover" whileTap="tap">
                <Link
                  to={ROUTES.register}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-white font-semibold shadow-lg text-sm sm:text-base"
                  style={{ backgroundColor: COLORS.accent }}
                  aria-label="Start analyzing X-ray images with Rayzo"
                >
                  Start Analyzing
                </Link>
              </motion.div>

              <Link
                to={ROUTES.login}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100 transition text-sm sm:text-base"
              >
                Log in
              </Link>
            </motion.div>
          </motion.div>

        </section>

        {/* ================= ROLE SECTION ================= */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-14 text-slate-900">
            Built for Doctors & Patients
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

            {/* Doctor */}
            <motion.div
              variants={card3D}
              initial="rest"
              whileHover="hover"
              className="p-8 rounded-3xl border border-slate-200 shadow-sm"
              style={{ backgroundColor: COLORS.surfaceCard }}
            >
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                👨‍⚕️ Doctor Dashboard
              </h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Upload and analyze chest X-rays</li>
                <li>• View AI confidence scoring</li>
                <li>• Access full patient history</li>
                <li>• Generate structured diagnostic reports</li>
              </ul>
            </motion.div>

            {/* Patient */}
            <motion.div
              variants={card3D}
              initial="rest"
              whileHover="hover"
              className="p-8 rounded-3xl border border-slate-200 shadow-sm"
              style={{ backgroundColor: COLORS.surfaceCard }}
            >
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                👩‍⚕️ Patient Portal
              </h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• View personal lung scan reports</li>
                <li>• Track historical analysis</li>
                <li>• Download AI results securely</li>
                <li>• Monitor lung health trends</li>
              </ul>
            </motion.div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <>
        {/* your landing content */}

        <Footer />
      </>
    </div>
  )
}

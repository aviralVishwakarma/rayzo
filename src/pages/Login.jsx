import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Stethoscope, Loader2 } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { pageTransition, flipInY, button3D } from '../animations/motionVariants'
import api from "../services/api";
import { Link, useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/log-in', { email, password })
      const data = res.data

      const token = data.token
      const fullName = data.fullName ?? data.user?.fullName ?? 'User'
      const role = data.role ?? data.user?.role ?? 'PATIENT'

      localStorage.setItem('token', token)
      localStorage.setItem('fullName', fullName)
      localStorage.setItem('role', role)

      if (onLogin) {
        onLogin({ token, fullName, role })
      } else {
        if (role === 'PATIENT') {
          navigate('/patient/dashboard', { replace: true })
        } else if (role === 'DOCTOR') {
          navigate('/doctor/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-red-50/20 p-4">
      <motion.div
        className="w-full max-w-md"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="text-center mb-8">
          <Link to={ROUTES.home} className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-lg">
              Rayzo
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-800">Log in</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sign in using your registered email
          </p>
        </div>

        <motion.div
          className="rounded-2xl border border-slate-200 p-8 shadow-lg transform-3d"
          style={{
            backgroundColor: COLORS.surfaceCard,
            backfaceVisibility: 'hidden'
          }}
          variants={flipInY}
          initial="initial"
          animate="animate"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xyz@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: COLORS.accent }}
              variants={button3D}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{' '}
            <Link
              to={ROUTES.register}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
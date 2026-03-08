import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { Stethoscope, Loader2 } from 'lucide-react'
import axios from 'axios'
import { ROUTES, COLORS } from '../utils/constants'
import { pageTransition, flipInY, button3D } from '../animations/motionVariants'

export default function Register() {
  const [role, setRole] = useState('PATIENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    gender: "MALE",
    dob: "",
    bloodGroup: "",
    specialization: "",
    licenceNumber: "",
    hospitalName: "",
    experience: "",
    phone: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role
      }

      if (role === "PATIENT") {
        payload = {
          ...payload,
          age: Number(formData.age),
          gender: formData.gender,
          dob: formData.dob,
          bloodGroup: formData.bloodGroup
        }
      }

      if (role === "DOCTOR") {
        payload = {
          ...payload,
          specialization: formData.specialization,
          licenceNumber: formData.licenceNumber,
          hospitalName: formData.hospitalName,
          experience: Number(formData.experience),
          phone: formData.phone
        }
      }

      await api.post('/auth/register', payload)

      alert('Registration Successful!')
    } catch (err) {
      setError(err?.response?.data || 'Registration failed')
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
        {/* Header */}
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

          <h1 className="text-2xl font-bold text-slate-800">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Register as a Doctor or Patient
          </p>
        </div>

        {/* Card */}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* ROLE SELECTOR */}
            <div className="flex gap-3">
              {['PATIENT', 'DOCTOR'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                    role === r
                      ? 'text-white'
                      : 'border-slate-300 text-slate-600'
                  }`}
                  style={
                    role === r
                      ? { backgroundColor: COLORS.accent }
                      : {}
                  }
                >
                  {r}
                </button>
              ))}
            </div>

            {/* COMMON FIELDS */}
            <input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />

            {/* PATIENT FIELDS */}
            {role === 'PATIENT' && (
              <>
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  onChange={handleChange}
                  required
                  className="input-style w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <select
                  name="gender"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>

                <input
                  name="dob"
                  type="date"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <input
                  name="bloodGroup"
                  placeholder="Blood Group (B+)"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </>
            )}

            {/* DOCTOR FIELDS */}
            {role === 'DOCTOR' && (
              <>
                <input
                  name="specialization"
                  placeholder="Specialization"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <input
                  name="licenceNumber"
                  placeholder="Licence Number"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <input
                  name="hospitalName"
                  placeholder="Hospital Name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <input
                  name="experience"
                  type="number"
                  placeholder="Years of Experience"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </>
            )}

            {/* SUBMIT BUTTON */}
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
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to={ROUTES.login}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
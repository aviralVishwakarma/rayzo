import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { getMyProfile } from '../services/fakeApi'
import { fadeInUp, stagger } from '../animations/motionVariants'

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500 mb-0.5">{label}</p>
    <p className="font-medium text-slate-800">{value ?? '—'}</p>
  </div>
)

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await api.get('/user/my-profile')
        if (!cancelled) setProfile(res.data)
      } catch (err) {
        try {
          const mock = await getMyProfile('DOCTOR')
          if (!cancelled) setProfile(mock)
        } catch {
          if (!cancelled) {
            setError(err.response?.data?.message || 'Failed to load profile')
            setProfile(null)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profileData = profile || {}

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Profile</h1>
          <p className="text-slate-500 mt-1">Your professional information</p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 lg:p-8 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileItem label="Full Name" value={profileData.fullName} />
            <ProfileItem label="Email" value={profileData.email} />
            <ProfileItem label="Specialization" value={profileData.specialization} />
            <ProfileItem label="Licence Number" value={profileData.licenceNumber} />
            <ProfileItem label="Hospital" value={profileData.hospitalName} />
            <ProfileItem label="Experience" value={profileData.experience} />
            <ProfileItem label="Phone" value={profileData.phone} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

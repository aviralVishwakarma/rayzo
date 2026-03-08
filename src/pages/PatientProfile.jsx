import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { fadeInUp, stagger } from '../animations/motionVariants'
import { uploadXrayWithPendingResult } from '../services/patientClient'

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500 mb-0.5">{label}</p>
    <p className="font-medium text-slate-800">{value ?? '—'}</p>
  </div>
)

export default function PatientProfile() {
  const [profile, setProfile] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDoctors, setShowDoctors] = useState(false)
  const [selectingDoctor, setSelectingDoctor] = useState(null)
  const [removingDoctor, setRemovingDoctor] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const fileInputRef = useRef(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/user/my-profile')
      setProfile(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    setShowDoctors(true)
    try {
      const res = await api.get('/patient/get-all-doctor')
      setDoctors(res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors')
      setDoctors([])
    }
  }

  const selectDoctor = async (doctorId) => {
    setSelectingDoctor(doctorId)
    setError('')
    setSuccess('')
    try {
      await api.post(`/patient/select-doctor/${doctorId}`)
      await fetchProfile()
      setShowDoctors(false)
      setSuccess('Doctor assigned successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to select doctor')
    } finally {
      setSelectingDoctor(null)
    }
  }

  const removeDoctor = async () => {
    setRemovingDoctor(true)
    setError('')
    setSuccess('')
    try {
      await api.delete('/patient/remove-doctor')
      await fetchProfile()
      setSuccess('Doctor removed successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove doctor')
    } finally {
      setRemovingDoctor(false)
    }
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null)
    setUploadError('')
    setUploadSuccess('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile || !profile?.doctorId) return

    setUploading(true)
    setUploadError('')
    setUploadSuccess('')

    try {
      await uploadXrayWithPendingResult(selectedFile)
      setUploadSuccess('X-ray uploaded successfully.')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload X-ray')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
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
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profileData = profile || {}
  const hasDoctor = !!profileData.doctorId
  console.log(profileData.fullName)
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl font-bold text-slate-800">Patient Profile</h1>
          <p className="text-slate-500 mt-1">Your personal and medical information</p>
        </motion.div>

        {error && profile && (
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
          >
            <p className="text-sm font-medium">{success}</p>
          </motion.div>
        )}

        <motion.div
          variants={fadeInUp}
          className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 lg:p-8 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileItem label="Full Name" value={profileData.fullName} />
            <ProfileItem label="Email" value={profileData.email} />
            <ProfileItem label="Role" value={profileData.role} />
            <ProfileItem label="Age" value={profileData.age} />
            <ProfileItem label="Gender" value={profileData.gender} />
            <ProfileItem label="Blood Group" value={profileData.bloodGroup} />
            <ProfileItem label="Phone" value={profileData.phone} />
            <ProfileItem label="Doctor" value={hasDoctor ? 'Assigned' : 'Not assigned'} />
          </div>

          {hasDoctor ? (
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Assigned Doctor</h2>
                  <p className="text-sm text-slate-500">
                    Your scans and reports will be reviewed by your assigned doctor.
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Doctor ID: <span className="font-medium">{profileData.doctorId}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeDoctor}
                  disabled={removingDoctor}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60"
                >
                  {removingDoctor ? 'Removing...' : 'Remove Doctor'}
                </button>
              </div>

              <form onSubmit={handleUpload} className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload X-ray</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Upload your chest X-ray image for AI-assisted analysis. Only your assigned doctor
                  can review the results.
                </p>

                {uploadError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {uploadSuccess}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={!selectedFile || uploading || !hasDoctor}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                  >
                    {uploading && (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload X-ray'}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Supported formats: JPG, PNG and other standard image formats exported from X-ray
                  systems.
                </p>
              </form>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Select Doctor</h2>
              <p className="text-slate-500 text-sm mb-4">
                You don&apos;t have an assigned doctor yet. Choose one from the list below to enable
                X-ray uploads and detailed analysis.
              </p>
              <button
                type="button"
                onClick={fetchDoctors}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Choose Doctor
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Doctor Selection Modal */}
      {showDoctors && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDoctors(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Select a Doctor</h2>
            <div className="space-y-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm text-slate-500">Specialization: {doc.specialization}</p>
                    <p className="text-sm text-slate-500">Hospital: {doc.hospitalName}</p>
                    <p className="text-sm text-slate-500">Experience: {doc.experience}</p>
                    <p className="text-sm text-slate-500">Phone: {doc.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectDoctor(doc.id)}
                    disabled={selectingDoctor === doc.id}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-70 shrink-0"
                  >
                    {selectingDoctor === doc.id ? 'Selecting...' : 'Select Doctor'}
                  </button>
                </div>
              ))}
              {doctors.length === 0 && (
                <p className="text-sm text-slate-500">No doctors are available at the moment.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowDoctors(false)}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

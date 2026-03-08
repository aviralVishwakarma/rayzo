import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getDoctorMyPatients,
  getDoctorPatientReport,
  uploadDoctorXray,
} from '../services/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import XrayUploadModal from '../components/XrayUploadModal'
import { fadeInUp, stagger } from '../animations/motionVariants'

function getSeverityPillClasses() {
  return 'inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold border border-slate-200'
}

function PatientCard({ patient, onViewReport, onUploadClick }) {
  const hasReport = !!patient.report
  const severityLabel = patient.report?.severity
  const status = patient.report?.status

  return (
    <motion.div
      variants={fadeInUp}
      className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-lg hover:shadow-xl hover:border-slate-300 transition-all p-4 flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-800">
            {patient.fullName || patient.name}
          </span>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            {patient.age != null && <span>Age: {patient.age}</span>}
            {patient.gender && <span>Gender: {patient.gender}</span>}
            {patient.bloodGroup && <span>Blood Group: {patient.bloodGroup}</span>}
            {patient.phone && <span>Phone: {patient.phone}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[160px]">
          {hasReport ? (
            <div className="flex flex-col items-end gap-2">
              <SeverityBadge severity={severityLabel} />
              <StatusBadge status={status || 'PENDING'} />
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <span className={getSeverityPillClasses()}>
                <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5" />
                X-ray not uploaded
              </span>
              <StatusBadge status="PENDING" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={() => onViewReport(patient.id)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          View report
        </button>
        {!hasReport && (
          <button
            type="button"
            onClick={() => onUploadClick(patient)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            Upload X-ray
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function DoctorRequests() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadingPatient, setUploadingPatient] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    window.clearTimeout(showToast._timeoutId)
    showToast._timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  const loadPatients = async () => {
    setLoading(true)
    setError('')
    try {
      const basePatients = await getDoctorMyPatients()

      const patientsWithReports = await Promise.all(
        (basePatients || []).map(async (p) => {
          try {
            const report = await getDoctorPatientReport(p.id)
            return { ...p, report }
          } catch (err) {
            if (err?.response?.status === 404) {
              return { ...p, report: null }
            }
            return { ...p, report: null, reportError: true }
          }
        }),
      )

      setPatients(patientsWithReports)
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to load patients. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    loadPatients().catch(() => {
      if (!cancelled) {
        setError('Failed to load patients. Please try again.')
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleXrayUpload = async (file) => {
    if (!uploadingPatient || !file) return
    setUploading(true)
    try {
      await uploadDoctorXray(uploadingPatient.id, file)
      showToast('success', 'X-ray uploaded successfully. Report is being generated.')
      setUploadingPatient(null)
      await loadPatients()
    } catch (err) {
      showToast(
        'error',
        err?.response?.data?.message || 'Failed to upload X-ray. Please try again.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed inset-x-0 top-20 z-40 flex justify-center pointer-events-none">
          <div
            className={`pointer-events-auto rounded-full px-4 py-2 text-xs font-medium shadow-lg border ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl font-bold text-slate-800">Patient Requests</h1>
          <p className="text-slate-500 mt-1">
            Assigned patients, sorted by AI severity. Patients without X-ray appear last.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-500">Loading patients...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-medium">{error}</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-12 text-center">
            <p className="text-slate-500">No patient requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patients.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onViewReport={(id) => navigate(`/doctor/report/${id}`)}
                onUploadClick={setUploadingPatient}
              />
            ))}
          </div>
        )}
      </motion.div>

      <XrayUploadModal
        open={!!uploadingPatient}
        onClose={() => (uploading ? null : setUploadingPatient(null))}
        onUpload={handleXrayUpload}
        patient={uploadingPatient}
        loading={uploading}
      />
    </div>
  )
}

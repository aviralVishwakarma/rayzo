import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import {
  getDoctorPatientDetails,
  getDoctorPatientReport,
  updateDoctorReport,
} from '../services/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import BlockchainVerification from '../components/BlockchainVerification'
import { fadeInUp, stagger } from '../animations/motionVariants'
import '../styles/DoctorReport.css'

const formatDateTime = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export default function DoctorReport() {
  const { patientId } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const [diagnosis, setDiagnosis] = useState('')
  const [doctorNotes, setDoctorNotes] = useState('')
  const [status, setStatus] = useState('PENDING')
  const diagnosisTrimmed = diagnosis.trim()
  const canAnalyze = diagnosisTrimmed.length > 0

  const aiResult = report?.aiResult || report?.aiInsights || {}

  const visualAnalysis = aiResult?.visual_analysis || aiResult?.visualAnalysis || {}

  const toImageSrc = (raw) => {
    if (typeof raw !== 'string' || raw.length === 0) return null
    if (raw.startsWith('data:image/')) return raw
    return `data:image/png;base64,${raw}`
  }

  const detectedDiseases = useMemo(() => {
    if (Array.isArray(report?.detectedDiseases)) return report.detectedDiseases
    if (Array.isArray(aiResult?.detectedDiseases)) return aiResult.detectedDiseases
    return []
  }, [report, aiResult])

  const probabilities = useMemo(() => {
    if (report?.probabilities && typeof report.probabilities === 'object') {
      return report.probabilities
    }
    if (aiResult?.probabilities && typeof aiResult.probabilities === 'object') {
      return aiResult.probabilities
    }
    return null
  }, [report, aiResult])

  const handleShowToast = (type, message) => {
    setToast({ type, message })
    window.clearTimeout(handleShowToast._timeoutId)
    handleShowToast._timeoutId = window.setTimeout(() => setToast(null), 3500)
  }

  const loadData = async () => {
    if (!patientId) return
    setLoading(true)
    setError('')

    try {
      const [patientRes, reportRes] = await Promise.allSettled([
        getDoctorPatientDetails(patientId),
        getDoctorPatientReport(patientId),
      ])

      if (patientRes.status === 'fulfilled') {
        setPatient(patientRes.value)
      }

      if (reportRes.status === 'fulfilled') {
        const r = reportRes.value
        setReport(r)
        const nextDiagnosis = r.diagnosis || ''
        setDiagnosis(nextDiagnosis)
        setDoctorNotes(r.doctorNotes || '')
        setStatus(r.status || 'PENDING')
      } else if (reportRes.reason?.response?.status === 404) {
        setReport(null)
      }

      if (patientRes.status === 'rejected' && reportRes.status === 'rejected') {
        throw new Error('Unable to load patient or report.')
      }
    } catch (err) {
      setError(err?.message || 'Failed to load report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  const handleSave = async (event) => {
    event.preventDefault()
    if (!report?.reportId) return
    setSaving(true)
    try {
      await updateDoctorReport(report.reportId, {
        diagnosis,
        doctorNotes,
        status,
      })
      handleShowToast('success', 'Report updated successfully.')
      await loadData()
    } catch (err) {
      handleShowToast(
        'error',
        err?.response?.data?.message || 'Failed to update report. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="doctor-report-loading">
        <div className="doctor-report-loading-spinner w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="doctor-report-loading-text text-sm">Loading report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="doctor-report-error-container">
        <div className="doctor-report-error-back">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="doctor-report-error-back-btn"
          >
            <ArrowLeft className="doctor-report-back-icon" />
            Back
          </button>
        </div>
        <div className="doctor-report-error-card">
          <p className="doctor-report-error-text">
            {error}
          </p>
        </div>
      </div>
    )
  }

  const hasReport = !!report

  const gradcamBase =
    visualAnalysis.gradcam ??
    visualAnalysis.gradCam ??
    aiResult?.gradcam ??
    aiResult?.heatmap ??
    report?.gradcamImage ??
    report?.gradcam ??
    null

  const lungSegmentationBase =
    visualAnalysis.lung_segmentation ??
    visualAnalysis.lungSegmentation ??
    aiResult?.lung_segmentation ??
    aiResult?.lungSegmentation ??
    null

  const ribEdgesBase =
    visualAnalysis.rib_edges ??
    visualAnalysis.ribEdges ??
    aiResult?.rib_edges ??
    aiResult?.ribEdges ??
    null

  const visualCards = [
    {
      key: 'gradcam',
      title: 'GradCAM Heatmap',
      alt: 'GradCAM heatmap',
      src: toImageSrc(gradcamBase),
    },
    {
      key: 'lung_segmentation',
      title: 'Lung Segmentation',
      alt: 'Lung segmentation overlay',
      src: toImageSrc(lungSegmentationBase),
    },
    {
      key: 'rib_edges',
      title: 'Rib Edge Detection',
      alt: 'Rib edge detection overlay',
      src: toImageSrc(ribEdgesBase),
    },
  ].filter((card) => !!card.src)

  const hasVisualAnalysis = visualCards.length > 0

  const voiceReport = report?.voiceReport

  return (
    <div className="doctor-report-page">
      {toast && (
        <div className="doctor-report-toast-container">
          <div
            className={`doctor-report-toast ${toast.type === 'success'
                ? 'doctor-report-toast-success'
                : 'doctor-report-toast-error'
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <motion.div
        className="doctor-report-main"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <header className="doctor-report-header">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="doctor-report-header-back-btn"
          >
            <ArrowLeft className="doctor-report-back-icon" />
            Back to patients
          </button>
        </header>

        <motion.section
          className="doctor-report-summary-card"
          variants={fadeInUp}
        >
          <div className="doctor-report-summary-header">
            <div>
              <h1 className="doctor-report-summary-title">
                Rayzo Radiology Report
              </h1>
              <p className="doctor-report-summary-subtitle">
                Project / Hospital: Rayzo AI Chest X-ray Screening
              </p>
            </div>
            {hasReport && (
              <div className="flex flex-col items-end gap-1 text-right text-xs">
                <span className="text-slate-500">
                  Report ID:{' '}
                  <span className="font-semibold text-slate-800">
                    {report.reportId || '—'}
                  </span>
                </span>
                <span className="text-slate-500">
                  Generated:{' '}
                  <span className="font-semibold text-slate-800">
                    {formatDateTime(report.generatedAt || report.createdAt)}
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="doctor-report-patient-grid">
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Full name
              </span>
              <span className="doctor-report-patient-value">
                {patient?.fullName || patient?.name || '—'}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Email
              </span>
              <span className="doctor-report-patient-value">
                {patient?.email || '—'}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Age
              </span>
              <span className="doctor-report-patient-value">
                {patient?.age != null ? patient.age : '—'}
              </span>
            </div>

            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Blood group
              </span>
              <span className="doctor-report-patient-value">
                {patient?.bloodGroup || '—'}
              </span>
            </div>

          </div>
        </motion.section>

        <section className="doctor-report-layout">
          <motion.div
            className="doctor-report-gradcam-card"
            variants={fadeInUp}
          >
            <h2 className="doctor-report-gradcam-title text-2xl font-bold mb-6 text-slate-800">AI Visual Analysis</h2>
            {hasVisualAnalysis ? (
              <div className="flex flex-col">
                {visualCards.map((card) => (
                  <div key={card.key} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="text-xl font-semibold text-slate-800">{card.title}</h3>
                    <img
                      src={card.src}
                      alt={card.alt}
                      style={{
                        width: '100%',
                        maxWidth: '900px',
                        height: 'auto',
                        borderRadius: '10px',
                        marginTop: '20px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 mt-4">
                <p className="text-slate-500">
                  No AI visual analysis available for this report.
                </p>
              </div>
            )}
            {voiceReport && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  AI voice summary
                </span>
                <audio
                  className="w-full"
                  controls
                >
                  <source
                    src={`data:audio/mp3;base64,${voiceReport}`}
                    type="audio/mp3"
                  />
                </audio>
              </div>
            )}
          </motion.div>

          <motion.div
            className="doctor-report-right-column"
            variants={stagger}
          >
            <motion.section
              className="doctor-report-findings-card"
              variants={fadeInUp}
            >
              <h2 className="doctor-report-findings-title">
                AI findings
              </h2>

              {hasReport ? (
                <div className="doctor-report-findings-body">
                  <div className="doctor-report-findings-status-row">
                    <div className="doctor-report-findings-field">
                      <span className="doctor-report-findings-label text-xs">
                        Severity
                      </span>
                      <div className="flex items-center gap-2">
                        {report.severity ? (
                          <SeverityBadge severity={report.severity} />
                        ) : (
                          <span className="text-sm text-slate-700">—</span>
                        )}
                      </div>
                    </div>
                    <div className="doctor-report-findings-field">
                      <span className="doctor-report-findings-label text-xs">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        {report.status ? (
                          <StatusBadge status={report.status} />
                        ) : (
                          <span className="text-sm text-slate-700">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {detectedDiseases.length > 0 && (
                    <div className="doctor-report-diseases">
                      <span className="doctor-report-diseases-label text-xs">
                        Detected diseases
                      </span>
                      <div className="doctor-report-diseases-list">
                        {detectedDiseases.map((d) => (
                          <span
                            key={d}
                            className="doctor-report-disease-chip"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {probabilities && Object.keys(probabilities).length > 0 && (
                    <div className="doctor-report-probabilities">
                      <span className="doctor-report-probabilities-label text-xs">
                        Probabilities
                      </span>
                      <div className="doctor-report-probabilities-grid">
                        {Object.entries(probabilities).map(
                          ([label, value]) => (
                            <div
                              key={label}
                              className="doctor-report-probability-card"
                            >
                              <p className="doctor-report-probability-label">
                                {label}
                              </p>
                              <p className="doctor-report-probability-value">
                                {typeof value === 'number'
                                  ? `${(value * 100).toFixed(1)}%`
                                  : String(value)}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {aiResult?.maxConfidence != null && (
                    <div className="doctor-report-findings-field">
                      <span className="doctor-report-findings-label text-xs">
                        Max confidence
                      </span>
                      <span className="doctor-report-findings-value">
                        {(aiResult.maxConfidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {aiResult?.uncertaintyFlag && (
                    <div className="doctor-report-uncertainty-alert">
                      The model reported increased uncertainty for this case. Use
                      AI output as supporting information only.
                    </div>
                  )}

                  {aiResult?.warning && (
                    <div className="doctor-report-warning-alert">
                      {aiResult.warning}
                    </div>
                  )}

                  {aiResult?.clinicianNote && (
                    <div className="doctor-report-clinician-note">
                      <span className="doctor-report-clinician-note-label text-xs">
                        AI clinician note
                      </span>
                      <p className="doctor-report-clinician-note-text">
                        {aiResult.clinicianNote}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="doctor-report-no-ai-text">
                  No report is available yet for this patient. Ask the patient to
                  upload an X-ray or upload one on their behalf from the requests
                  screen.
                </p>
              )}
            </motion.section>

            <motion.section
              className="doctor-report-assessment-form"
              variants={fadeInUp}
            >
              <h2 className="doctor-report-assessment-title">
                Doctor assessment
              </h2>
              {hasReport ? (
                <form
                  className="doctor-report-assessment-body"
                  onSubmit={handleSave}
                >
                  <div className="doctor-report-field-group">
                    <label className="doctor-report-field-label">
                      Diagnosis
                    </label>
                    <textarea
                      className="doctor-report-textarea"
                      rows={3}
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Clinical diagnosis and summary impression."
                    />
                  </div>
                  <div className="doctor-report-field-group">
                    <label className="doctor-report-field-label">
                      Doctor notes
                    </label>
                    <textarea
                      className="doctor-report-textarea"
                      rows={4}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Detailed notes, follow-up recommendations, and any additional findings."
                    />
                  </div>
                  <div className="doctor-report-select-row">
                    <div className="doctor-report-field-group">
                      <label className="doctor-report-field-label">
                        Status
                      </label>
                      <select
                        className="doctor-report-status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ANALYZED" disabled={!canAnalyze}>
                          ANALYZED
                        </option>
                      </select>
                      {!canAnalyze && (
                        <p className="mt-1 text-xs text-slate-500">
                          Add a diagnosis to enable <span className="font-medium">ANALYZED</span>.
                        </p>
                      )}
                    </div>
                    <div className="doctor-report-actions">
                      <button
                        type="submit"
                        disabled={saving}
                        className="doctor-report-save-btn"
                      >
                        {saving ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="doctor-report-no-ai-text">
                  Once an AI report is generated for this patient, you will be able
                  to add your diagnosis, notes, and mark the status as completed.
                </p>
              )}

              <p className="doctor-report-footer">
                Generated by Rayzo AI. Final decisions must always be made by
                a licensed medical professional.
              </p>
            </motion.section>
          </motion.div>
        </section>

        {/* Blockchain Verification */}
        {hasReport && report?.transactionHash && (
          <motion.section variants={fadeInUp}>
            <BlockchainVerification
              transactionHash={report.transactionHash}
              blockchainNetwork={report.blockchainNetwork}
              blockchainTimestamp={report.blockchainTimestamp}
            />
          </motion.section>
        )}
      </motion.div>
    </div>
  )
}


import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import SeverityBadge from '../components/SeverityBadge'
import StatusBadge from '../components/StatusBadge'
import BlockchainVerification from '../components/BlockchainVerification'
import { fadeInUp, stagger } from '../animations/motionVariants'
import '../styles/DoctorReport.css'

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

const getSeverityStyle = (report) => {
  const severityLabel = report?.severity
  const maxConfidence = report?.aiResult?.maxConfidence

  if (typeof maxConfidence === 'number') {
    if (maxConfidence < 0.3) return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    if (maxConfidence < 0.7) return 'bg-amber-50 text-amber-800 border border-amber-200'
    return 'bg-red-50 text-red-800 border border-red-200'
  }

  if (severityLabel === 'NORMAL') return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  if (severityLabel === 'MODERATE') return 'bg-amber-50 text-amber-800 border border-amber-200'
  if (severityLabel === 'CRITICAL') return 'bg-red-50 text-red-800 border border-red-200'

  return 'bg-slate-50 text-slate-800 border border-slate-200'
}

export default function PatientResults() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/patient/my-report')
      setReport(res.data)
    } catch (err) {
      if (err?.response?.status === 404) {
        setReport(null)
        setError('')
      } else {
        setError('Failed to fetch report')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (report?.status !== 'PENDING') return

    const interval = setInterval(fetchReport, 30000)
    return () => clearInterval(interval)
  }, [report?.status])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-12 text-center">
          <p className="text-slate-500">No reports uploaded yet.</p>
          <p className="text-sm text-slate-400 mt-2">
            Upload an X-ray from your profile to generate your first report.
          </p>
        </div>
      </div>
    )
  }

  const isPending = report.status === 'PENDING'
  const aiResult = report.aiResult || {}

  const visualAnalysis = aiResult.visual_analysis || aiResult.visualAnalysis || {}

  const toImageSrc = (raw) => {
    if (typeof raw !== 'string' || raw.length === 0) return null
    if (raw.startsWith('data:image/')) return raw
    return `data:image/png;base64,${raw}`
  }

  const probabilities =
    aiResult && typeof aiResult.probabilities === 'object'
      ? aiResult.probabilities
      : null

  const maxProbabilityRaw =
    typeof aiResult.max_probability === 'number'
      ? aiResult.max_probability
      : typeof aiResult.maxConfidence === 'number'
        ? aiResult.maxConfidence
        : null

  const confidenceScoreRaw =
    aiResult.confidence_score ?? aiResult.confidenceScore ?? null
  const confidenceLevel = aiResult.confidence_level ?? aiResult.confidenceLevel
  const triageScore = aiResult.triage_score ?? aiResult.triageScore
  const priority = aiResult.priority
  const clinicianNote =
    aiResult.clinician_note ?? aiResult.clinicianNote ?? report.doctorNotes

  const gradcamBase =
    visualAnalysis.gradcam ??
    visualAnalysis.gradCam ??
    aiResult.gradcam ??
    aiResult.heatmap ??
    null

  const lungSegmentationBase =
    visualAnalysis.lung_segmentation ??
    visualAnalysis.lungSegmentation ??
    aiResult.lung_segmentation ??
    aiResult.lungSegmentation ??
    null

  const ribEdgesBase =
    visualAnalysis.rib_edges ??
    visualAnalysis.ribEdges ??
    aiResult.rib_edges ??
    aiResult.ribEdges ??
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

  const formatPercent = (value) => {
    if (typeof value !== 'number') return '—'
    return `${(value * 100).toFixed(2)}%`
  }

  const confidenceScoreDisplay =
    typeof confidenceScoreRaw === 'number'
      ? confidenceScoreRaw >= 0 && confidenceScoreRaw <= 1
        ? `${(confidenceScoreRaw * 100).toFixed(2)}%`
        : confidenceScoreRaw.toFixed(2)
      : confidenceScoreRaw || '—'

  const maxProbabilityDisplay =
    typeof maxProbabilityRaw === 'number'
      ? formatPercent(maxProbabilityRaw)
      : '—'

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Latest Report</h1>
            <p className="text-slate-500 mt-1">
              AI-assisted analysis and clinician insights for your most recent X-ray.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="doctor-report-summary-card">
          <div className="doctor-report-summary-header">
            <div>
              <h2 className="doctor-report-summary-title">
                Rayzo Radiology Report
              </h2>
              <p className="doctor-report-summary-subtitle">
                AI-assisted chest X-ray screening
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs">
              <span className="text-slate-500">
                Report ID:{' '}
                <span className="font-semibold text-slate-800">
                  {report.reportId || '—'}
                </span>
              </span>
              <span className="text-slate-500">
                Uploaded:{' '}
                <span className="font-semibold text-slate-800">
                  {formatDate(report.uploadedAt)}
                </span>
              </span>
            </div>
          </div>

          <div className="doctor-report-patient-grid">

            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">Status</span>
              <span className="doctor-report-patient-value flex items-center gap-2">
                {report.status ? (
                  <StatusBadge status={report.status} />
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">Severity</span>
              <span className="doctor-report-patient-value flex items-center gap-2">
                {report.severity ? (
                  <SeverityBadge severity={report.severity} />
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">AI Priority</span>
              <span className="doctor-report-patient-value">
                {priority || '—'}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Confidence level
              </span>
              <span className="doctor-report-patient-value">
                {confidenceLevel || '—'}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Confidence score
              </span>
              <span className="doctor-report-patient-value">
                {confidenceScoreDisplay}
              </span>
            </div>
            <div className="doctor-report-patient-field">
              <span className="doctor-report-patient-label text-xs">
                Max probability
              </span>
              <span className="doctor-report-patient-value">
                {maxProbabilityDisplay}
              </span>
            </div>
            {triageScore != null && (
              <div className="doctor-report-patient-field">
                <span className="doctor-report-patient-label text-xs">
                  Triage score
                </span>
                <span className="doctor-report-patient-value">
                  {triageScore}
                </span>
              </div>
            )}
          </div>
        </motion.div>

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
          </motion.div>

          <motion.div
            className="doctor-report-right-column"
            variants={stagger}
          >
            <motion.section
              className="doctor-report-findings-card"
              variants={fadeInUp}
            >
              <h2 className="doctor-report-findings-title">AI analysis</h2>
              <div className="doctor-report-findings-body">
                {probabilities && Object.keys(probabilities).length > 0 ? (
                  <div className="space-y-2">
                    <span className="doctor-report-probabilities-label text-xs">
                      Probabilities
                    </span>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-slate-700">
                              Disease
                            </th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-700">
                              Probability (%)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(probabilities).map(
                            ([disease, value]) => (
                              <tr key={disease} className="border-t border-slate-100">
                                <td className="px-3 py-1.5 text-slate-800">
                                  {disease}
                                </td>
                                <td className="px-3 py-1.5 text-slate-800">
                                  {typeof value === 'number'
                                    ? formatPercent(value)
                                    : String(value)}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="doctor-report-no-ai-text">
                    No probability breakdown is available for this report.
                  </p>
                )}

                {clinicianNote && (
                  <div className="doctor-report-clinician-note mt-4">
                    <span className="doctor-report-clinician-note-label text-xs">
                      Clinician-style AI interpretation
                    </span>
                    <p className="doctor-report-clinician-note-text">
                      {clinicianNote}
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        </section>

        {/* Blockchain Verification */}
        {report?.transactionHash && (
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

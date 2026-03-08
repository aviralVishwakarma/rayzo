import { useState, useCallback } from 'react'

// Simulated delay (ms)
const UPLOAD_DELAY = 2500
const LIST_DELAY = 600

// Mock user (replace with real auth later)
const MOCK_USER = {
  id: 'usr_1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@hospital.org',
  registrationNumber: 'MED-2024-8842',
}

// Mock reports list (replace with real API later)
const MOCK_REPORTS = [
  { id: 'r1', disease: 'Normal', confidence: 94, date: '2025-02-18', thumbnail: null },
  { id: 'r2', disease: 'Pneumonia', confidence: 87, date: '2025-02-15', thumbnail: null },
  { id: 'r3', disease: 'COVID-19', confidence: 76, date: '2025-02-10', thumbnail: null },
  { id: 'r4', disease: 'Normal', confidence: 98, date: '2025-02-05', thumbnail: null },
]

// Mock single report for ReportView (replace with real API later)
function getMockReport(id) {
  const r = MOCK_REPORTS.find((x) => x.id === id) || MOCK_REPORTS[0]
  return {
    ...r,
    id: id || r.id,
    imageUrl: null,
    explanation:
      'The model indicates focal opacity in the lower lung fields with mild interstitial markings. Findings are consistent with the predicted classification. Clinical correlation and follow-up imaging are recommended.',
    heatmapAvailable: true,
    confidenceBreakdown: [
      { name: 'Normal', value: r.disease === 'Normal' ? r.confidence : 100 - r.confidence },
      { name: r.disease, value: r.confidence },
    ],
  }
}

export function useFakeApi() {
  const [user, setUser] = useState(null)

  const login = useCallback(async (registrationNumber, password) => {
    await new Promise((r) => setTimeout(r, 800))
    if (!registrationNumber==null) {
      throw new Error('Registration number is required')
    }
    setUser({ ...MOCK_USER, registrationNumber })
    return { user: MOCK_USER, token: 'fake_jwt_token' }
  }, [])

  const register = useCallback(async (data) => {
    await new Promise((r) => setTimeout(r, 800))
    if (!data?.registrationNumber?.trim()) {
      throw new Error('Registration number is required')
    }
    const newUser = { ...MOCK_USER, ...data }
    setUser(newUser)
    return { user: newUser, token: 'fake_jwt_token' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const uploadAndAnalyze = useCallback(async (file) => {
    await new Promise((r) => setTimeout(r, UPLOAD_DELAY))
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve({
          id: `r_${Date.now()}`,
          imageUrl: reader.result,
          disease: ['Normal', 'Pneumonia', 'COVID-19'][Math.floor(Math.random() * 3)],
          confidence: 70 + Math.floor(Math.random() * 28),
          date: new Date().toISOString().slice(0, 10),
          explanation:
            'The model indicates focal opacity in the lower lung fields with mild interstitial markings. Findings are consistent with the predicted classification. Clinical correlation and follow-up imaging are recommended.',
          heatmapAvailable: true,
          confidenceBreakdown: [
            { name: 'Normal', value: 35 },
            { name: 'Pneumonia', value: 40 },
            { name: 'COVID-19', value: 25 },
          ],
        })
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }, [])

  const getReportsList = useCallback(async () => {
    await new Promise((r) => setTimeout(r, LIST_DELAY))
    return MOCK_REPORTS
  }, [])

  const getReportById = useCallback(async (id) => {
    await new Promise((r) => setTimeout(r, LIST_DELAY))
    return getMockReport(id)
  }, [])

  return {
    user: user || null,
    login,
    register,
    logout,
    uploadAndAnalyze,
    getReportsList,
    getReportById,
  }
}

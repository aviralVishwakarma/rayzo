import axios from 'axios'

const api = axios.create({
  baseURL: 'https://rayzo-backend.onrender.com',
})
api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------- Doctor-facing API helpers (real backend only) ----------

export const getDoctorMyPatients = async () => {
  const res = await api.get('/doctor/my-patients')
  return res.data
}

export const getDoctorPatientDetails = async (patientId) => {
  if (!patientId) throw new Error('patientId is required')
  const res = await api.get(`/doctor/get-one-patient/${patientId}`)
  return res.data
}

export const getDoctorPatientReport = async (patientId) => {
  if (!patientId) throw new Error('patientId is required')
  const res = await api.get(`/doctor/${patientId}/report`)
  return res.data
}

export const updateDoctorReport = async (reportId, payload) => {
  if (!reportId) throw new Error('reportId is required')
  const res = await api.put(`/doctor/update-report/${reportId}`, payload)
  return res.data
}

export const uploadDoctorXray = (patientId, file) => {
  if (!patientId) throw new Error('patientId is required')
  if (!file) throw new Error('file is required')

  const formData = new FormData()
  formData.append('file', file)

  return api.post(`/doctor/${patientId}/upload-patient-xray`, formData)
}

export default api
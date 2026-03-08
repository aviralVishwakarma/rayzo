import api from './api'

// Upload X-ray via real API (no local fake result state)
export const uploadXrayWithPendingResult = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post('/patient/upload-xray', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}


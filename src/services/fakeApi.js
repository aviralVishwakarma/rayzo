/**
 * Fake API for development when backend endpoints are missing.
 * Returns mock promises with realistic data.
 */

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// Mock user profile (patient or doctor)
export const getMyProfile = async (role = 'PATIENT') => {
  await delay()
  if (role === 'PATIENT') {
    return {
      fullName: 'Demo Patient',
      email: 'patient@example.com',
      role: 'PATIENT',
      age: 35,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 555-0001',
      doctorId: null,
    }
  }
  return {
    fullName: 'Dr. Demo',
    email: 'doctor@example.com',
    role: 'DOCTOR',
    specialization: 'Radiology',
    licenceNumber: 'LIC-12345',
    hospitalName: 'City General Hospital',
    experience: '10 years',
    phone: '+1 555-0100',
  }
}

// Mock doctors list for patient to select
export const getAllDoctors = async () => {
  await delay()
  return [
    {
      id: 'd1',
      fullName: 'Dr. Sarah Mitchell',
      specialization: 'Radiology',
      hospitalName: 'City General Hospital',
      experience: '12 years',
      phone: '+1 555-0101',
    },
    {
      id: 'd2',
      fullName: 'Dr. James Chen',
      specialization: 'Pulmonology',
      hospitalName: 'Metro Medical Center',
      experience: '8 years',
      phone: '+1 555-0102',
    },
  ]
}

// Mock all patients for doctor
export const getAllPatients = async () => {
  await delay()
  const patients = [
    { id: 'p1', fullName: 'John Doe', age: 45, gender: 'Male' },
    { id: 'p2', fullName: 'Jane Smith', age: 32, gender: 'Female' },
    { id: 'p3', fullName: 'Robert Wilson', age: 58, gender: 'Male' },
  ]
  return patients.map((p) => ({
    ...p,
    severity: p.severity ?? Math.round((Math.random() * 100)) / 100,
  }))
}

// Mock single patient detail for doctor
export const getOnePatient = async (patientId) => {
  await delay()
  return {
    id: patientId,
    fullName: 'John Doe',
    age: 45,
    gender: 'Male',
    email: 'john@example.com',
    bloodGroup: 'O+',
    phone: '+1 555-1234',
    severity: 0.82,
    aiResult: 'High risk of pneumonia detected in right lower lobe.',
  }
}

// Mock submit report
export const submitReport = async (payload) => {
  await delay()
  return { success: true, message: 'Report submitted successfully' }
}

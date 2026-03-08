// Medical theme: blue (trust), white (clean), red (medical cross / accent)
export const COLORS = {
  primary: '#1E40AF',       // Blue-800 – medical trust
  primaryLight: '#3B82F6',  // Blue-500
  primaryDark: '#1D4ED8',   // Blue-700
  accent: '#DC2626',        // Red-600 – medical accent
  accentLight: '#EF4444',   // Red-500
  success: '#059669',
  warning: '#D97706',
  error: '#B91C1C',         // Red-700
  surface: '#F0F4F8',       // Slight blue tint
  surfaceCard: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  white: '#FFFFFF',
  blue: '#1E40AF',
  red: '#DC2626',
}

export const DURATIONS = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
}

export const DISCLAIMER_TEXT =
  'AI-generated analysis. Final diagnosis must be done by a licensed medical professional.'

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  upload: '/upload',
  reports: '/reports',
  reportView: '/reports/:id',
  // Role-based routes
  patientDashboard: '/patient/dashboard',
  patientProfile: '/patient/profile',
  patientResults: '/patient/results',
  doctorDashboard: '/doctor/dashboard',
  doctorProfile: '/doctor/profile',
  doctorRequests: '/doctor/requests',
  doctorPatientDetail: '/doctor/requests/:patientId',
  doctorReport: '/doctor/report/:patientId',
  translator: '/translator',
  pricing: '/pricing',
}

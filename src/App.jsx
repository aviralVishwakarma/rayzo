import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from './services/api'

import Layout from './components/Layout'

import Product from './pages/Product'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Reports from './pages/Reports'
import ReportView from './pages/ReportView'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientProfile from './pages/PatientProfile'
import DoctorProfile from './pages/DoctorProfile'
import PatientResults from './pages/PatientResults'
import DoctorRequests from './pages/DoctorRequests'
import DoctorReport from './pages/DoctorReport'
import Translator from './components/Translator'
import PricingPage from './pages/PricingPage'

import { ROUTES } from './utils/constants'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to={ROUTES.login} replace />
  return children
}

function RoleGuard({ children, user, allowedRole }) {
  const token = localStorage.getItem('token')
  const role = user?.role ?? localStorage.getItem('role')
  if (!token) return <Navigate to={ROUTES.login} replace />
  if (role !== allowedRole) {
    const fallback = role === 'PATIENT' ? ROUTES.patientDashboard : ROUTES.doctorDashboard
    return <Navigate to={fallback} replace />
  }
  return children
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const fullName = localStorage.getItem('fullName')
    if (token && role && fullName) {
      setUser({ fullName, role })
    }
  }, [])

  const handleLogin = async (userData) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('fullName', userData.fullName)
    localStorage.setItem('role', userData.role)

    const loggedUser = { fullName: userData.fullName, role: userData.role }
    setUser(loggedUser)

    if (loggedUser.role === 'PATIENT') {
      navigate(ROUTES.patientDashboard, { replace: true })
    } else if (loggedUser.role === 'DOCTOR') {
      navigate(ROUTES.doctorDashboard, { replace: true })
    } else {
      navigate(ROUTES.home, { replace: true })
    }
  }

  const handleRegister = async (data) => {
    await api.post('/auth/register', data)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('fullName')
    localStorage.removeItem('role')
    setUser(null)
    navigate(ROUTES.home)
  }

  const getDashboardRedirect = () => {
    const role = localStorage.getItem('role')
    if (role === 'PATIENT') return ROUTES.patientDashboard
    if (role === 'DOCTOR') return ROUTES.doctorDashboard
    return ROUTES.dashboard
  }

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/product" element={<Product />} />
      <Route path={ROUTES.home} element={<Landing />} />
      <Route path={ROUTES.translator} element={<Translator />} />
      <Route path={ROUTES.pricing} element={<PricingPage />} />

      <Route
        path={ROUTES.login}
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path={ROUTES.register}
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <Register onRegister={handleRegister} />
          )
        }
      />

      {/* Patient routes */}
      <Route
        path={ROUTES.patientDashboard}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="PATIENT">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <PatientDashboard />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.patientProfile}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="PATIENT">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <PatientProfile />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.patientResults}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="PATIENT">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <PatientResults />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route
        path={ROUTES.doctorDashboard}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="DOCTOR">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <DoctorDashboard />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.doctorProfile}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="DOCTOR">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <DoctorProfile />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.doctorRequests}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="DOCTOR">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <DoctorRequests />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.doctorPatientDetail}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="DOCTOR">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <DoctorRequests />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.doctorReport}
        element={
          <ProtectedRoute>
            <RoleGuard user={user} allowedRole="DOCTOR">
              <Layout
                user={user}
                onLogout={handleLogout}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
              >
                <DoctorReport />
              </Layout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Legacy dashboard (fallback) */}
      <Route
        path={ROUTES.dashboard}
        element={
          <ProtectedRoute>
            <Navigate to={getDashboardRedirect()} replace />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.upload} element={<Upload />} />
      <Route path={ROUTES.reports} element={<Reports />} />
      <Route path={ROUTES.reportView} element={<ReportView />} />

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

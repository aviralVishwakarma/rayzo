import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Stethoscope, LogOut } from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import NavbarProButton from './NavbarProButton'

function getNavLinks(role) {
  if (role === 'PATIENT') {
    return [
      { to: ROUTES.patientDashboard, label: 'Dashboard' },
      { to: ROUTES.patientProfile, label: 'Profile' },
      { to: ROUTES.patientResults, label: 'Results' },
    ]
  }
  if (role === 'DOCTOR') {
    return [
      { to: ROUTES.doctorDashboard, label: 'Dashboard' },
      { to: ROUTES.doctorRequests, label: 'Requests' },
      { to: ROUTES.doctorProfile, label: 'Profile' },
    ]
  }
  return [
    { to: ROUTES.dashboard, label: 'Dashboard' },
    { to: ROUTES.upload, label: 'Upload' },
    { to: ROUTES.reports, label: 'Reports' },
  ]
}

export default function Navbar({ user, onLogout, onMenuClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const toggleMobile = () => setMobileOpen((o) => !o)
  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={
              user || localStorage.getItem('token')
                ? (user?.role ?? localStorage.getItem('role')) === 'PATIENT'
                  ? ROUTES.patientDashboard
                  : (user?.role ?? localStorage.getItem('role')) === 'DOCTOR'
                    ? ROUTES.doctorDashboard
                    : ROUTES.dashboard
                : ROUTES.home
            }
            className="flex items-center gap-2"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-lg">Rayzo</span>
          </Link>

          {(user || localStorage.getItem('token')) ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                {getNavLinks(user?.role ?? localStorage.getItem('role')).map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === to
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    style={
                      location.pathname === to
                        ? { backgroundColor: COLORS.primary }
                        : {}
                    }
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-slate-600">{user?.fullName ?? localStorage.getItem('fullName')}</span>
                <NavbarProButton />
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  toggleMobile()
                  onMenuClick?.()
                }}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavbarProButton />
              <Link
                to={ROUTES.login}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.register}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: COLORS.accent }}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (user || localStorage.getItem('token')) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {getNavLinks(user.role).map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === to ? 'bg-blue-50 text-blue-800' : 'text-slate-700'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to={ROUTES.pricing}
                onClick={closeMobile}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                ✦ PRO — View Plans
              </Link>
              <button
                onClick={() => {
                  onLogout()
                  closeMobile()
                }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

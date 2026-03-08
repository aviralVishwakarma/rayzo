import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Scan,
} from 'lucide-react'
import { ROUTES, COLORS } from '../utils/constants'
import { fadeIn } from '../animations/motionVariants'

const patientLinks = [
  { to: ROUTES.patientDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.patientProfile, label: 'Profile', icon: User },
  { to: ROUTES.patientResults, label: 'Results', icon: FileText },
]

const doctorLinks = [
  { to: ROUTES.doctorDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.doctorRequests, label: 'Requests', icon: ClipboardList },
  { to: ROUTES.doctorProfile, label: 'Profile', icon: User },
]

export default function Sidebar({ role, collapsed, onToggle, className = '' }) {
  const location = useLocation()
  const resolvedRole = role ?? localStorage.getItem('role')
  const links = resolvedRole === 'PATIENT' ? patientLinks : resolvedRole === 'DOCTOR' ? doctorLinks : patientLinks

  return (
    <motion.aside
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={`hidden lg:flex flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl ${className}`}
    >
      <div
        className={`flex flex-col transition-[width] duration-300 ${
          collapsed ? 'w-[72px]' : 'w-56'
        }`}
      >
        <div className="p-4 flex items-center justify-between min-h-[4rem]">
          {!collapsed && (
            <span className="font-semibold text-slate-800 truncate">Menu</span>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 px-3 pb-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
                style={isActive ? { backgroundColor: COLORS.primary } : {}}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}

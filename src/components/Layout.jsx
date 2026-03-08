import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children, user, onLogout, sidebarCollapsed, onSidebarToggle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-1 pt-16">
        <Sidebar
          role={user?.role}
          collapsed={sidebarCollapsed}
          onToggle={onSidebarToggle}
          className=""
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

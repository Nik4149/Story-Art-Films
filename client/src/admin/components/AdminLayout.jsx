import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import {
  LayoutDashboard, Image, Calendar, Star, Briefcase,
  DollarSign, Mail, Users, LogOut, Menu, X, Camera,
} from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/admin/bookings',     label: 'Bookings',     Icon: Calendar },
  { to: '/admin/portfolio',    label: 'Portfolio',    Icon: Image },
  { to: '/admin/services',     label: 'Services',     Icon: Briefcase },
  { to: '/admin/testimonials', label: 'Testimonials', Icon: Star },
  { to: '/admin/pricing',      label: 'Pricing',      Icon: DollarSign },
  { to: '/admin/contact',      label: 'Messages',     Icon: Mail },
  { to: '/admin/newsletter',   label: 'Newsletter',   Icon: Users },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
    isActive
      ? 'bg-amber-500/15 text-amber-400 font-medium'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
  }`

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdmin()
  const navigate           = useNavigate()
  const [open, setOpen]    = useState(false)

  const handleLogout = async () => {
    logout()
    navigate('/admin/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <Camera size={20} className="text-amber-400" />
          <span className="font-display text-lg tracking-widest text-white font-light">LUMORA</span>
        </div>
        <p className="text-gray-500 text-xs mt-1 tracking-wider">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-4 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-400 text-xs font-medium">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{admin?.name}</p>
            <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/8 rounded-lg text-xs transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 border-r border-white/8 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-60 bg-gray-900 flex flex-col h-full">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-gray-900 border-b border-white/8 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-white text-sm font-medium flex-1">
            Lumora Photography — Admin
          </h1>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-xs hover:text-amber-400 transition-colors hidden sm:block"
          >
            View Site ↗
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

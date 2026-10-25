import { useEffect, useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Calendar, Image, Mail, Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ label, value, sub, Icon, color, to }) {
  const card = (
    <div className={`bg-gray-900 border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors ${to ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-400 text-xs tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-white text-3xl font-light mb-1">{value ?? '—'}</p>
      {sub && <p className="text-gray-500 text-xs">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

export default function AdminDashboard() {
  const { authFetch, admin } = useAdmin()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [b, p, c, n] = await Promise.all([
          authFetch('/api/bookings?limit=1').then(r => r.json()),
          authFetch('/api/portfolio?all=true&limit=1').then(r => r.json()),
          authFetch('/api/contact').then(r => r.json()),
          authFetch('/api/newsletter').then(r => r.json()),
        ])
        setStats({ bookings: b, portfolio: p, contact: c, newsletter: n })
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl font-light mb-1">
          {greeting()}, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm">Here's what's happening at Lumora Photography.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-white/8 rounded-xl p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard
              label="Total Bookings"
              value={stats?.bookings?.total ?? 0}
              sub={`${stats?.bookings?.summary?.pending ?? 0} pending`}
              Icon={Calendar}
              color="bg-amber-500/15 text-amber-400"
              to="/admin/bookings"
            />
            <StatCard
              label="Portfolio Items"
              value={stats?.portfolio?.total ?? 0}
              sub="published projects"
              Icon={Image}
              color="bg-blue-500/15 text-blue-400"
              to="/admin/portfolio"
            />
            <StatCard
              label="Unread Messages"
              value={stats?.contact?.unread ?? 0}
              sub={`${stats?.contact?.total ?? 0} total`}
              Icon={Mail}
              color="bg-purple-500/15 text-purple-400"
              to="/admin/contact"
            />
            <StatCard
              label="Subscribers"
              value={stats?.newsletter?.total ?? 0}
              sub="newsletter list"
              Icon={Users}
              color="bg-green-500/15 text-green-400"
              to="/admin/newsletter"
            />
          </div>

          {/* Booking status row */}
          {stats?.bookings?.summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Pending',   val: stats.bookings.summary.pending,   Icon: Clock,        col: 'bg-yellow-500/15 text-yellow-400' },
                { label: 'Confirmed', val: stats.bookings.summary.confirmed, Icon: TrendingUp,   col: 'bg-blue-500/15 text-blue-400' },
                { label: 'Completed', val: stats.bookings.summary.completed, Icon: CheckCircle,  col: 'bg-green-500/15 text-green-400' },
                { label: 'Cancelled', val: stats.bookings.summary.cancelled, Icon: XCircle,      col: 'bg-red-500/15 text-red-400' },
              ].map(({ label, val, Icon, col }) => (
                <div key={label} className="bg-gray-900 border border-white/8 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded ${col} flex items-center justify-center`}>
                      <Icon size={12} />
                    </div>
                    <p className="text-gray-400 text-xs">{label}</p>
                  </div>
                  <p className="text-white text-2xl font-light">{val ?? 0}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Quick links */}
      <div className="bg-gray-900 border border-white/8 rounded-xl p-5">
        <h2 className="text-white text-sm font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ Add Portfolio Item', to: '/admin/portfolio' },
            { label: '+ Add Service',        to: '/admin/services' },
            { label: '+ Add Testimonial',    to: '/admin/testimonials' },
            { label: 'View Bookings',         to: '/admin/bookings' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors border border-white/5"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

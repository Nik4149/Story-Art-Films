import { useEffect, useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Calendar, MapPin, Phone, Mail, ChevronDown, Trash2, RefreshCw } from 'lucide-react'

const STATUS_COLORS = {
  Pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Completed: 'bg-green-500/15 text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
}

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${STATUS_COLORS[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  )
}

export default function AdminBookings() {
  const { authFetch }       = useAdmin()
  const [bookings, setBookings] = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const url = filter ? `/api/bookings?status=${filter}` : '/api/bookings'
      const res  = await authFetch(url)
      const data = await res.json()
      if (data.success) { setBookings(data.data); setTotal(data.total) }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const res  = await authFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        body:   JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) setBookings(prev => prev.map(b => b._id === id ? data.data : b))
    } finally {
      setUpdating(null)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this booking permanently?')) return
    const res = await authFetch(`/api/bookings/${id}`, { method: 'DELETE' })
    if ((await res.json()).success) setBookings(prev => prev.filter(b => b._id !== id))
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-light">Bookings</h1>
          <p className="text-gray-500 text-xs mt-0.5">{total} total requests</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-gray-800 border border-white/8 text-gray-300 text-xs px-3 py-2 rounded-lg outline-none"
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={load} className="p-2 text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-900 border border-white/8 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-12 text-center">
          <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map(b => (
            <div key={b._id} className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(expanded === b._id ? null : b._id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{b.name}</p>
                  <p className="text-gray-500 text-xs truncate">{b.type}</p>
                </div>
                <div className="hidden sm:block text-gray-400 text-xs">
                  {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <StatusBadge status={b.status} />
                <ChevronDown
                  size={14}
                  className={`text-gray-500 flex-shrink-0 transition-transform ${expanded === b._id ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expanded detail */}
              {expanded === b._id && (
                <div className="border-t border-white/8 px-5 py-4 bg-gray-950/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={12} className="text-amber-400" /> {b.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={12} className="text-amber-400" /> {b.phone}
                      </div>
                      {b.location && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={12} className="text-amber-400" /> {b.location}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      {b.hours  && <p>Duration: <span className="text-gray-300">{b.hours}</span></p>}
                      {b.budget && <p>Budget: <span className="text-gray-300">{b.budget}</span></p>}
                      <p>Submitted: <span className="text-gray-300">{new Date(b.createdAt).toLocaleDateString('en-IN')}</span></p>
                    </div>
                  </div>

                  <div className="bg-gray-800/60 rounded-lg p-3 text-xs text-gray-300 leading-relaxed mb-4">
                    {b.message}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-500 text-xs">Update status:</span>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        disabled={b.status === s || updating === b._id}
                        onClick={() => updateStatus(b._id, s)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          b.status === s ? STATUS_COLORS[s] : 'border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => remove(b._id)}
                      className="ml-auto text-gray-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Plus, Trash2, Star, X, Loader2, Pencil } from 'lucide-react'

const EMPTY_T = { quote: '', name: '', role: '', rating: 5, isPublished: true }

export function AdminTestimonials() {
  const { authFetch }       = useAdmin()
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]     = useState(EMPTY_T)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/testimonials?all=true')
      const d = await r.json()
      if (d.success) setItems(d.data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  const save = async (e) => {
    e.preventDefault()
    if (!form.quote || !form.name || !form.role) { setError('Quote, name and role are required.'); return }
    setSaving(true); setError('')
    try {
      const r = await authFetch('/api/testimonials', { method: 'POST', body: JSON.stringify(form) })
      const d = await r.json()
      if (d.success) { setItems(p => [d.data, ...p]); setShowForm(false); setForm(EMPTY_T) }
      else setError(d.message)
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    const r = await authFetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    if ((await r.json()).success) setItems(p => p.filter(i => i._id !== id))
  }

  const toggle = async (item) => {
    const r = await authFetch(`/api/testimonials/${item._id}`, { method: 'PUT', body: JSON.stringify({ isPublished: !item.isPublished }) })
    const d = await r.json()
    if (d.success) setItems(p => p.map(i => i._id === item._id ? d.data : i))
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-light">Testimonials</h1>
        <button onClick={() => { setShowForm(true); setError('') }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">New Testimonial</h2>
            <button onClick={() => setShowForm(false)}><X size={15} className="text-gray-500 hover:text-white" /></button>
          </div>
          {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={save} className="space-y-3">
            <textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))}
              placeholder="Client testimonial quote *" rows={3}
              className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Client name *"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
              <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Wedding · Goa *"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Rating:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}>
                  <Star size={16} className={n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-xs hover:text-white">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg">
                {saving ? <><Loader2 size={12} className="animate-spin" />Saving…</> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-900 border border-white/8 rounded-xl animate-pulse" />)}</div>
        : items.length === 0 ? <div className="bg-gray-900 border border-white/8 rounded-xl p-10 text-center"><p className="text-gray-400 text-sm">No testimonials yet</p></div>
        : (
          <div className="space-y-3">
            {items.map(t => (
              <div key={t._id} className="bg-gray-900 border border-white/8 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'} />)}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-2 italic">"{t.quote}"</p>
                    <p className="text-white text-xs font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggle(t)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${t.isPublished ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-gray-700 text-gray-400 border-white/10'}`}>
                      {t.isPublished ? 'Live' : 'Draft'}
                    </button>
                    <button onClick={() => remove(t._id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
const EMPTY_S = { number: '', icon: 'Camera', title: '', description: '' }

export function AdminServices() {
  const { authFetch }     = useAdmin()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]   = useState(EMPTY_S)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const r = await authFetch('/api/services?all=true'); const d = await r.json(); if (d.success) setItems(d.data) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  const save = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { setError('Title and description required.'); return }
    setSaving(true); setError('')
    try {
      const r = await authFetch('/api/services', { method: 'POST', body: JSON.stringify(form) })
      const d = await r.json()
      if (d.success) { setItems(p => [...p, d.data]); setShowForm(false); setForm(EMPTY_S) }
      else setError(d.message)
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this service?')) return
    const r = await authFetch(`/api/services/${id}`, { method: 'DELETE' })
    if ((await r.json()).success) setItems(p => p.filter(i => i._id !== id))
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-light">Services</h1>
        <button onClick={() => { setShowForm(true); setError('') }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">New Service</h2>
            <button onClick={() => setShowForm(false)}><X size={15} className="text-gray-500 hover:text-white" /></button>
          </div>
          {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="01"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Service title *"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
            </div>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Service description *" rows={2}
              className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 resize-none" />
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-xs hover:text-white">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg">
                {saving ? <><Loader2 size={12} className="animate-spin" />Saving…</> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-900 border border-white/8 rounded-xl animate-pulse" />)}</div>
        : (
          <div className="space-y-2">
            {items.map(s => (
              <div key={s._id} className="bg-gray-900 border border-white/8 rounded-xl px-5 py-4 flex items-start gap-4">
                <span className="text-amber-400 font-display text-lg font-light flex-shrink-0">{s.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{s.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{s.description}</p>
                </div>
                <button onClick={() => remove(s._id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
export function AdminPricing() {
  const { authFetch }     = useAdmin()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]   = useState({ name: '', price: '', tagline: '', duration: '', features: '', isPopular: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const r = await authFetch('/api/pricing?all=true'); const d = await r.json(); if (d.success) setItems(d.data) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError('Name and price required.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) }
      const r = await authFetch('/api/pricing', { method: 'POST', body: JSON.stringify(payload) })
      const d = await r.json()
      if (d.success) { await load(); setShowForm(false); setForm({ name: '', price: '', tagline: '', duration: '', features: '', isPopular: false }) }
      else setError(d.message)
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this package?')) return
    const r = await authFetch(`/api/pricing/${id}`, { method: 'DELETE' })
    if ((await r.json()).success) setItems(p => p.filter(i => i._id !== id))
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-xl font-light">Pricing</h1>
        <button onClick={() => { setShowForm(true); setError('') }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={14} /> Add Package
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-medium">New Package</h2>
            <button onClick={() => setShowForm(false)}><X size={15} className="text-gray-500 hover:text-white" /></button>
          </div>
          {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Package name *"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
              <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="₹30,000 *"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
              <input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} placeholder="Tagline"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
              <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="5 Hours"
                className="bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50" />
            </div>
            <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
              placeholder="One feature per line&#10;5 Hours Coverage&#10;300 Edited Photos" rows={4}
              className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 resize-none" />
            <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer">
              <input type="checkbox" checked={form.isPopular} onChange={e => setForm(p => ({ ...p, isPopular: e.target.checked }))} className="accent-amber-500" />
              Mark as Most Popular
            </label>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-xs hover:text-white">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg">
                {saving ? <><Loader2 size={12} className="animate-spin" />Saving…</> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-900 border border-white/8 rounded-xl animate-pulse" />)}</div>
        : (
          <div className="space-y-3">
            {items.map(pkg => (
              <div key={pkg._id} className={`bg-gray-900 border rounded-xl px-5 py-4 flex items-start gap-4 ${pkg.isPopular ? 'border-amber-500/30' : 'border-white/8'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-medium">{pkg.name}</p>
                    {pkg.isPopular && <span className="bg-amber-500/15 text-amber-400 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/20">Popular</span>}
                  </div>
                  <p className="text-amber-400 font-display text-xl font-light">{pkg.price}</p>
                  <p className="text-gray-500 text-xs mt-1">{pkg.features?.slice(0, 3).join(' · ')}{pkg.features?.length > 3 ? '…' : ''}</p>
                </div>
                <button onClick={() => remove(pkg._id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

// ─── Contact Messages ─────────────────────────────────────────────────────────
export function AdminContact() {
  const { authFetch }     = useAdmin()
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { const r = await authFetch('/api/contact'); const d = await r.json(); if (d.success) { setItems(d.data); setUnread(d.unread) } }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  const markRead = async (id) => {
    const r = await authFetch(`/api/contact/${id}`, { method: 'PUT' })
    const d = await r.json()
    if (d.success) { setItems(p => p.map(i => i._id === id ? d.data : i)); setUnread(u => Math.max(0, u - 1)) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return
    const r = await authFetch(`/api/contact/${id}`, { method: 'DELETE' })
    if ((await r.json()).success) setItems(p => p.filter(i => i._id !== id))
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-light">Messages</h1>
          {unread > 0 && <p className="text-amber-400 text-xs mt-0.5">{unread} unread</p>}
        </div>
      </div>

      {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-900 border border-white/8 rounded-xl animate-pulse" />)}</div>
        : items.length === 0 ? <div className="bg-gray-900 border border-white/8 rounded-xl p-10 text-center"><p className="text-gray-400 text-sm">No messages yet</p></div>
        : (
          <div className="space-y-2">
            {items.map(c => (
              <div key={c._id} className={`bg-gray-900 border rounded-xl p-5 ${!c.isRead ? 'border-amber-500/20' : 'border-white/8'}`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      {!c.isRead && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-gray-500 text-xs">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                  </div>
                  <p className="text-gray-600 text-xs flex-shrink-0">{new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{c.message}</p>
                <div className="flex gap-3">
                  {!c.isRead && (
                    <button onClick={() => markRead(c._id)} className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
                      Mark as read
                    </button>
                  )}
                  <a href={`mailto:${c.email}`} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">Reply</a>
                  <button onClick={() => remove(c._id)} className="text-gray-600 hover:text-red-400 transition-colors ml-auto">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
export function AdminNewsletter() {
  const { authFetch }     = useAdmin()
  const [subs, setSubs]   = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try { const r = await authFetch('/api/newsletter?limit=100'); const d = await r.json(); if (d.success) { setSubs(d.data); setTotal(d.total) } }
      finally { setLoading(false) }
    }
    load()
  }, []) // eslint-disable-line

  const remove = async (id) => {
    if (!confirm('Remove this subscriber?')) return
    const r = await authFetch(`/api/newsletter/${id}`, { method: 'DELETE' })
    if ((await r.json()).success) setSubs(p => p.filter(s => s._id !== id))
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-white text-xl font-light">Newsletter</h1>
        <p className="text-gray-500 text-xs mt-0.5">{total} subscribers</p>
      </div>

      {loading ? <div className="space-y-1">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-900 border border-white/8 rounded-lg animate-pulse" />)}</div>
        : subs.length === 0 ? <div className="bg-gray-900 border border-white/8 rounded-xl p-10 text-center"><p className="text-gray-400 text-sm">No subscribers yet</p></div>
        : (
          <div className="bg-gray-900 border border-white/8 rounded-xl divide-y divide-white/5 overflow-hidden">
            {subs.map(s => (
              <div key={s._id} className="flex items-center gap-4 px-4 py-3">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                <p className="text-gray-300 text-sm flex-1">{s.email}</p>
                <p className="text-gray-600 text-xs">{new Date(s.subscribedAt).toLocaleDateString('en-IN')}</p>
                <button onClick={() => remove(s._id)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

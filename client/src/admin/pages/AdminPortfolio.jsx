import { useEffect, useState, useRef } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Plus, Trash2, X, Upload, Loader2, Image } from 'lucide-react'

const CATEGORIES = ['Wedding', 'Portrait', 'Fashion', 'Events', 'Travel', 'Commercial']

const EMPTY = { title: '', category: 'Wedding', description: '', location: '', date: '' }

export default function AdminPortfolio() {
  const { authFetch, token } = useAdmin()
  const [items, setItems]   = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [files, setFiles]   = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const fileRef             = useRef()

  const load = async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/portfolio?all=true&limit=50')
      const data = await res.json()
      if (data.success) { setItems(data.data); setTotal(data.total) }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category) { setError('Title and category are required.'); return }

    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
      files.forEach(f => fd.append('images', f))

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => [data.data, ...prev])
        setTotal(t => t + 1)
        setShowForm(false)
        setForm(EMPTY)
        setFiles([])
      } else {
        setError(data.message || 'Failed to create item.')
      }
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this portfolio item and all its images?')) return
    const res = await authFetch(`/api/portfolio/${id}`, { method: 'DELETE' })
    if ((await res.json()).success) { setItems(p => p.filter(i => i._id !== id)); setTotal(t => t - 1) }
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-light">Portfolio</h1>
          <p className="text-gray-500 text-xs mt-0.5">{total} items</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-sm font-medium">New Portfolio Item</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {error && <p className="text-red-400 text-xs mb-4 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="The Garden Ceremony"
                  className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-colors">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Location</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="Tuscany, Italy"
                  className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2} placeholder="A short description..."
                className="w-full bg-gray-800 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-amber-500/50 transition-colors resize-none" />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-gray-400 text-xs mb-2">Images (upload to Cloudinary)</label>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                onChange={e => setFiles(Array.from(e.target.files))} />
              <button type="button" onClick={() => fileRef.current.click()}
                className="flex items-center gap-2 border border-dashed border-white/15 hover:border-amber-500/40 text-gray-400 hover:text-amber-400 text-xs px-4 py-3 rounded-lg transition-colors w-full justify-center">
                <Upload size={14} />
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click to select images'}
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white text-xs transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 text-xs font-medium px-5 py-2 rounded-lg transition-colors">
                {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-gray-900 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-gray-900 border border-white/8 rounded-xl p-12 text-center">
          <Image size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No portfolio items yet</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-amber-400 text-xs hover:text-amber-300 transition-colors">
            + Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map(item => (
            <div key={item._id} className="group relative bg-gray-900 border border-white/8 rounded-xl overflow-hidden aspect-square">
              {item.images?.[0] ? (
                <img src={item.images[0].thumbnailUrl || item.images[0].url} alt={item.title}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Image size={24} className="text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col items-start justify-end p-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  <p className="text-white text-xs font-medium truncate">{item.title}</p>
                  <p className="text-gray-300 text-xs mb-2">{item.category}</p>
                  <button onClick={() => remove(item._id)}
                    className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-black/50 text-white text-[9px] px-2 py-0.5 rounded-full">
                  {item.images?.length || 0} img
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

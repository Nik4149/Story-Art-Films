import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { Camera, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const { login }         = useAdmin()
  const navigate          = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Email and password are required.'); return }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        login(data.data, data.data.token)
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials.')
      }
    } catch {
      setError('Network error — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera size={24} className="text-amber-400" />
            <span className="font-display text-2xl tracking-widest text-white font-light">LUMORA</span>
          </div>
          <p className="text-gray-400 text-sm">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-white/8 rounded-xl p-8">
          <h2 className="text-white text-lg font-medium mb-6">Sign in</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="admin@lumoraphotography.com"
                className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1.5 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  )
}

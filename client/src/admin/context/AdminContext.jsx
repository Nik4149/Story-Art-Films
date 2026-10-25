import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin]   = useState(null)
  const [token, setToken]   = useState(() => localStorage.getItem('lumora_admin_token') || '')
  const [loading, setLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res  = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setAdmin(data.data)
        else              logout()
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, []) // eslint-disable-line

  const login = (adminData, jwt) => {
    setAdmin(adminData)
    setToken(jwt)
    localStorage.setItem('lumora_admin_token', jwt)
  }

  const logout = () => {
    setAdmin(null)
    setToken('')
    localStorage.removeItem('lumora_admin_token')
  }

  /** Authenticated fetch helper — auto-attaches Bearer token */
  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
        ...options.headers,
      },
    })

  return (
    <AdminContext.Provider value={{ admin, token, loading, login, logout, authFetch }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)

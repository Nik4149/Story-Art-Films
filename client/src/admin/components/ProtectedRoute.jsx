import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return admin ? children : <Navigate to="/admin/login" replace />
}

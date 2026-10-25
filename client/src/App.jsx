import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public site
import Navbar from './components/Navbar'
import Home   from './pages/Home'

// Admin system
import { AdminProvider }  from './admin/context/AdminContext'
import ProtectedRoute     from './admin/components/ProtectedRoute'
import AdminLayout        from './admin/components/AdminLayout'
import AdminLogin         from './admin/pages/AdminLogin'
import AdminDashboard     from './admin/pages/AdminDashboard'
import AdminBookings      from './admin/pages/AdminBookings'
import AdminPortfolio     from './admin/pages/AdminPortfolio'
import {
  AdminTestimonials,
  AdminServices,
  AdminPricing,
  AdminContact,
  AdminNewsletter,
} from './admin/pages/AdminPages'

// ── Admin wrapper (layout + auth guard) ───────────────────────────────────────
function AdminPage({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public website ──────────────────────────────────────────────── */}
          <Route path="/" element={
            <>
              <Navbar />
              <main><Home /></main>
            </>
          } />

          {/* ── Admin auth ──────────────────────────────────────────────────── */}
          <Route path="/admin"       element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Admin panel (all protected) ──────────────────────────────────── */}
          <Route path="/admin/dashboard"    element={<AdminPage><AdminDashboard /></AdminPage>} />
          <Route path="/admin/bookings"     element={<AdminPage><AdminBookings /></AdminPage>} />
          <Route path="/admin/portfolio"    element={<AdminPage><AdminPortfolio /></AdminPage>} />
          <Route path="/admin/services"     element={<AdminPage><AdminServices /></AdminPage>} />
          <Route path="/admin/testimonials" element={<AdminPage><AdminTestimonials /></AdminPage>} />
          <Route path="/admin/pricing"      element={<AdminPage><AdminPricing /></AdminPage>} />
          <Route path="/admin/contact"      element={<AdminPage><AdminContact /></AdminPage>} />
          <Route path="/admin/newsletter"   element={<AdminPage><AdminNewsletter /></AdminPage>} />

          {/* ── 404 fallback ─────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}

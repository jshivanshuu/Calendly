import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Availability from './pages/Availability'
import Meetings from './pages/Meetings'
import PublicBooking from './pages/PublicBooking'
import BookingConfirmation from './pages/BookingConfirmation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AdminLayout({ children }) {
  const { token } = useAuth()
  if (!token) {
    // not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin routes */}
        <Route path="/" element={
          <AdminLayout><Dashboard /></AdminLayout>
        } />
        <Route path="/availability" element={
          <AdminLayout><Availability /></AdminLayout>
        } />
        <Route path="/meetings" element={
          <AdminLayout><Meetings /></AdminLayout>
        } />

        {/* Public routes */}
        <Route path="/book/:slug" element={<PublicBooking />} />
        <Route path="/book/:slug/confirmed" element={<BookingConfirmation />} />

        {/* catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

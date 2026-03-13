import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Availability from './pages/Availability'
import Meetings from './pages/Meetings'
import PublicBooking from './pages/PublicBooking'
import BookingConfirmation from './pages/BookingConfirmation'
import { NavLink } from 'react-router-dom'
import { Calendar, Clock, Users, LayoutGrid } from 'lucide-react'
import logo from './assets/images/calendly-vector-logo-seeklogo/calendly-seeklogo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/meetings', label: 'Meetings', icon: Users },
]

export default function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  if (isHomePage) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:slug" element={<PublicBooking />} />
        <Route path="/book/:slug/confirmed" element={<BookingConfirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Calendly Logo" className="h-12 w-auto" />
            <nav className="flex items-center space-x-6">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/book/:slug" element={<PublicBooking />} />
            <Route path="/book/:slug/confirmed" element={<BookingConfirmation />} />
            {/* catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

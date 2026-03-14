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
import logo from './assets/images/brand-logo/logo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/meetings', label: 'Meetings', icon: Users },
]

export default function App() {
  const location = useLocation()
  const isPublicPage =
    location.pathname === '/' || location.pathname.startsWith('/book/')

  if (isPublicPage) {
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
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Schedulr logo" className="h-10 w-auto sm:h-12" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Schedulr</p>
              <p className="text-xs text-gray-500">Manage your scheduling pages</p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-auto">
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

import { NavLink, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, Settings, LayoutGrid, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Event Types', icon: LayoutGrid, end: true },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/meetings', label: 'Meetings', icon: Users },
]

function UserInfo() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {user?.email || 'Admin User'}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-1">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Schedulr</span>
        </div>
      </div>

      {/* User pill */}
      <UserInfo />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>
    </aside>
  )
}

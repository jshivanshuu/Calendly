import { NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'
import logo from '../assets/images/brand-logo/logo.png'

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-[calc(100vh-73px)] w-56 shrink-0 bg-white border-r border-gray-100 lg:flex lg:flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Schedulr logo" className="h-12 w-auto" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <NavLink
          to="/availability"
          className="nav-link"
        >
          <Settings className="w-4 h-4" />
          Preferences
        </NavLink>
      </div>
    </aside>
  )
}

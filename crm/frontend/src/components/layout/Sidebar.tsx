import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CreditCard,
  CalendarCheck, MessageSquare, LogOut, Shield, ChevronRight,
  UserCog,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students',   icon: GraduationCap,   label: 'Students' },
  { to: '/teachers',   icon: Users,            label: 'Teachers' },
  { to: '/groups',     icon: BookOpen,         label: 'Groups' },
  { to: '/payments',   icon: CreditCard,       label: 'Payments' },
  { to: '/attendance', icon: CalendarCheck,    label: 'Attendance' },
  { to: '/requests',   icon: MessageSquare,    label: 'Requests' },
]

export default function Sidebar() {
  const { user, logout, isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-surface-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">EduCRM</div>
            <div className="text-slate-500 text-xs">Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
               ${isActive
                 ? 'bg-primary-600 text-white'
                 : 'text-slate-400 hover:text-white hover:bg-surface-800'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-white/60" />}
              </>
            )}
          </NavLink>
        ))}

        {isSuperAdmin && (
          <>
            <div className="px-3 pt-4 pb-1">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Superadmin</span>
            </div>
            <NavLink
              to="/admins"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                 ${isActive
                   ? 'bg-primary-600 text-white'
                   : 'text-slate-400 hover:text-white hover:bg-surface-800'}`
              }
            >
              {({ isActive }) => (
                <>
                  <UserCog size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="flex-1">Admins</span>
                  {isActive && <ChevronRight size={14} className="text-white/60" />}
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-surface-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.fullName}</div>
            <div className="text-slate-500 text-xs">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

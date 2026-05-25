import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  HiHome, HiOfficeBuilding, HiAcademicCap, HiCollection, HiCreditCard,
  HiChatAlt2, HiClipboardList, HiUserGroup, HiBell,
  HiLogout, HiMenuAlt2, HiChevronLeft, HiIdentification
} from 'react-icons/hi'
import { selectAuth, logout } from '../../store/slices/authSlice'
import { selectNotifications } from '../../store/slices/notificationSlice'

// Profile is intentionally NOT in this list — it's accessed by clicking the user
// avatar in the Header (top-right).
const navItems = [
  { path: '/dashboard',     label: 'Dashboard',     icon: HiHome,           roles: ['ADMIN', 'OWNER', 'WARDEN', 'STUDENT', 'STAFF'] },
  { path: '/hostels',       label: 'Hostels',       icon: HiOfficeBuilding, roles: ['ADMIN', 'OWNER'] },
  { path: '/users',         label: 'Staff & Users', icon: HiIdentification, roles: ['ADMIN', 'OWNER', 'WARDEN'] },
  { path: '/students',      label: 'Students',      icon: HiAcademicCap,    roles: ['ADMIN', 'OWNER', 'WARDEN'] },
  { path: '/rooms',         label: 'Rooms',         icon: HiCollection,     roles: ['ADMIN', 'OWNER', 'WARDEN'] },
  { path: '/allocations',   label: 'Allocations',   icon: HiUserGroup,      roles: ['ADMIN', 'OWNER', 'WARDEN'] },
  { path: '/payments',      label: 'Payments',      icon: HiCreditCard,     roles: ['ADMIN', 'OWNER', 'WARDEN', 'STUDENT'] },
  { path: '/complaints',    label: 'Complaints',    icon: HiChatAlt2,       roles: ['ADMIN', 'WARDEN', 'STUDENT'] },
  { path: '/attendance',    label: 'Attendance',    icon: HiClipboardList,  roles: ['ADMIN', 'WARDEN', 'STUDENT'] },
  { path: '/visitors',      label: 'Visitors',      icon: HiUserGroup,      roles: ['ADMIN', 'WARDEN', 'STUDENT'] },
  { path: '/notifications', label: 'Notifications', icon: HiBell,           roles: ['ADMIN', 'OWNER', 'WARDEN', 'STUDENT', 'STAFF'] },
]

export default function Sidebar({ isOpen, onToggle }) {
  const { role, user } = useSelector(selectAuth)
  const { unreadCount } = useSelector(selectNotifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const filteredNav = navItems.filter(item => item.roles.includes(role))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-slate-800 dark:bg-slate-900 h-full flex flex-col transition-all duration-300 flex-shrink-0 shadow-xl`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-pink-500/30">S</div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm">Swastik Homz</p>
              <p className="text-pink-300/80 text-[10px] uppercase tracking-wider">Raipur · Girls</p>
            </div>
          </div>
        )}
        <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors p-1 rounded">
          {isOpen ? <HiChevronLeft size={20} /> : <HiMenuAlt2 size={20} />}
        </button>
      </div>

      {/* User info */}
      {isOpen && (
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.email || 'User'}</p>
              <p className="text-slate-400 text-xs">{role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
            title={!isOpen ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {isOpen && (
              <span className="flex-1 text-sm font-medium">{label}</span>
            )}
            {isOpen && path === '/notifications' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full"
          title={!isOpen ? 'Logout' : undefined}
        >
          <HiLogout size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}

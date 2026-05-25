import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HiMenuAlt2, HiSun, HiMoon, HiBell } from 'react-icons/hi'
import { toggleTheme, selectTheme } from '../../store/slices/themeSlice'
import { selectAuth } from '../../store/slices/authSlice'
import { fetchUnreadCount, selectNotifications } from '../../store/slices/notificationSlice'

export default function Header({ onMenuClick }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector(selectTheme)
  const { user } = useSelector(selectAuth)
  const { unreadCount } = useSelector(selectNotifications)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUnreadCount(user.id))
      const interval = setInterval(() => dispatch(fetchUnreadCount(user.id)), 30000)
      return () => clearInterval(interval)
    }
  }, [user?.id, dispatch])

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <HiMenuAlt2 size={22} />
        </button>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Swastik Homz Raipur</h1>
        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">Girls Hostel</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiBell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity group"
          title="My profile"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-pink-400/30 group-hover:ring-2 group-hover:ring-pink-300 transition-all">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">View profile</p>
          </div>
        </button>
      </div>
    </header>
  )
}

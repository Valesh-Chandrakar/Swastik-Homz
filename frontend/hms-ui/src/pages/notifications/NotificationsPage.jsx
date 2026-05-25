import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HiBell, HiCheck } from 'react-icons/hi'
import { notificationApi } from '../../api/notificationApi'
import { selectAuth } from '../../store/slices/authSlice'
import { fetchUnreadCount } from '../../store/slices/notificationSlice'
import toast from 'react-hot-toast'

const typeColors = {
  RENT_DUE: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  COMPLAINT_UPDATE: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  ALLOCATION_UPDATE: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  GENERAL: 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700',
  VISITOR_APPROVAL: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
}

const typeLabel = {
  RENT_DUE: 'Rent Due',
  COMPLAINT_UPDATE: 'Complaint',
  ALLOCATION_UPDATE: 'Allocation',
  GENERAL: 'General',
  VISITOR_APPROVAL: 'Visitor',
}

export default function NotificationsPage() {
  const { user } = useSelector(selectAuth)
  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await notificationApi.getByUser(user.id, 0, 50)
      setNotifications(res.data.data.content || [])
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchNotifications() }, [user?.id])

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      dispatch(fetchUnreadCount(user.id))
    } catch { }
  }

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      dispatch(fetchUnreadCount(user.id))
      toast.success('All notifications marked as read')
    } catch { }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-2 text-sm">
            <HiCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <HiBell size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No notifications yet</p>
          <p className="text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 transition-all ${typeColors[n.type] || typeColors.GENERAL} ${!n.isRead ? 'shadow-sm' : 'opacity-70'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{n.title}</p>
                    {n.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-300">
                        {typeLabel[n.type] || n.type}
                      </span>
                    )}
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {n.createdAt?.replace('T', ' ').substring(0, 16)}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex-shrink-0 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import {
  HiOfficeBuilding, HiUsers, HiCollection, HiCreditCard, HiChatAlt2, HiClipboardList,
  HiCheckCircle, HiCurrencyRupee
} from 'react-icons/hi'
import { selectAuth } from '../../store/slices/authSlice'
import { useAdminDashboardStats } from '../../hooks/useDashboardStats'
import StatCard from '../../components/ui/StatCard'

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

export default function DashboardPage() {
  const { role } = useSelector(selectAuth)
  const { stats, occupancyData, complaintData, loading } = useAdminDashboardStats()

  if (role === 'STUDENT') {
    return <StudentDashboard />
  }

  const adminStats = [
    { title: 'Total Hostels',      value: stats.totalHostels,                                                  icon: HiOfficeBuilding, color: 'pink'   },
    { title: 'Total Students',     value: stats.totalStudents,                                                 icon: HiUsers,          color: 'green'  },
    { title: 'Occupied Beds',      value: `${stats.occupiedBeds}/${stats.occupiedBeds + stats.vacantBeds}`,    icon: HiCollection,     color: 'purple' },
    { title: 'Vacant Rooms',       value: stats.vacantRooms,                                                   icon: HiCheckCircle,    color: 'blue'   },
    { title: 'Pending Payments',   value: stats.pendingPayments,                                               icon: HiCreditCard,     color: 'yellow' },
    { title: 'Open Complaints',    value: stats.openComplaints,                                                icon: HiChatAlt2,       color: 'red'    },
    { title: "Today's Attendance", value: stats.todayAttendance,                                               icon: HiClipboardList,  color: 'blue'   },
    { title: 'Est. Revenue (mo)',  value: `₹${(stats.totalRevenue / 1000).toFixed(0)}k`,                       icon: HiCurrencyRupee,  color: 'green'  },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {loading ? 'Loading stats…' : 'Live data across all hostels'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          loading
            ? <SkeletonStatCard key={stat.title} />
            : <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bed Occupancy by Hostel</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {stats.occupiedBeds} occupied · {stats.vacantBeds} available
                </p>
              </div>
            </div>
            {occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                  <Legend />
                  <Bar dataKey="occupied" fill="#ec4899" name="Occupied" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="available" fill="#10b981" name="Available" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No rooms registered yet" />
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Complaint Status</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {complaintData.reduce((s, c) => s + c.value, 0)} total
              </p>
            </div>
            {complaintData.some((c) => c.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={complaintData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {complaintData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No complaints raised yet" />
            )}
          </div>
        </div>
      )}

      {!loading && stats.totalHostels === 0 && (
        <div className="card text-center py-12 border-2 border-dashed border-pink-200 dark:border-pink-800">
          <HiOfficeBuilding size={48} className="mx-auto text-pink-300 dark:text-pink-700 mb-3" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No hostels registered yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Go to the Hostels page and add your first hostel to get started.
          </p>
        </div>
      )}
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! 👋</p>
      </div>
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Use the sidebar to view your room, pay rent, raise complaints, and track electricity.
        </p>
      </div>
    </div>
  )
}

function SkeletonStatCard() {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-8 w-16" />
        </div>
        <div className="skeleton w-12 h-12 rounded-xl" />
      </div>
    </div>
  )
}

function EmptyChart({ message }) {
  return (
    <div className="flex items-center justify-center h-[250px]">
      <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
    </div>
  )
}

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectTheme } from './store/slices/themeSlice'
import { selectAuth } from './store/slices/authSlice'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import StudentsPage from './pages/students/StudentsPage'
import UsersPage from './pages/users/UsersPage'
import HostelsPage from './pages/hostels/HostelsPage'
import RoomsPage from './pages/rooms/RoomsPage'
import AllocationsPage from './pages/allocations/AllocationsPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import ComplaintsPage from './pages/complaints/ComplaintsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import VisitorsPage from './pages/visitors/VisitorsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedRoute({ children }) {
  const { token } = useSelector(selectAuth)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="hostels" element={<HostelsPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="allocations" element={<AllocationsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="visitors" element={<VisitorsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

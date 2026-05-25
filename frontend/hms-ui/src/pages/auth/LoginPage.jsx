import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineSparkles, HiOutlineMail, HiOutlineLockClosed, HiOutlineOfficeBuilding, HiOutlineHome } from 'react-icons/hi'
import { loginAsync, selectAuth, clearError } from '../../store/slices/authSlice'
import { hostelApi } from '../../api/hostelApi'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', hostelId: '' })
  const [hostels, setHostels] = useState([])
  const [hostelsLoading, setHostelsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector(selectAuth)

  useEffect(() => { if (token) navigate('/dashboard') }, [token, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error, { id: 'login-error' }) // id prevents duplicate stacking
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Public listing of hostels for login screen — students/wardens to identify their hostel
  useEffect(() => {
    const fetchHostels = async () => {
      setHostelsLoading(true)
      try {
        const res = await hostelApi.getAll(0, 100, '')
        const list = res.data?.data?.content || []
        setHostels(list)
        // Auto-select the first hostel if available (user can change after)
        if (list.length > 0) {
          setForm((f) => f.hostelId ? f : { ...f, hostelId: String(list[0].id) })
        }
      } catch {
        // Silently fail — hostel field is optional for admins/owners
      } finally {
        setHostelsLoading(false)
      }
    }
    fetchHostels()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginAsync({ email: form.email, password: form.password }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 dark:from-rose-950 dark:via-pink-950 dark:to-purple-950">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col text-center lg:text-left text-gray-800 dark:text-gray-100 space-y-6 p-8">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-300/50">
              <HiOutlineHome size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Swastik Homz</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">Raipur · Girls Hostel</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">
            A safe & happy<br/>
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">home away from home</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Premier girls residency in the heart of Raipur. Secure rooms, healthy food, 24×7 warden support,
            and a community that feels like family. ✨
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md pt-4">
            {[
              { label: 'Rooms', value: '120+' },
              { label: 'Residents', value: '300+' },
              { label: 'Years', value: '8+' },
            ].map((s) => (
              <div key={s.label} className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-pink-200/50 dark:border-pink-700/30">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{s.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
            <HiOutlineSparkles className="text-pink-500" />
            <span>For girls, by women — every space designed with care</span>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile branding (only on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-lg shadow-pink-300/50">
              <HiOutlineHome size={32} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Swastik Homz Raipur</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">Girls Hostel Management</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-200/40 dark:shadow-pink-900/20 p-8 border border-white/50 dark:border-gray-700/50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back 👋</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                  <input type="email" className="input pl-10" placeholder="your@email.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                  <input type="password" className="input pl-10" placeholder="••••••••" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="label">Your Hostel <span className="text-xs text-gray-400 font-normal">(students & wardens)</span></label>
                <div className="relative">
                  <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                  <select className="input pl-10 appearance-none" value={form.hostelId}
                    onChange={(e) => setForm({ ...form, hostelId: e.target.value })}>
                    <option value="">Select hostel (optional for admin/owner)</option>
                    {hostelsLoading && <option disabled>Loading hostels…</option>}
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</span>
                  : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New to Swastik Homz?{' '}
                <Link to="/register" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold hover:underline">Create account</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            © 2026 Swastik Homz Raipur · All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}

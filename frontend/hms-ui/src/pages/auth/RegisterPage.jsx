import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiOutlineUser, HiOutlineHome, HiOutlineUserGroup } from 'react-icons/hi'
import { registerAsync, selectAuth, clearError, clearRegistrationSuccess } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

// Self-registration is intentionally restricted to STUDENT and STAFF only.
// ADMIN / OWNER / WARDEN accounts must be created internally by an admin.
const selfRegisterableRoles = ['STUDENT', 'STAFF']

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', phone: '', password: '', role: 'STUDENT' })
  const [phoneError, setPhoneError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, registrationSuccess } = useSelector(selectAuth)

  useEffect(() => {
    if (registrationSuccess) {
      toast.success('Account created! Please log in to continue.', { id: 'register-success' })
      dispatch(clearRegistrationSuccess())
      navigate('/login')
    }
  }, [registrationSuccess, navigate, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error, { id: 'register-error' })
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handlePhoneChange = (e) => {
    // Only digits, max 10
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setForm({ ...form, phone: value })
    if (value.length > 0 && value.length < 10) {
      setPhoneError('Phone number must be exactly 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setPhoneError('Phone number must be exactly 10 digits')
      toast.error('Please enter a valid 10-digit phone number', { id: 'phone-error' })
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters', { id: 'pwd-error' })
      return
    }
    dispatch(registerAsync(form))
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 dark:from-rose-950 dark:via-pink-950 dark:to-purple-950">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-lg shadow-pink-300/50">
            <HiOutlineHome size={32} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Swastik Homz Raipur</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Create your account</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-200/40 dark:shadow-pink-900/20 p-8 border border-white/50 dark:border-gray-700/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Get Started</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register as a student or staff member</p>
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
              <label className="label">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={`input pl-10 ${phoneError ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
              {!phoneError && form.phone.length === 10 && <p className="text-xs text-green-600 mt-1">✓ Valid phone number</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                <input type="password" className="input pl-10" placeholder="At least 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
            </div>

            <div>
              <label className="label">I am a…</label>
              <div className="relative">
                <HiOutlineUserGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                <select className="input pl-10 appearance-none" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {selfRegisterableRoles.map((r) => (
                    <option key={r} value={r}>{r === 'STUDENT' ? 'Student / Resident' : 'Staff Member'}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400 mt-1">Warden/Owner/Admin accounts are created internally.</p>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={loading || !!phoneError}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          © 2026 Swastik Homz Raipur · All rights reserved
        </p>
      </div>
    </div>
  )
}

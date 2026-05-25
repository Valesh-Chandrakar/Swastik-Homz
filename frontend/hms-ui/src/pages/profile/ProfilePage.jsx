import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { HiPencil, HiCheck, HiUserAdd, HiInformationCircle } from 'react-icons/hi'
import { userApi } from '../../api/userApi'
import { selectAuth } from '../../store/slices/authSlice'
import Badge from '../../components/ui/Badge'
import HostelSelect from '../../components/ui/HostelSelect'
import PhoneInput from '../../components/ui/PhoneInput'
import toast from 'react-hot-toast'

const emptyForm = {
  firstName: '', lastName: '', phone: '', address: '',
  city: '', state: '', emergencyContact: '', emergencyPhone: '',
  hostelId: '',
}

export default function ProfilePage() {
  const { user, role } = useSelector(selectAuth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profileMissing, setProfileMissing] = useState(false)
  const [form, setForm] = useState(emptyForm)

  // StrictMode runs effects twice in dev — guard against duplicate fetches/toasts
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!user?.id || fetchedRef.current) return
    fetchedRef.current = true

    setLoading(true)
    userApi.getByAuthId(user.id)
      .then(res => {
        const data = res.data.data
        setProfile(data)
        setProfileMissing(false)
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          hostelId: data.hostelId || '',
        })
      })
      .catch(() => {
        // Profile doesn't exist yet (newly registered user) — show "Complete Profile" form, not an error
        setProfileMissing(true)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First name and last name are required', { id: 'profile-validate' })
      return false
    }
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      toast.error('Phone must be a valid 10-digit number', { id: 'profile-validate' })
      return false
    }
    if (form.emergencyPhone && !/^[6-9][0-9]{9}$/.test(form.emergencyPhone)) {
      toast.error('Emergency phone must be a valid 10-digit number', { id: 'profile-validate' })
      return false
    }
    if (role === 'STUDENT' && !form.hostelId) {
      toast.error('Please select your hostel', { id: 'profile-validate' })
      return false
    }
    return true
  }

  const handleCreateProfile = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        email: user.email,
        role,
        authId: user.id,
        hostelId: form.hostelId ? Number(form.hostelId) : null,
      }
      const res = await userApi.create(payload)
      setProfile(res.data.data)
      setProfileMissing(false)
      toast.success('Profile created successfully!', { id: 'profile-success' })
    } catch { /* axios interceptor will toast */ } finally {
      setSaving(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (!profile?.id) return
    setSaving(true)
    try {
      const res = await userApi.update(profile.id, {
        ...profile,
        ...form,
        hostelId: form.hostelId ? Number(form.hostelId) : null,
      })
      setProfile(res.data.data)
      toast.success('Profile updated successfully', { id: 'profile-success' })
      setEditMode(false)
    } catch { } finally { setSaving(false) }
  }

  const roleVariant = (r) => ({
    STUDENT: 'info', WARDEN: 'success', ADMIN: 'danger', OWNER: 'warning', STAFF: 'gray'
  })[r] || 'gray'

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // === "Complete Profile" form for newly registered users ===
  if (profileMissing) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complete Your Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome to Swastik Homz! Tell us a bit about yourself to finish setting up your account.
          </p>
        </div>

        <div className="card border-2 border-dashed border-pink-300 dark:border-pink-700 bg-pink-50/50 dark:bg-pink-900/10">
          <div className="flex items-start gap-3 mb-4">
            <HiInformationCircle className="text-pink-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">First time here?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Your account is created — now add your personal details. You can edit these later.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input className="input" value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })} required autoFocus />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input className="input" value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })} required />
              </div>
              <PhoneInput
                label="Phone Number * (10 digits)"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                required
              />
              <div>
                <label className="label">Your Hostel {role === 'STUDENT' ? '*' : ''}</label>
                <HostelSelect
                  value={form.hostelId}
                  onChange={(id) => setForm({ ...form, hostelId: id })}
                  required={role === 'STUDENT'}
                />
              </div>
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Raipur" />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Chhattisgarh" />
              </div>
              <div className="col-span-2">
                <label className="label">Address</label>
                <input className="input" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
              </div>
              <div>
                <label className="label">Emergency Contact Name *</label>
                <input className="input" value={form.emergencyContact}
                  onChange={e => setForm({ ...form, emergencyContact: e.target.value })}
                  placeholder="Parent / guardian name" required />
              </div>
              <PhoneInput
                label="Emergency Phone * (10 digits)"
                value={form.emergencyPhone}
                onChange={(v) => setForm({ ...form, emergencyPhone: v })}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit"
                className="px-6 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-300/40 flex items-center gap-2"
                disabled={saving}>
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><HiUserAdd size={18} /> Create Profile</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // === Normal Profile view + edit ===
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and update your personal information</p>
      </div>

      {/* Profile Header Card */}
      <div className="card flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-md shadow-pink-400/30">
          {form.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {form.firstName && form.lastName
                ? `${form.firstName} ${form.lastName}`
                : user?.email || 'User'}
            </h3>
            <Badge variant={roleVariant(role)}>{role}</Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
          {profile?.hostelId && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Hostel #{profile.hostelId}</p>
          )}
        </div>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="btn-secondary flex items-center gap-2 flex-shrink-0">
            <HiPencil size={16} /> Edit
          </button>
        )}
      </div>

      {/* Personal Info Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h4>
          {editMode && (
            <button onClick={() => setEditMode(false)} className="btn-secondary text-sm px-3 py-1.5">Cancel</button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              {editMode
                ? <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.firstName || '—'}</p>
              }
            </div>
            <div>
              <label className="label">Last Name</label>
              {editMode
                ? <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.lastName || '—'}</p>
              }
            </div>
            <div className="col-span-2">
              <label className="label">Email Address</label>
              <p className="text-gray-500 dark:text-gray-400 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                {user?.email} <span className="text-xs text-gray-400">(cannot be changed)</span>
              </p>
            </div>
            <div>
              <label className="label">Phone Number</label>
              {editMode
                ? <PhoneInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.phone || '—'}</p>
              }
            </div>
            <div>
              <label className="label">City</label>
              {editMode
                ? <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.city || '—'}</p>
              }
            </div>
            <div>
              <label className="label">State</label>
              {editMode
                ? <input className="input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.state || '—'}</p>
              }
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              {editMode
                ? <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.address || '—'}</p>
              }
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Emergency Contact</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Name</label>
                {editMode
                  ? <input className="input" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                  : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.emergencyContact || '—'}</p>
                }
              </div>
              <div>
                <label className="label">Contact Phone</label>
                {editMode
                  ? <PhoneInput value={form.emergencyPhone} onChange={(v) => setForm({ ...form, emergencyPhone: v })} />
                  : <p className="text-gray-900 dark:text-gray-100 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">{form.emergencyPhone || '—'}</p>
                }
              </div>
            </div>
          </div>

          {editMode && (
            <div className="flex justify-end pt-2">
              <button type="submit"
                className="px-6 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-300/40 flex items-center gap-2"
                disabled={saving}>
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><HiCheck size={16} /> Save Changes</>
                }
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Details */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Details</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">User ID</span>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">#{user?.id}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
            <Badge variant={roleVariant(role)}>{role}</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Profile ID</span>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">#{profile?.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

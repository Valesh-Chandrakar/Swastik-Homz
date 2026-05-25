import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus, HiPencil, HiTrash, HiUserGroup } from 'react-icons/hi'
import { userApi } from '../../api/userApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import SearchBar from '../../components/ui/SearchBar'
import Badge from '../../components/ui/Badge'
import HostelSelect from '../../components/ui/HostelSelect'
import PhoneInput from '../../components/ui/PhoneInput'
import toast from 'react-hot-toast'

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '',
  role: 'WARDEN',
  hostelId: '',
  emergencyContact: '', emergencyPhone: '',
  authId: 1,
}

// Roles each privileged user can create (excludes STUDENT — that's a separate page)
const allowedRoleMap = {
  ADMIN:  ['ADMIN', 'OWNER', 'WARDEN', 'STAFF'],
  OWNER:  ['WARDEN', 'STAFF'],
  WARDEN: ['STAFF'],
}

// Filter tabs at the top
const ROLE_TABS = ['ALL', 'ADMIN', 'OWNER', 'WARDEN', 'STAFF']

export default function UsersPage() {
  const { role: currentRole, user: currentUser } = useSelector(selectAuth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const allowedRoles = useMemo(() => allowedRoleMap[currentRole] || [], [currentRole])
  const canManage = allowedRoles.length > 0

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.getAll(0, 500, search)
      const all = res.data.data.content || []
      // Exclude students from this page
      setUsers(all.filter((u) => u.role !== 'STUDENT'))
    } catch { } finally { setLoading(false) }
  }, [search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = useMemo(() => {
    if (activeTab === 'ALL') return users
    return users.filter((u) => u.role === activeTab)
  }, [users, activeTab])

  const pageSize = 10
  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const openCreate = () => {
    setEditItem(null)
    setForm({ ...emptyForm, role: allowedRoles[0] || 'WARDEN' })
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setEditItem(u)
    setForm({
      ...emptyForm,
      ...u,
      hostelId: u.hostelId || '',
      phone: u.phone || '',
      emergencyPhone: u.emergencyPhone || '',
    })
    setModalOpen(true)
  }

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required', { id: 'validate' })
      return false
    }
    if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      toast.error('Phone must be exactly 10 digits (starts with 6–9)', { id: 'validate' })
      return false
    }
    if (form.role === 'WARDEN' && !form.hostelId) {
      toast.error('Wardens must be assigned to a hostel', { id: 'validate' })
      return false
    }
    if (form.emergencyPhone && !/^[6-9][0-9]{9}$/.test(form.emergencyPhone)) {
      toast.error('Emergency phone must be 10 digits if provided', { id: 'validate' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const payload = { ...form, hostelId: form.hostelId ? Number(form.hostelId) : null }
      if (editItem) {
        await userApi.update(editItem.id, payload)
        toast.success('User updated', { id: 'user-success' })
      } else {
        await userApi.create(payload)
        toast.success('User created', { id: 'user-success' })
      }
      setModalOpen(false)
      fetchUsers()
    } catch { }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try { await userApi.delete(id); toast.success('Deleted', { id: 'del' }); fetchUsers() } catch { }
  }

  const roleVariant = (r) => ({
    ADMIN: 'danger', OWNER: 'warning', WARDEN: 'success', STAFF: 'gray'
  })[r] || 'gray'

  const tabCount = (role) => role === 'ALL' ? users.length : users.filter((u) => u.role === role).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <HiUserGroup className="text-pink-500" /> Staff & Users
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage admins, owners, wardens, and staff. Students are on the Students page.
          </p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Add User
          </button>
        )}
      </div>

      {/* Role tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex gap-1 overflow-x-auto">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(0) }}
            className={`flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search users by name or email..." />
        </div>
        <Table headers={['Name', 'Email', 'Phone', 'Role', 'Hostel', 'Actions']} loading={loading}>
          {pageRows.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                    {u.firstName?.[0]}{u.lastName?.[0]}
                  </div>
                  <p className="font-medium">{u.firstName} {u.lastName}</p>
                </div>
              </Td>
              <Td className="text-gray-500 dark:text-gray-400">{u.email}</Td>
              <Td>{u.phone}</Td>
              <Td><Badge variant={roleVariant(u.role)}>{u.role}</Badge></Td>
              <Td>{u.hostelId ? `#${u.hostelId}` : '—'}</Td>
              <Td>
                {canManage && (
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-pink-600 hover:text-pink-800 dark:text-pink-400"><HiPencil size={18} /></button>
                    {currentRole === 'ADMIN' && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 dark:text-red-400"><HiTrash size={18} /></button>
                    )}
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit User' : 'Add User'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <PhoneInput
              label="Phone Number * (10 digits)"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              required
            />
            <div>
              <label className="label">Role *</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={!!editItem}>
                {allowedRoles.map((r) => <option key={r}>{r}</option>)}
              </select>
              {form.role === 'STAFF' && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠ Staff are workers — they don't get rooms allocated.
                </p>
              )}
            </div>
            <div>
              <label className="label">Hostel {form.role === 'WARDEN' ? '*' : '(optional)'}</label>
              <HostelSelect
                value={form.hostelId}
                onChange={(id) => setForm({ ...form, hostelId: id })}
                ownerId={currentRole === 'OWNER' ? currentUser?.id : undefined}
                required={form.role === 'WARDEN'}
              />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="label">Emergency Contact Name</label>
              <input className="input" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            </div>
            <PhoneInput
              label="Emergency Contact Phone"
              value={form.emergencyPhone}
              onChange={(v) => setForm({ ...form, emergencyPhone: v })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

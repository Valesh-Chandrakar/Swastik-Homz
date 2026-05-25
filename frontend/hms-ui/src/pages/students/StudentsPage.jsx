import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus, HiPencil, HiTrash, HiAcademicCap } from 'react-icons/hi'
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
  role: 'STUDENT',
  hostelId: '',
  emergencyContact: '', emergencyPhone: '',
  authId: 1,
}

// ADMIN / OWNER / WARDEN can create students.
const canCreateStudent = (role) => ['ADMIN', 'OWNER', 'WARDEN'].includes(role)

export default function StudentsPage() {
  const { role: currentRole, user: currentUser } = useSelector(selectAuth)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // We fetch all users and filter STUDENT client-side because the user-service doesn't expose
  // a "by role" paged endpoint. For larger deployments this would need a dedicated endpoint.
  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.getAll(0, 500, search)
      const all = res.data.data.content || []
      setStudents(all.filter((u) => u.role === 'STUDENT'))
    } catch { } finally { setLoading(false) }
  }, [search])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // client-side pagination over the filtered set
  const pageSize = 10
  const totalPages = Math.ceil(students.length / pageSize)
  const pageRows = students.slice(page * pageSize, (page + 1) * pageSize)

  const openCreate = () => {
    setEditItem(null)
    setForm({ ...emptyForm, role: 'STUDENT' })
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setEditItem(u)
    setForm({
      ...emptyForm,
      ...u,
      role: 'STUDENT',
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
    if (!form.hostelId) {
      toast.error('Please select a hostel for the student', { id: 'validate' })
      return false
    }
    // Emergency contact is MANDATORY for students
    if (!form.emergencyContact.trim()) {
      toast.error('Emergency contact name is required for students', { id: 'validate' })
      return false
    }
    if (!/^[6-9][0-9]{9}$/.test(form.emergencyPhone)) {
      toast.error('Emergency contact phone must be exactly 10 digits', { id: 'validate' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const payload = { ...form, role: 'STUDENT', hostelId: form.hostelId ? Number(form.hostelId) : null }
      if (editItem) {
        await userApi.update(editItem.id, payload)
        toast.success('Student updated', { id: 'student-success' })
      } else {
        await userApi.create(payload)
        toast.success('Student created', { id: 'student-success' })
      }
      setModalOpen(false)
      fetchStudents()
    } catch { /* interceptor toasts */ }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try { await userApi.delete(id); toast.success('Deleted', { id: 'del' }); fetchStudents() } catch { }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <HiAcademicCap className="text-pink-500" /> Students
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage student residents — {students.length} total</p>
        </div>
        {canCreateStudent(currentRole) && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Add Student
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search students by name or email..." />
        </div>
        <Table headers={['Name', 'Email', 'Phone', 'Hostel', 'Emergency', 'Actions']} loading={loading}>
          {pageRows.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs font-semibold">
                    {u.firstName?.[0]}{u.lastName?.[0]}
                  </div>
                  <p className="font-medium">{u.firstName} {u.lastName}</p>
                </div>
              </Td>
              <Td className="text-gray-500 dark:text-gray-400">{u.email}</Td>
              <Td>{u.phone}</Td>
              <Td>{u.hostelId ? <Badge variant="info">#{u.hostelId}</Badge> : '—'}</Td>
              <Td>
                <div className="text-xs">
                  <p className="font-medium">{u.emergencyContact || '—'}</p>
                  <p className="text-gray-400">{u.emergencyPhone || ''}</p>
                </div>
              </Td>
              <Td>
                {canCreateStudent(currentRole) && (
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Student' : 'Add Student'} size="lg">
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
              <label className="label">Hostel *</label>
              <HostelSelect
                value={form.hostelId}
                onChange={(id) => setForm({ ...form, hostelId: id })}
                ownerId={currentRole === 'OWNER' ? currentUser?.id : undefined}
                required
              />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          {/* Emergency contact — required for all students */}
          <div className="rounded-xl border-2 border-pink-200 dark:border-pink-800 bg-pink-50/40 dark:bg-pink-900/10 p-4">
            <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
              🚨 Emergency Contact (required)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Name *</label>
                <input
                  className="input"
                  placeholder="Parent / guardian name"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  required
                />
              </div>
              <PhoneInput
                label="Contact Phone * (10 digits)"
                value={form.emergencyPhone}
                onChange={(v) => setForm({ ...form, emergencyPhone: v })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Student</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

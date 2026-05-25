import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus, HiLogout } from 'react-icons/hi'
import { allocationApi } from '../../api/allocationApi'
import { userApi } from '../../api/userApi'
import { roomApi } from '../../api/roomApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import HostelSelect from '../../components/ui/HostelSelect'
import toast from 'react-hot-toast'

const emptyForm = { studentId: '', hostelId: '', roomId: '', bedNumber: 1, remarks: '' }

export default function AllocationsPage() {
  const { role, user, hostelId: userHostelId } = useSelector(selectAuth)
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  // Filter dropdowns within the modal
  const [studentsInHostel, setStudentsInHostel] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [vacateModal, setVacateModal] = useState(null)
  const [vacateRemarks, setVacateRemarks] = useState('')

  const canAllocate = ['ADMIN', 'OWNER', 'WARDEN'].includes(role)
  // Filter scope for the table: warden sees only their own hostel
  const filterHostelId = role === 'WARDEN' || role === 'OWNER' ? userHostelId : null

  const fetchAllocations = useCallback(async () => {
    setLoading(true)
    try {
      // Pick a hostel scope; if user has no hostel, fall back to hostel 1 (admin sees first one)
      const targetHostel = filterHostelId || 1
      const res = await allocationApi.getByHostel(targetHostel, page, 10)
      setAllocations(res.data?.data?.content || [])
      setTotalPages(res.data?.data?.totalPages || 0)
    } catch { } finally { setLoading(false) }
  }, [page, filterHostelId])

  useEffect(() => { fetchAllocations() }, [fetchAllocations])

  // When hostel is picked in the modal, load STUDENT users + available rooms for that hostel
  useEffect(() => {
    if (!modalOpen || !form.hostelId) {
      setStudentsInHostel([])
      setAvailableRooms([])
      return
    }
    const load = async () => {
      try {
        const [usersRes, roomsRes] = await Promise.all([
          userApi.getByHostel(form.hostelId),
          roomApi.getAvailable(form.hostelId),
        ])
        const allUsers = Array.isArray(usersRes.data?.data) ? usersRes.data.data : []
        // Only STUDENTS can be allocated to rooms (staff are workers — no allocation)
        setStudentsInHostel(allUsers.filter((u) => u.role === 'STUDENT'))
        setAvailableRooms(Array.isArray(roomsRes.data?.data) ? roomsRes.data.data : [])
      } catch {
        setStudentsInHostel([])
        setAvailableRooms([])
      }
    }
    load()
  }, [modalOpen, form.hostelId])

  const openCreate = () => {
    setForm({ ...emptyForm, hostelId: userHostelId || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentId || !form.roomId || !form.hostelId) {
      toast.error('Please select student, hostel, and room')
      return
    }
    try {
      await allocationApi.allocate({
        studentId: Number(form.studentId),
        hostelId: Number(form.hostelId),
        roomId: Number(form.roomId),
        bedNumber: Number(form.bedNumber),
        allocationDate: new Date().toISOString().split('T')[0],
        remarks: form.remarks,
      })
      toast.success('Student allocated successfully')
      setModalOpen(false)
      fetchAllocations()
    } catch { }
  }

  const handleVacate = async (e) => {
    e.preventDefault()
    try {
      await allocationApi.vacate(vacateModal.id, vacateRemarks)
      toast.success('Student vacated')
      setVacateModal(null)
      setVacateRemarks('')
      fetchAllocations()
    } catch { }
  }

  const statusVariant = (s) => ({ ACTIVE: 'success', VACATED: 'gray', PENDING: 'warning' })[s] || 'gray'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Room Allocations</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Assign students to beds and manage occupancy</p>
        </div>
        {canAllocate && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> New Allocation
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <Table headers={['ID', 'Student ID', 'Room ID', 'Bed', 'Allocation Date', 'Vacate Date', 'Status', 'Actions']} loading={loading}>
          {allocations.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td>#{a.id}</Td>
              <Td>#{a.studentId}</Td>
              <Td>#{a.roomId}</Td>
              <Td>{a.bedNumber}</Td>
              <Td>{a.allocationDate}</Td>
              <Td className="text-gray-500 dark:text-gray-400">{a.vacateDate || '—'}</Td>
              <Td><Badge variant={statusVariant(a.status)}>{a.status}</Badge></Td>
              <Td>
                {a.status === 'ACTIVE' && canAllocate && (
                  <button onClick={() => { setVacateModal(a); setVacateRemarks('') }} className="text-red-600 hover:text-red-800 dark:text-red-400 flex items-center gap-1 text-sm font-medium">
                    <HiLogout size={16} /> Vacate
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Create allocation */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Allocation" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 p-3 text-sm text-pink-700 dark:text-pink-300">
            ℹ Only <strong>students</strong> can be allocated to rooms. Staff are workers — they don't get room allocations.
          </div>

          <div>
            <label className="label">Hostel *</label>
            <HostelSelect
              value={form.hostelId}
              onChange={(id) => setForm({ ...form, hostelId: id, studentId: '', roomId: '' })}
              required
            />
          </div>

          <div>
            <label className="label">Student *</label>
            <select className="input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required disabled={!form.hostelId}>
              <option value="">{form.hostelId ? 'Select student' : 'Pick a hostel first'}</option>
              {studentsInHostel.map((s) => (
                <option key={s.id} value={s.authId || s.id}>
                  {s.firstName} {s.lastName} — {s.email}
                </option>
              ))}
            </select>
            {form.hostelId && studentsInHostel.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No students found in this hostel. Create some on the Students page first.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Available Room *</label>
              <select className="input" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} required disabled={!form.hostelId}>
                <option value="">{form.hostelId ? 'Select room' : 'Pick a hostel first'}</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} · {r.seaterType} · {r.acType} · {r.availableBeds} beds free · ₹{r.baseRent}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Bed Number *</label>
              <input type="number" min="1" max="4" className="input" value={form.bedNumber}
                onChange={(e) => setForm({ ...form, bedNumber: Number(e.target.value) })} required />
            </div>
          </div>

          <div>
            <label className="label">Remarks</label>
            <input className="input" placeholder="Optional notes" value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Allocate</button>
          </div>
        </form>
      </Modal>

      {/* Vacate confirm */}
      <Modal isOpen={!!vacateModal} onClose={() => setVacateModal(null)} title="Vacate Student">
        <form onSubmit={handleVacate} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Confirm vacating allocation <strong>#{vacateModal?.id}</strong>. The bed will be marked available immediately.
          </p>
          <div>
            <label className="label">Reason / Remarks</label>
            <input className="input" placeholder="e.g. Semester end, transfer to room 202..." value={vacateRemarks}
              onChange={(e) => setVacateRemarks(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setVacateModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-danger">Confirm Vacate</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

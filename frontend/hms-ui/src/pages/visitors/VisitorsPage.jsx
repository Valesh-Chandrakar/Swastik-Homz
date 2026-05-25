import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus, HiCheck, HiX, HiLogout } from 'react-icons/hi'
import { visitorApi } from '../../api/visitorApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import SearchBar from '../../components/ui/SearchBar'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const relations = ['PARENT', 'SIBLING', 'FRIEND', 'RELATIVE', 'GUARDIAN', 'OTHER']
const purposes = ['VISIT', 'EMERGENCY', 'DROPPING_LUGGAGE', 'OFFICIAL', 'OTHER']

const emptyForm = {
  visitorName: '', visitorPhone: '', relation: 'PARENT',
  purpose: 'VISIT', hostelId: 1, studentId: '', expectedDate: '', remarks: ''
}

export default function VisitorsPage() {
  const { user, role } = useSelector(selectAuth)
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectRemarks, setRejectRemarks] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [hostelIdFilter, setHostelIdFilter] = useState(1)

  const fetchVisitors = useCallback(async () => {
    setLoading(true)
    try {
      if (role === 'STUDENT') {
        const res = await visitorApi.getByStudent(user.id)
        setVisitors(Array.isArray(res.data.data) ? res.data.data : [])
      } else {
        const res = await visitorApi.getByHostel(hostelIdFilter, page, 10)
        setVisitors(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
      }
    } catch { } finally { setLoading(false) }
  }, [user?.id, role, hostelIdFilter, page])

  useEffect(() => { fetchVisitors() }, [fetchVisitors])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await visitorApi.register({
        ...form,
        studentId: role === 'STUDENT' ? user.id : Number(form.studentId),
        hostelId: Number(form.hostelId),
      })
      toast.success('Visitor registered successfully')
      setModalOpen(false); fetchVisitors()
    } catch { }
  }

  const handleApprove = async (id) => {
    try {
      await visitorApi.approve(id, user.id)
      toast.success('Visitor approved')
      fetchVisitors()
    } catch { }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    try {
      await visitorApi.reject(rejectModal.id, user.id, rejectRemarks)
      toast.success('Visitor rejected')
      setRejectModal(null); setRejectRemarks(''); fetchVisitors()
    } catch { }
  }

  const handleExit = async (id) => {
    try {
      await visitorApi.exit(id)
      toast.success('Exit recorded')
      fetchVisitors()
    } catch { }
  }

  const statusVariant = (s) => ({
    PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger', EXITED: 'gray'
  })[s] || 'gray'

  const filteredVisitors = search
    ? visitors.filter(v =>
        v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        v.visitorPhone?.includes(search)
      )
    : visitors

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Visitors</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage visitor registrations and approvals</p>
        </div>
        {(role === 'STUDENT' || role === 'ADMIN' || role === 'WARDEN') && (
          <button
            onClick={() => {
              setForm({ ...emptyForm, studentId: role === 'STUDENT' ? user.id : '' })
              setModalOpen(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <HiPlus size={18} /> Register Visitor
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search visitor name or phone..." />
          {role !== 'STUDENT' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hostel ID:</label>
              <input
                type="number" min="1" value={hostelIdFilter}
                onChange={e => { setHostelIdFilter(Number(e.target.value)); setPage(0) }}
                className="input w-24"
              />
            </div>
          )}
        </div>
        <Table
          headers={['Visitor Name', 'Phone', 'Relation', 'Purpose', 'Student ID', 'Expected Date', 'Status', 'Actions']}
          loading={loading}
          emptyMessage="No visitor records found"
        >
          {filteredVisitors.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td>
                <div className="font-medium">{v.visitorName}</div>
              </Td>
              <Td>{v.visitorPhone}</Td>
              <Td><Badge variant="info">{v.relation}</Badge></Td>
              <Td className="text-gray-500 dark:text-gray-400 text-xs">{v.purpose?.replace('_', ' ')}</Td>
              <Td>#{v.studentId}</Td>
              <Td className="text-gray-500 dark:text-gray-400 text-xs">
                {v.expectedDate || v.visitDate || '—'}
              </Td>
              <Td><Badge variant={statusVariant(v.status)}>{v.status}</Badge></Td>
              <Td>
                <div className="flex gap-2">
                  {(role === 'ADMIN' || role === 'WARDEN') && v.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(v.id)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 transition-colors"
                        title="Approve"
                      >
                        <HiCheck size={18} />
                      </button>
                      <button
                        onClick={() => { setRejectModal(v); setRejectRemarks('') }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 transition-colors"
                        title="Reject"
                      >
                        <HiX size={18} />
                      </button>
                    </>
                  )}
                  {(role === 'ADMIN' || role === 'WARDEN') && v.status === 'APPROVED' && (
                    <button
                      onClick={() => handleExit(v.id)}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 transition-colors flex items-center gap-1 text-xs font-medium"
                      title="Record Exit"
                    >
                      <HiLogout size={16} /> Exit
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        {role !== 'STUDENT' && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      {/* Register Visitor Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Visitor" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Visitor Name</label>
              <input className="input" value={form.visitorName}
                onChange={e => setForm({ ...form, visitorName: e.target.value })} required placeholder="Full name" />
            </div>
            <div>
              <label className="label">Visitor Phone (10 digits)</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                className="input"
                value={form.visitorPhone}
                onChange={e => setForm({ ...form, visitorPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                required
                placeholder="9876543210"
              />
              {form.visitorPhone && form.visitorPhone.length < 10 && (
                <p className="text-xs text-red-500 mt-1">Must be exactly 10 digits</p>
              )}
            </div>
            <div>
              <label className="label">Relation</label>
              <select className="input" value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}>
                {relations.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Purpose</label>
              <select className="input" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}>
                {purposes.map(p => <option key={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </div>
            {role !== 'STUDENT' && (
              <div>
                <label className="label">Student ID</label>
                <input type="number" className="input" value={form.studentId}
                  onChange={e => setForm({ ...form, studentId: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="label">Hostel ID</label>
              <input type="number" className="input" value={form.hostelId}
                onChange={e => setForm({ ...form, hostelId: e.target.value })} required />
            </div>
            <div>
              <label className="label">Expected Visit Date</label>
              <input type="date" className="input" value={form.expectedDate}
                onChange={e => setForm({ ...form, expectedDate: e.target.value })} />
            </div>
            <div className={role === 'STUDENT' ? 'col-span-2' : ''}>
              <label className="label">Remarks</label>
              <input className="input" value={form.remarks}
                onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Register</button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Visitor" size="sm">
        <div className="space-y-4">
          {rejectModal && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rejecting visitor <span className="font-semibold">{rejectModal.visitorName}</span>. Please provide a reason.
            </p>
          )}
          <div>
            <label className="label">Rejection Remarks</label>
            <textarea
              className="input h-20 resize-none"
              value={rejectRemarks}
              onChange={e => setRejectRemarks(e.target.value)}
              placeholder="Reason for rejection..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setRejectModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleReject} className="btn-danger">Reject</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

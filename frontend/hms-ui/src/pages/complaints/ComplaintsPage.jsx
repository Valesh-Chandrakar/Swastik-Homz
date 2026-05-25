import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus } from 'react-icons/hi'
import { complaintApi } from '../../api/complaintApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const categories = ['MAINTENANCE', 'CLEANLINESS', 'NOISE', 'ELECTRICITY', 'PLUMBING', 'SECURITY', 'FOOD', 'OTHER']
const emptyForm = { title: '', description: '', category: 'MAINTENANCE', hostelId: 1, roomId: '' }

export default function ComplaintsPage() {
  const { user, role } = useSelector(selectAuth)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [resolutionModal, setResolutionModal] = useState(null)
  const [resolutionText, setResolutionText] = useState('')
  const [form, setForm] = useState(emptyForm)

  const fetchComplaints = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (role === 'STUDENT') {
        res = await complaintApi.getByStudent(user.id)
        setComplaints(Array.isArray(res.data.data) ? res.data.data : [])
      } else if (role === 'WARDEN') {
        res = await complaintApi.getByWarden(user.id)
        setComplaints(Array.isArray(res.data.data) ? res.data.data : [])
      } else {
        res = await complaintApi.getByHostel(1, page, 10)
        setComplaints(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
      }
    } catch { } finally { setLoading(false) }
  }, [page, user?.id, role])

  useEffect(() => { fetchComplaints() }, [fetchComplaints])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await complaintApi.raise({ ...form, studentId: user.id })
      toast.success('Complaint raised successfully')
      setModalOpen(false); fetchComplaints()
    } catch { }
  }

  const handleAssign = async (id) => {
    try {
      await complaintApi.assign(id, user.id)
      toast.success('Complaint assigned to you')
      fetchComplaints()
    } catch { }
  }

  const handleResolve = async () => {
    if (!resolutionModal || !resolutionText.trim()) {
      toast.error('Please enter resolution notes')
      return
    }
    try {
      await complaintApi.resolve(resolutionModal.id, resolutionText)
      toast.success('Complaint resolved')
      setResolutionModal(null); setResolutionText(''); fetchComplaints()
    } catch { }
  }

  const handleClose = async (id) => {
    try {
      await complaintApi.close(id)
      toast.success('Complaint closed')
      fetchComplaints()
    } catch { }
  }

  const statusVariant = (s) => ({
    OPEN: 'danger', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'gray'
  })[s] || 'gray'

  const categoryVariant = () => 'info'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complaints</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track and resolve hostel complaints</p>
        </div>
        {role === 'STUDENT' && (
          <button onClick={() => { setForm(emptyForm); setModalOpen(true) }} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Raise Complaint
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <Table headers={['ID', 'Title & Description', 'Category', 'Status', 'Created', 'Actions']} loading={loading}>
          {complaints.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td><span className="font-mono text-sm text-gray-500 dark:text-gray-400">#{c.id}</span></Td>
              <Td>
                <div className="font-medium text-gray-900 dark:text-gray-100">{c.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">{c.description}</div>
                {c.resolution && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    Resolution: {c.resolution}
                  </div>
                )}
              </Td>
              <Td><Badge variant={categoryVariant()}>{c.category}</Badge></Td>
              <Td><Badge variant={statusVariant(c.status)}>{c.status?.replace('_', ' ')}</Badge></Td>
              <Td className="text-gray-500 dark:text-gray-400 text-xs">{c.createdAt?.split('T')[0]}</Td>
              <Td>
                <div className="flex flex-col gap-1">
                  {role === 'WARDEN' && c.status === 'OPEN' && (
                    <button
                      onClick={() => handleAssign(c.id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-medium transition-colors text-left"
                    >
                      Assign to me
                    </button>
                  )}
                  {role === 'WARDEN' && c.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => { setResolutionModal(c); setResolutionText('') }}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 text-xs font-medium transition-colors text-left"
                    >
                      Resolve
                    </button>
                  )}
                  {(role === 'ADMIN' || role === 'WARDEN') && c.status === 'RESOLVED' && (
                    <button
                      onClick={() => handleClose(c.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-xs font-medium transition-colors text-left"
                    >
                      Close
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Raise Complaint Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Raise a Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Brief summary of the issue" />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input h-24 resize-none"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              placeholder="Describe the issue in detail..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Complaint</button>
          </div>
        </form>
      </Modal>

      {/* Resolution Modal */}
      <Modal isOpen={!!resolutionModal} onClose={() => setResolutionModal(null)} title="Resolve Complaint" size="sm">
        <div className="space-y-4">
          {resolutionModal && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-100">{resolutionModal.title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{resolutionModal.description}</p>
            </div>
          )}
          <div>
            <label className="label">Resolution Notes</label>
            <textarea
              className="input h-24 resize-none"
              value={resolutionText}
              onChange={e => setResolutionText(e.target.value)}
              placeholder="Describe how the issue was resolved..."
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setResolutionModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleResolve} className="btn-primary">Mark Resolved</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

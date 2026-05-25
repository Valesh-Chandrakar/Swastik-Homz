import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiClipboardCheck, HiCalendar } from 'react-icons/hi'
import { attendanceApi } from '../../api/attendanceApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const statuses = ['PRESENT', 'ABSENT', 'LEAVE', 'LATE']

export default function AttendancePage() {
  const { user, role } = useSelector(selectAuth)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [hostelIdFilter, setHostelIdFilter] = useState(1)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkEntries, setBulkEntries] = useState([{ studentId: '', status: 'PRESENT', remarks: '' }])
  const [stats, setStats] = useState(null)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      if (role === 'STUDENT') {
        const from = format(new Date(new Date().setDate(1)), 'yyyy-MM-dd')
        const to = format(new Date(), 'yyyy-MM-dd')
        const res = await attendanceApi.getByStudent(user.id, from, to)
        setRecords(Array.isArray(res.data.data) ? res.data.data : [])
        // also fetch stats
        const statsRes = await attendanceApi.getStats(user.id, from, to)
        setStats(statsRes.data.data)
      } else {
        const res = await attendanceApi.getByHostelDate(hostelIdFilter, selectedDate)
        setRecords(Array.isArray(res.data.data) ? res.data.data : [])
      }
    } catch { } finally { setLoading(false) }
  }, [user?.id, role, hostelIdFilter, selectedDate])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const handleBulkAddRow = () => {
    setBulkEntries([...bulkEntries, { studentId: '', status: 'PRESENT', remarks: '' }])
  }

  const handleBulkRemoveRow = (index) => {
    setBulkEntries(bulkEntries.filter((_, i) => i !== index))
  }

  const handleBulkChange = (index, field, value) => {
    setBulkEntries(bulkEntries.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    const valid = bulkEntries.every(e => e.studentId)
    if (!valid) { toast.error('All entries must have a Student ID'); return }
    try {
      await attendanceApi.markBulk({
        hostelId: hostelIdFilter,
        date: selectedDate,
        entries: bulkEntries.map(e => ({
          studentId: Number(e.studentId),
          status: e.status,
          remarks: e.remarks,
        }))
      })
      toast.success('Attendance marked successfully')
      setBulkModalOpen(false)
      setBulkEntries([{ studentId: '', status: 'PRESENT', remarks: '' }])
      fetchRecords()
    } catch { }
  }

  const statusVariant = (s) => ({
    PRESENT: 'success', ABSENT: 'danger', LEAVE: 'warning', LATE: 'info'
  })[s] || 'gray'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {role === 'STUDENT' ? 'Your attendance this month' : 'Daily attendance records'}
          </p>
        </div>
        {(role === 'ADMIN' || role === 'WARDEN') && (
          <button onClick={() => setBulkModalOpen(true)} className="btn-primary flex items-center gap-2">
            <HiClipboardCheck size={18} /> Mark Attendance
          </button>
        )}
      </div>

      {/* Stats card for student */}
      {role === 'STUDENT' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Present', value: stats.presentCount ?? 0, variant: 'success' },
            { label: 'Absent', value: stats.absentCount ?? 0, variant: 'danger' },
            { label: 'Leave', value: stats.leaveCount ?? 0, variant: 'warning' },
            { label: 'Late', value: stats.lateCount ?? 0, variant: 'info' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              <p className="mt-1"><Badge variant={s.variant}>{s.label}</Badge></p>
            </div>
          ))}
        </div>
      )}

      {/* Filters for warden/admin */}
      {role !== 'STUDENT' && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hostel ID:</label>
            <input
              type="number" min="1" value={hostelIdFilter}
              onChange={e => { setHostelIdFilter(Number(e.target.value)); setPage(0) }}
              className="input w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiCalendar className="text-gray-400" size={18} />
            <input
              type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="input w-44"
            />
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <Table
          headers={
            role === 'STUDENT'
              ? ['Date', 'Status', 'Remarks', 'Marked By']
              : ['Student ID', 'Date', 'Status', 'Remarks', 'Marked By']
          }
          loading={loading}
          emptyMessage="No attendance records found for selected date"
        >
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {role !== 'STUDENT' && <Td>#{r.studentId}</Td>}
              <Td className="text-gray-500 dark:text-gray-400 text-sm">{r.date || r.attendanceDate}</Td>
              <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
              <Td className="text-gray-500 dark:text-gray-400">{r.remarks || '—'}</Td>
              <Td className="text-gray-500 dark:text-gray-400">{r.markedBy ? `#${r.markedBy}` : '—'}</Td>
            </tr>
          ))}
        </Table>
        {role !== 'STUDENT' && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      {/* Bulk Attendance Modal */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Mark Bulk Attendance"
        size="xl"
      >
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input w-44" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hostel ID:</label>
              <input type="number" value={hostelIdFilter} onChange={e => setHostelIdFilter(Number(e.target.value))} className="input w-20" />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2">
            {bulkEntries.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="number" placeholder="Student ID" value={entry.studentId}
                  onChange={e => handleBulkChange(index, 'studentId', e.target.value)}
                  className="input w-32" required
                />
                <select
                  value={entry.status}
                  onChange={e => handleBulkChange(index, 'status', e.target.value)}
                  className="input w-36"
                >
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <input
                  placeholder="Remarks (optional)" value={entry.remarks}
                  onChange={e => handleBulkChange(index, 'remarks', e.target.value)}
                  className="input flex-1"
                />
                {bulkEntries.length > 1 && (
                  <button type="button" onClick={() => handleBulkRemoveRow(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg leading-none flex-shrink-0">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={handleBulkAddRow}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            + Add another student
          </button>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={() => setBulkModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Attendance</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

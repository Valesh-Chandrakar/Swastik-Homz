import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiLightningBolt, HiCheck, HiCreditCard } from 'react-icons/hi'
import { paymentApi } from '../../api/paymentApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import HostelSelect from '../../components/ui/HostelSelect'
import ElectricityTracker from '../../components/ElectricityTracker'
import toast from 'react-hot-toast'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function PaymentsPage() {
  const { user, role, hostelId: userHostelId } = useSelector(selectAuth)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [payModal, setPayModal] = useState(null)
  const [elecModal, setElecModal] = useState(null)
  const [payForm, setPayForm] = useState({ transactionId: '', remarks: '' })
  const [elecForm, setElecForm] = useState({ units: '', ratePerUnit: '' })
  const [hostelIdFilter, setHostelIdFilter] = useState(userHostelId || '')
  // Tabs: students see "Payments" and "Electricity"; others see just the table
  const [activeTab, setActiveTab] = useState('payments')

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (role === 'STUDENT') {
        res = await paymentApi.getByStudent(user.id)
        setPayments(Array.isArray(res.data.data) ? res.data.data : [])
      } else {
        if (!hostelIdFilter) {
          setPayments([])
          setTotalPages(0)
          return
        }
        res = await paymentApi.getByHostel(hostelIdFilter, page, 10)
        setPayments(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
      }
    } catch { } finally { setLoading(false) }
  }, [page, user?.id, role, hostelIdFilter])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const handlePay = async (e) => {
    e.preventDefault()
    try {
      await paymentApi.pay(payModal.id, payForm)
      toast.success('Payment marked as paid', { id: 'pay-success' })
      setPayModal(null); fetchPayments()
    } catch { }
  }

  const handleElec = async (e) => {
    e.preventDefault()
    try {
      await paymentApi.addElectricity(elecModal.id, {
        units: +elecForm.units,
        ratePerUnit: elecForm.ratePerUnit ? +elecForm.ratePerUnit : null
      })
      toast.success('Electricity bill added', { id: 'elec-success' })
      setElecModal(null); fetchPayments()
    } catch { }
  }

  const statusVariant = (s) => ({
    PAID: 'success', PENDING: 'warning', OVERDUE: 'danger', PARTIAL: 'info'
  })[s] || 'gray'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payments</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {role === 'STUDENT' ? 'Your rent and electricity bills' : 'Track rent and electricity payments'}
          </p>
        </div>
        {role !== 'STUDENT' && (
          <div className="min-w-[240px]">
            <HostelSelect value={hostelIdFilter} onChange={(id) => { setHostelIdFilter(id); setPage(0) }} placeholder="Filter by hostel..." />
          </div>
        )}
      </div>

      {/* Tabs for students */}
      {role === 'STUDENT' && (
        <div className="border-b border-gray-200 dark:border-gray-700 flex gap-1">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'payments'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <HiCreditCard size={16} /> Payment History
          </button>
          <button
            onClick={() => setActiveTab('electricity')}
            className={`flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'electricity'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <HiLightningBolt size={16} /> Electricity Tracker
          </button>
        </div>
      )}

      {/* === Electricity tab (student only) === */}
      {role === 'STUDENT' && activeTab === 'electricity' && (
        <ElectricityTracker payments={payments} />
      )}

      {/* === Payments table === */}
      {(role !== 'STUDENT' || activeTab === 'payments') && (
        <div className="card p-0 overflow-hidden">
          <Table
            headers={['Student', 'Month/Year', 'Base Rent', 'Electricity', 'Total', 'Due Date', 'Status', 'Actions']}
            loading={loading}
          >
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <Td>#{p.studentId}</Td>
                <Td>{months[(p.month ?? 1) - 1]} {p.year}</Td>
                <Td>₹{p.baseRent?.toLocaleString()}</Td>
                <Td>
                  {p.electricityUnits != null && p.electricityUnits > 0 ? (
                    <div>
                      <span className="font-medium">₹{(p.electricityAmount ?? 0).toLocaleString()}</span>
                      <p className="text-xs text-gray-400">{p.electricityUnits} units @ ₹{p.electricityRate}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </Td>
                <Td className="font-semibold">₹{p.totalAmount?.toLocaleString()}</Td>
                <Td className="text-gray-500 dark:text-gray-400">{p.dueDate}</Td>
                <Td><Badge variant={statusVariant(p.status)}>{p.status}</Badge></Td>
                <Td>
                  <div className="flex gap-2">
                    {p.status !== 'PAID' && role !== 'STUDENT' && (
                      <>
                        <button
                          onClick={() => { setElecModal(p); setElecForm({ units: '', ratePerUnit: '' }) }}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 transition-colors"
                          title="Add Electricity Bill"
                        >
                          <HiLightningBolt size={18} />
                        </button>
                        <button
                          onClick={() => { setPayModal(p); setPayForm({ transactionId: '', remarks: '' }) }}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 transition-colors"
                          title="Mark as Paid"
                        >
                          <HiCheck size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
          {role !== 'STUDENT' && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
      )}

      {/* Pay Modal */}
      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title="Mark as Paid" size="sm">
        <form onSubmit={handlePay} className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Student</span>
              <span className="font-medium">#{payModal?.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="font-semibold text-green-600">₹{payModal?.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <label className="label">Transaction ID</label>
            <input className="input" placeholder="Optional" value={payForm.transactionId}
              onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })} />
          </div>
          <div>
            <label className="label">Remarks</label>
            <input className="input" placeholder="Optional" value={payForm.remarks}
              onChange={e => setPayForm({ ...payForm, remarks: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setPayModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Confirm Payment</button>
          </div>
        </form>
      </Modal>

      {/* Electricity Modal */}
      <Modal isOpen={!!elecModal} onClose={() => setElecModal(null)} title="Add Electricity Bill" size="sm">
        <form onSubmit={handleElec} className="space-y-4">
          <div>
            <label className="label">Units Consumed</label>
            <input type="number" step="0.01" className="input" placeholder="e.g. 120" value={elecForm.units}
              onChange={e => setElecForm({ ...elecForm, units: e.target.value })} required />
          </div>
          <div>
            <label className="label">Rate per Unit (₹)</label>
            <input type="number" step="0.01" className="input" placeholder="Default: 8.00" value={elecForm.ratePerUnit}
              onChange={e => setElecForm({ ...elecForm, ratePerUnit: e.target.value })} />
          </div>
          {elecForm.units && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
              <span className="text-gray-600 dark:text-gray-300">Estimated Bill: </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ₹{(Number(elecForm.units) * (Number(elecForm.ratePerUnit) || 8)).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setElecModal(null)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Bill</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

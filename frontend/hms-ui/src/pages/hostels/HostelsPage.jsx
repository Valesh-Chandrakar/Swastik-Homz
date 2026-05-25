import { useState, useEffect, useCallback } from 'react'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import { hostelApi } from '../../api/hostelApi'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import SearchBar from '../../components/ui/SearchBar'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '', address: '', city: '', state: '', pincode: '',
  phone: '', email: '', totalFloors: 1, type: 'BOYS', description: ''
}

export default function HostelsPage() {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchHostels = useCallback(async () => {
    setLoading(true)
    try {
      const res = await hostelApi.getAll(page, 10, search)
      setHostels(res.data.data.content || [])
      setTotalPages(res.data.data.totalPages || 0)
    } catch { } finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchHostels() }, [fetchHostels])

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (h) => { setEditItem(h); setForm(h); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editItem) { await hostelApi.update(editItem.id, form); toast.success('Hostel updated') }
      else { await hostelApi.create(form); toast.success('Hostel created') }
      setModalOpen(false); fetchHostels()
    } catch { }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this hostel?')) return
    try { await hostelApi.delete(id); toast.success('Deleted'); fetchHostels() } catch { }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hostels</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all hostel properties</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <HiPlus size={18} /> Add Hostel
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search hostels..." />
        </div>
        <Table headers={['Name', 'Address', 'City', 'Type', 'Floors', 'Status', 'Actions']} loading={loading}>
          {hostels.map((h) => (
            <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td><div className="font-medium">{h.name}</div></Td>
              <Td className="text-gray-500 dark:text-gray-400">{h.address}</Td>
              <Td>{h.city}, {h.state}</Td>
              <Td><Badge variant="info">{h.type}</Badge></Td>
              <Td>{h.totalFloors}</Td>
              <Td><Badge variant={h.active ? 'success' : 'danger'}>{h.active ? 'Active' : 'Inactive'}</Badge></Td>
              <Td>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(h)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    <HiPencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(h.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    <HiTrash size={18} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Hostel' : 'Add Hostel'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Hostel Name</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input className="input" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
            </div>
            <div>
              <label className="label">Reception Phone</label>
              <input
                type="tel"
                inputMode="tel"
                maxLength={15}
                className="input"
                placeholder="e.g. 022-12345678 or 9876543210"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9-+ ]/g, '').slice(0, 15) })}
              />
              <p className="text-xs text-gray-400 mt-1">Mobile or landline. Spaces, +, − allowed.</p>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Total Floors</label>
              <input type="number" min="1" className="input" value={form.totalFloors} onChange={e => setForm({ ...form, totalFloors: +e.target.value })} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="BOYS">Boys</option>
                <option value="GIRLS">Girls</option>
                <option value="CO_ED">Co-Ed</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

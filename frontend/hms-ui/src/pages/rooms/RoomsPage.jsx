import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { HiPlus, HiPencil, HiTrash, HiLockClosed } from 'react-icons/hi'
import { roomApi } from '../../api/roomApi'
import { selectAuth } from '../../store/slices/authSlice'
import { Table, Td } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import HostelSelect from '../../components/ui/HostelSelect'
import toast from 'react-hot-toast'

// Default rent suggestions by seater type — owner/admin can adjust
const defaultRentBySeater = { SINGLE: 8000, DOUBLE: 5000, TRIPLE: 4000, QUAD: 3500 }

const emptyForm = {
  hostelId: '',
  floorId: '',
  roomNumber: '',
  seaterType: 'DOUBLE',
  acType: 'NON_AC',
  totalBeds: 2,
  baseRent: 5000,
  amenities: '',
}

export default function RoomsPage() {
  const { role, hostelId: userHostelId } = useSelector(selectAuth)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filterHostelId, setFilterHostelId] = useState(userHostelId || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Only OWNER and ADMIN can set the rent.
  // WARDEN can create/edit rooms (number, AC, beds, amenities) but rent stays read-only for them.
  const canManage = ['ADMIN', 'OWNER', 'WARDEN'].includes(role)
  const canSetRent = ['ADMIN', 'OWNER'].includes(role)

  const fetchRooms = useCallback(async () => {
    if (!filterHostelId) {
      setRooms([])
      setTotalPages(0)
      return
    }
    setLoading(true)
    try {
      const res = await roomApi.getByHostel(filterHostelId, page, 10)
      setRooms(res.data?.data?.content || [])
      setTotalPages(res.data?.data?.totalPages || 0)
    } catch { } finally { setLoading(false) }
  }, [page, filterHostelId])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  const openCreate = () => {
    setEditItem(null)
    setForm({ ...emptyForm, hostelId: filterHostelId || '' })
    setModalOpen(true)
  }

  const openEdit = (r) => {
    setEditItem(r)
    setForm({
      hostelId: r.hostelId,
      floorId: r.floorId || '',
      roomNumber: r.roomNumber,
      seaterType: r.seaterType,
      acType: r.acType,
      totalBeds: r.totalBeds,
      baseRent: r.baseRent,
      amenities: r.amenities || '',
    })
    setModalOpen(true)
  }

  const handleSeaterChange = (seaterType) => {
    const beds = seaterType === 'SINGLE' ? 1 : seaterType === 'DOUBLE' ? 2 : seaterType === 'TRIPLE' ? 3 : 4
    setForm({
      ...form,
      seaterType,
      totalBeds: beds,
      baseRent: canSetRent ? (defaultRentBySeater[seaterType] || form.baseRent) : form.baseRent,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.hostelId) {
      toast.error('Please select a hostel')
      return
    }
    if (form.baseRent <= 0) {
      toast.error('Rent must be a positive amount')
      return
    }
    try {
      const payload = {
        ...form,
        hostelId: Number(form.hostelId),
        floorId: form.floorId ? Number(form.floorId) : null,
        totalBeds: Number(form.totalBeds),
        baseRent: Number(form.baseRent),
      }
      if (editItem) {
        // If user is not owner/admin, preserve the existing rent — backend will also validate
        if (!canSetRent) payload.baseRent = editItem.baseRent
        await roomApi.update(editItem.id, payload)
        toast.success('Room updated')
      } else {
        await roomApi.create(payload)
        toast.success('Room created')
      }
      setModalOpen(false)
      fetchRooms()
    } catch { }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try { await roomApi.delete(id); toast.success('Room deleted'); fetchRooms() } catch { }
  }

  const statusVariant = (s) => ({ AVAILABLE: 'success', FULL: 'danger', MAINTENANCE: 'warning' })[s] || 'gray'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rooms</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage rooms, beds, and rent by seater type</p>
        </div>
        {canManage && filterHostelId && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Add Room
          </button>
        )}
      </div>

      <div className="card">
        <label className="label">Filter by Hostel</label>
        <div className="max-w-md">
          <HostelSelect value={filterHostelId} onChange={setFilterHostelId} placeholder="Pick a hostel to view rooms" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <Table headers={['Room #', 'Seater', 'AC', 'Beds', 'Available', 'Rent', 'Status', 'Actions']} loading={loading}>
          {rooms.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Td><div className="font-medium">{r.roomNumber}</div></Td>
              <Td><Badge variant="info">{r.seaterType}</Badge></Td>
              <Td><Badge variant={r.acType === 'AC' ? 'info' : 'gray'}>{r.acType}</Badge></Td>
              <Td>{r.totalBeds}</Td>
              <Td className={r.availableBeds === 0 ? 'text-red-600' : 'text-green-600'}>{r.availableBeds}</Td>
              <Td className="font-semibold">₹{Number(r.baseRent).toLocaleString()}</Td>
              <Td><Badge variant={statusVariant(r.status)}>{r.status}</Badge></Td>
              <Td>
                {canManage && (
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(r)} className="text-pink-600 hover:text-pink-800 dark:text-pink-400" title="Edit"><HiPencil size={18} /></button>
                    {role === 'ADMIN' && (
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete"><HiTrash size={18} /></button>
                    )}
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Room' : 'Add Room'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Hostel *</label>
              <HostelSelect
                value={form.hostelId}
                onChange={(id) => setForm({ ...form, hostelId: id })}
                required
                disabled={!!editItem /* can't move a room between hostels */}
              />
            </div>
            <div>
              <label className="label">Room Number *</label>
              <input className="input" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
            </div>
            <div>
              <label className="label">Floor ID</label>
              <input type="number" className="input" value={form.floorId} onChange={(e) => setForm({ ...form, floorId: e.target.value })} />
            </div>
            <div>
              <label className="label">Seater Type *</label>
              <select className="input" value={form.seaterType} onChange={(e) => handleSeaterChange(e.target.value)}>
                <option value="SINGLE">Single (1 bed)</option>
                <option value="DOUBLE">Double (2 beds)</option>
                <option value="TRIPLE">Triple (3 beds)</option>
                <option value="QUAD">Quad (4 beds)</option>
              </select>
            </div>
            <div>
              <label className="label">AC Type</label>
              <select className="input" value={form.acType} onChange={(e) => setForm({ ...form, acType: e.target.value })}>
                <option value="NON_AC">Non-AC</option>
                <option value="AC">AC</option>
              </select>
            </div>
            <div>
              <label className="label">Total Beds</label>
              <input type="number" min="1" max="4" className="input" value={form.totalBeds}
                onChange={(e) => setForm({ ...form, totalBeds: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="label flex items-center gap-1">
                Base Rent (₹) *
                {!canSetRent && <HiLockClosed className="text-amber-500" title="Only Owner/Admin can set rent" />}
              </label>
              <input
                type="number"
                min="0"
                step="100"
                className={`input ${!canSetRent ? 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed' : ''}`}
                value={form.baseRent}
                onChange={(e) => canSetRent && setForm({ ...form, baseRent: Number(e.target.value) })}
                readOnly={!canSetRent}
                required
              />
              {!canSetRent && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  🔒 Only the Owner or Admin can set the rent. Default for {form.seaterType}: ₹{defaultRentBySeater[form.seaterType]}
                </p>
              )}
              {canSetRent && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Suggested for {form.seaterType}: ₹{defaultRentBySeater[form.seaterType]}{form.acType === 'AC' ? ' (+₹1500 for AC)' : ''}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="label">Amenities</label>
              <input className="input" placeholder="e.g. WiFi, Attached Bathroom, Study Table" value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Room</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { hostelApi } from '../../api/hostelApi'

/**
 * Reusable hostel dropdown. Fetches the list of hostels from the API
 * (optionally filtered by owner) and renders a <select>.
 *
 * Props:
 *   value          — currently selected hostel id (number/string)
 *   onChange       — callback(id) when user picks a hostel
 *   ownerId        — optional: if set, only show hostels owned by this user
 *   placeholder    — placeholder for the empty option
 *   required       — make field required
 *   className      — extra classes for the <select>
 *   disabled       — disable the field
 */
export default function HostelSelect({
  value,
  onChange,
  ownerId,
  placeholder = 'Select a hostel',
  required = false,
  className = '',
  disabled = false,
}) {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHostels = async () => {
      setLoading(true)
      try {
        let list = []
        if (ownerId) {
          const res = await hostelApi.getByOwner(ownerId)
          list = Array.isArray(res.data?.data) ? res.data.data : []
        } else {
          const res = await hostelApi.getAll(0, 100, '')
          list = res.data?.data?.content || []
        }
        setHostels(list)
      } catch {
        setHostels([])
      } finally {
        setLoading(false)
      }
    }
    fetchHostels()
  }, [ownerId])

  return (
    <select
      className={`input ${className}`}
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
      required={required}
      disabled={disabled || loading}
    >
      <option value="">{loading ? 'Loading hostels…' : placeholder}</option>
      {hostels.map((h) => (
        <option key={h.id} value={h.id}>
          {h.name}{h.city ? ` — ${h.city}` : ''}
        </option>
      ))}
    </select>
  )
}

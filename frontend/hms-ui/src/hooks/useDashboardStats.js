import { useState, useEffect } from 'react'
import { hostelApi } from '../api/hostelApi'
import { userApi } from '../api/userApi'
import { roomApi } from '../api/roomApi'
import { paymentApi } from '../api/paymentApi'
import { complaintApi } from '../api/complaintApi'
import { attendanceApi } from '../api/attendanceApi'

const today = () => new Date().toISOString().split('T')[0]

/**
 * Aggregates real stats across all hostels for the admin dashboard.
 * Strategy: fetch the hostel list, then run all per-hostel queries in parallel.
 *
 * Returns:
 *   stats          — { totalHostels, totalStudents, totalRooms, occupiedBeds, vacantBeds,
 *                       vacantRooms, pendingPayments, openComplaints, todayAttendance, totalRevenue }
 *   occupancyData  — [{ name, occupied, available }] for the bar chart
 *   complaintData  — [{ name, value }] for the pie chart
 *   loading        — true while any request is in flight
 */
export function useAdminDashboardStats() {
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalStudents: 0,
    totalRooms: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    vacantRooms: 0,
    pendingPayments: 0,
    openComplaints: 0,
    todayAttendance: 0,
    totalRevenue: 0,
  })
  const [occupancyData, setOccupancyData] = useState([])
  const [complaintData, setComplaintData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        // 1. Hostels (paged, but bump size to fetch all in one go)
        const hostelsRes = await hostelApi.getAll(0, 100, '')
        const hostels = hostelsRes.data?.data?.content || []
        const totalHostels = hostelsRes.data?.data?.totalElements ?? hostels.length

        // 2. All users (filter STUDENT count client-side)
        const usersRes = await userApi.getAll(0, 1000, '')
        const allUsers = usersRes.data?.data?.content || []
        const totalStudents = allUsers.filter((u) => u.role === 'STUDENT').length

        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        // 3. Per-hostel parallel fetches: rooms, pending payments, open complaints, attendance
        const perHostel = await Promise.all(
          hostels.map(async (h) => {
            const [roomsRes, pendingRes, openRes, attRes] = await Promise.all([
              roomApi.getByHostel(h.id, 0, 1000).catch(() => null),
              paymentApi.getPending(h.id, month, year).catch(() => null),
              complaintApi.getByHostel(h.id, 0, 1000).catch(() => null),
              attendanceApi.getByHostelDate(h.id, today()).catch(() => null),
            ])
            const rooms = roomsRes?.data?.data?.content || []
            const pendingPayments = pendingRes?.data?.data || []
            const allComplaints = openRes?.data?.data?.content || []
            const todayMarked = attRes?.data?.data || []

            return {
              hostel: h,
              rooms,
              pendingPayments: pendingPayments.length,
              openComplaints: allComplaints.filter((c) => c.status === 'OPEN').length,
              inProgressComplaints: allComplaints.filter((c) => c.status === 'IN_PROGRESS').length,
              resolvedComplaints: allComplaints.filter((c) => c.status === 'RESOLVED').length,
              attendanceMarked: todayMarked.filter((a) => a.status === 'PRESENT').length,
            }
          })
        )

        if (cancelled) return

        // 4. Aggregate room stats
        const allRooms = perHostel.flatMap((p) => p.rooms)
        const totalRooms = allRooms.length
        const totalBeds = allRooms.reduce((s, r) => s + (r.totalBeds || 0), 0)
        const vacantBeds = allRooms.reduce((s, r) => s + (r.availableBeds || 0), 0)
        const occupiedBeds = totalBeds - vacantBeds
        const vacantRooms = allRooms.filter((r) => r.status === 'AVAILABLE').length

        const pendingPayments = perHostel.reduce((s, p) => s + p.pendingPayments, 0)
        const openComplaints = perHostel.reduce((s, p) => s + p.openComplaints, 0)
        const todayAttendance = perHostel.reduce((s, p) => s + p.attendanceMarked, 0)

        // 5. Estimate revenue from PAID payments (rough — uses room rents × occupied beds)
        const totalRevenue = allRooms.reduce(
          (s, r) => s + (Number(r.baseRent) || 0) * ((r.totalBeds || 0) - (r.availableBeds || 0)),
          0
        )

        setStats({
          totalHostels,
          totalStudents,
          totalRooms,
          occupiedBeds,
          vacantBeds,
          vacantRooms,
          pendingPayments,
          openComplaints,
          todayAttendance,
          totalRevenue,
        })

        // 6. Chart data
        setOccupancyData(
          perHostel.slice(0, 6).map((p) => ({
            name: p.hostel.name.length > 14 ? p.hostel.name.substring(0, 14) + '…' : p.hostel.name,
            occupied: p.rooms.reduce((s, r) => s + ((r.totalBeds || 0) - (r.availableBeds || 0)), 0),
            available: p.rooms.reduce((s, r) => s + (r.availableBeds || 0), 0),
          }))
        )

        const totalOpen = perHostel.reduce((s, p) => s + p.openComplaints, 0)
        const totalInProgress = perHostel.reduce((s, p) => s + p.inProgressComplaints, 0)
        const totalResolved = perHostel.reduce((s, p) => s + p.resolvedComplaints, 0)
        setComplaintData([
          { name: 'Open', value: totalOpen },
          { name: 'In Progress', value: totalInProgress },
          { name: 'Resolved', value: totalResolved },
        ])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { stats, occupancyData, complaintData, loading }
}

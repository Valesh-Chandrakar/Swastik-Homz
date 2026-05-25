import api from './axiosConfig'
export const attendanceApi = {
  mark: (data) => api.post('/attendance', data),
  markBulk: (data) => api.post('/attendance/bulk', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getByStudent: (studentId, from, to) => api.get(`/attendance/student/${studentId}`, { params: { from, to } }),
  getByHostelDate: (hostelId, date) => api.get(`/attendance/hostel/${hostelId}/date/${date}`),
  getByHostel: (hostelId, page, size) => api.get(`/attendance/hostel/${hostelId}`, { params: { page, size } }),
  getStats: (studentId, from, to) => api.get(`/attendance/student/${studentId}/stats`, { params: { from, to } }),
}

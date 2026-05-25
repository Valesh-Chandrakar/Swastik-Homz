import api from './axiosConfig'
export const visitorApi = {
  register: (data) => api.post('/visitors', data),
  getById: (id) => api.get(`/visitors/${id}`),
  getByStudent: (studentId) => api.get(`/visitors/student/${studentId}`),
  getByHostel: (hostelId, page, size) => api.get(`/visitors/hostel/${hostelId}`, { params: { page, size } }),
  getPending: (hostelId) => api.get(`/visitors/hostel/${hostelId}/pending`),
  approve: (id, approvedBy) => api.put(`/visitors/${id}/approve`, null, { params: { approvedBy } }),
  reject: (id, approvedBy, remarks) => api.put(`/visitors/${id}/reject`, null, { params: { approvedBy, remarks } }),
  exit: (id) => api.put(`/visitors/${id}/exit`),
}

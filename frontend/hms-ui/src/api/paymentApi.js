import api from './axiosConfig'
export const paymentApi = {
  create: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  getByHostel: (hostelId, page, size) => api.get(`/payments/hostel/${hostelId}`, { params: { page, size } }),
  getPending: (hostelId, month, year) => api.get(`/payments/hostel/${hostelId}/pending`, { params: { month, year } }),
  pay: (id, data) => api.put(`/payments/${id}/pay`, data),
  addElectricity: (id, data) => api.put(`/payments/${id}/electricity`, data),
}

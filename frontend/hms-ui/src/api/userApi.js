import api from './axiosConfig'
export const userApi = {
  getAll: (page, size, search) => api.get('/users', { params: { page, size, search } }),
  getById: (id) => api.get(`/users/${id}`),
  getByAuthId: (authId) => api.get(`/users/auth/${authId}`),
  getByHostel: (hostelId) => api.get(`/users/hostel/${hostelId}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  uploadIdProof: (id, formData) => api.post(`/users/${id}/id-proof`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

import api from './axiosConfig'
export const hostelApi = {
  getAll: (page, size, search) => api.get('/hostels', { params: { page, size, search } }),
  getById: (id) => api.get(`/hostels/${id}`),
  getByOwner: (ownerId) => api.get(`/hostels/owner/${ownerId}`),
  create: (data) => api.post('/hostels', data),
  update: (id, data) => api.put(`/hostels/${id}`, data),
  delete: (id) => api.delete(`/hostels/${id}`),
  getFloors: (hostelId) => api.get(`/hostels/${hostelId}/floors`),
  addFloor: (hostelId, data) => api.post(`/hostels/${hostelId}/floors`, data),
}

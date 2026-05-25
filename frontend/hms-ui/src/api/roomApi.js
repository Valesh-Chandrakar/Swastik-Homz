import api from './axiosConfig'
export const roomApi = {
  getByHostel: (hostelId, page, size) => api.get(`/rooms/hostel/${hostelId}`, { params: { page, size } }),
  getAvailable: (hostelId) => api.get(`/rooms/hostel/${hostelId}/available`),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
}

import api from './axiosConfig'
export const allocationApi = {
  allocate: (data) => api.post('/allocations', data),
  vacate: (id, remarks) => api.put(`/allocations/${id}/vacate`, null, { params: { remarks } }),
  getById: (id) => api.get(`/allocations/${id}`),
  getActiveByStudent: (studentId) => api.get(`/allocations/student/${studentId}/active`),
  getByHostel: (hostelId, page, size) => api.get(`/allocations/hostel/${hostelId}`, { params: { page, size } }),
  getByRoom: (roomId) => api.get(`/allocations/room/${roomId}`),
}

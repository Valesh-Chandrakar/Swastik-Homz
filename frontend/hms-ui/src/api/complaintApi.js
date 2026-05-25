import api from './axiosConfig'
export const complaintApi = {
  raise: (data) => api.post('/complaints', data),
  getById: (id) => api.get(`/complaints/${id}`),
  getByStudent: (studentId) => api.get(`/complaints/student/${studentId}`),
  getByHostel: (hostelId, page, size) => api.get(`/complaints/hostel/${hostelId}`, { params: { page, size } }),
  getByWarden: (wardenId) => api.get(`/complaints/warden/${wardenId}`),
  assign: (id, wardenId) => api.put(`/complaints/${id}/assign`, null, { params: { wardenId } }),
  resolve: (id, resolution) => api.put(`/complaints/${id}/resolve`, null, { params: { resolution } }),
  close: (id) => api.put(`/complaints/${id}/close`),
}

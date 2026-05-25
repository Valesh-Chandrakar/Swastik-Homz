import api from './axiosConfig'
export const notificationApi = {
  send: (data) => api.post('/notifications/send', data),
  getByUser: (userId, page, size) => api.get(`/notifications/user/${userId}`, { params: { page, size } }),
  getUnread: (userId) => api.get(`/notifications/user/${userId}/unread`),
  getUnreadCount: (userId) => api.get(`/notifications/user/${userId}/count`),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: (userId) => api.put(`/notifications/user/${userId}/read-all`),
}

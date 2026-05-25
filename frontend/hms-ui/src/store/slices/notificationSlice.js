import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationApi } from '../../api/notificationApi'

export const fetchUnreadCount = createAsyncThunk('notifications/fetchCount', async (userId) => {
  const res = await notificationApi.getUnreadCount(userId)
  return res.data.data
})

export const fetchUnreadNotifications = createAsyncThunk('notifications/fetchUnread', async (userId) => {
  const res = await notificationApi.getUnread(userId)
  return res.data.data
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { unreadCount: 0, unread: [], loading: false },
  reducers: {
    decrementCount: (state) => { if (state.unreadCount > 0) state.unreadCount-- }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => { state.unreadCount = action.payload })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => { state.unread = action.payload })
  }
})

export const { decrementCount } = notificationSlice.actions
export const selectNotifications = (state) => state.notifications
export default notificationSlice.reducer

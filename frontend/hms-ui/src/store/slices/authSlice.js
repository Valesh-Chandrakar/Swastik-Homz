import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/authApi'

const savedAuth = JSON.parse(localStorage.getItem('hms_auth') || 'null')

export const loginAsync = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials)
    return response.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid email or password')
  }
})

// Register creates a user but does NOT log them in. They must go to the login page after.
export const registerAsync = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.register(data)
    return response.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedAuth?.token || null,
    user: savedAuth?.user || null,
    role: savedAuth?.role || null,
    hostelId: savedAuth?.hostelId || null,
    loading: false,
    error: null,
    registrationSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.role = null
      state.hostelId = null
      localStorage.removeItem('hms_auth')
    },
    clearError: (state) => { state.error = null },
    clearRegistrationSuccess: (state) => { state.registrationSuccess = false },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = { id: action.payload.userId, email: action.payload.email }
        state.role = action.payload.role
        state.hostelId = action.payload.hostelId || null
        localStorage.setItem('hms_auth', JSON.stringify({
          token: action.payload.token,
          user: { id: action.payload.userId, email: action.payload.email },
          role: action.payload.role,
          hostelId: action.payload.hostelId || null,
        }))
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
        state.registrationSuccess = false
      })
      .addCase(registerAsync.fulfilled, (state) => {
        // NOTE: do NOT set token here — user must explicitly log in after registration
        state.loading = false
        state.registrationSuccess = true
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError, clearRegistrationSuccess } = authSlice.actions
export const selectAuth = (state) => state.auth
export default authSlice.reducer

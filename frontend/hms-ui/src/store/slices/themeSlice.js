import { createSlice } from '@reduxjs/toolkit'

const savedTheme = localStorage.getItem('hms_theme') || 'light'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: savedTheme },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('hms_theme', state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('hms_theme', state.mode)
    }
  }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme.mode
export default themeSlice.reducer

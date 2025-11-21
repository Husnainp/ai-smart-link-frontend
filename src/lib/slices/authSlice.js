import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {

      const payload = action.payload || {}
      // Accept multiple possible token names from various APIs
      const user = payload.user || payload.data || null
      const accessToken = payload.accessToken || payload.token || payload.access_token || null
      const refreshToken = payload.refreshToken || payload.refresh_token || null

      state.user = user
      state.token = accessToken
      // only set refreshToken if provided
      state.refreshToken = refreshToken || state.refreshToken
      state.isAuthenticated = !!accessToken
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          state.token = token
          try {
            state.user = JSON.parse(user)
          } catch (e) {
            state.user = null
          }
          state.isAuthenticated = true
        }
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions
export default authSlice.reducer

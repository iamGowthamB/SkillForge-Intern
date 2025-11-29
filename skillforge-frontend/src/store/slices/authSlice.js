import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'

// Get initial state from localStorage
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

const initialState = {
  isAuthenticated: !!token,
  user: user ? JSON.parse(user) : null,
  token: token,
  loading: false,
  error: null,
}


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)

      const { token, userId, studentId, name, email, role } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({ userId, studentId, name, email, role })
      )

      toast.success('Login successful!')
      return { 
        token, 
        user: { userId, studentId, name, email, role } 
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)

      const { token, userId, studentId, name, email, role } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({ userId, studentId, name, email, role })
      )

      toast.success('Registration successful!')
      return { 
        token, 
        user: { userId, studentId, name, email, role } 
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout()
      state.isAuthenticated = false
      state.user = null
      state.token = null
      toast.success('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
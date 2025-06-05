import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState, LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['X-AUTH-TOKEN'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const login = createAsyncThunk(
  'login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue('Login failed. Please try again.')
    }
  }
)

export const signup = createAsyncThunk(
  'signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue('Signup failed. Please try again.')
    }
  }
)

export const loadUser = createAsyncThunk(
  'loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>('/auth/me')
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue('Failed to load user.')
    }
  }
)

export const logout = createAsyncThunk(
  '/auth/logout',
  async () => {
    localStorage.removeItem('token')
    return null
  }
)

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

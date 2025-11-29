import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import toast from 'react-hot-toast'
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("AXIOS ERROR:", error.response?.status, error.response?.data);
    console.log("AXIOS ERROR FULL:", error);
    if (error.response?.status === 401||error.response?.status === 403 ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error("Session expired. Please log in again.");
      // window.location.href = '/login'
      // Delay slightly so toast can show
      setTimeout(() => {
        window.location.replace("/login");
      }, 5000);  // 🕒 Wait 5 seconds before redirecting
    }
    return Promise.reject(error)
  }
)

export default api
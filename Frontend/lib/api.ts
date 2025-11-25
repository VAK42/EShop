import axios from 'axios'
export const apiUrl = 'http://localhost:3000'
export const wsUrl = 'ws://localhost:8081'
const api = axios.create({ baseURL: apiUrl })
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default api
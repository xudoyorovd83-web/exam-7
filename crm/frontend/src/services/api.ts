import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (err.response?.status !== 404) {
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    }
    return Promise.reject(err)
  },
)

// Auth
export const authApi = {
  login:      (data: { phone: string; password: string }) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

// Users
export const usersApi = {
  create:     (data: any) => api.post('/users', data),
  findAll:    () => api.get('/users'),
  findAdmins: () => api.get('/users/admins'),
  remove:     (id: number) => api.delete(`/users/${id}`),
}

// Teachers
export const teachersApi = {
  create:  (data: any) => api.post('/teachers', data),
  findAll: () => api.get('/teachers'),
  findOne: (id: number) => api.get(`/teachers/${id}`),
  update:  (id: number, data: any) => api.put(`/teachers/${id}`, data),
  remove:  (id: number) => api.delete(`/teachers/${id}`),
}

// Students
export const studentsApi = {
  create:  (data: any) => api.post('/students', data),
  findAll: () => api.get('/students'),
  findOne: (id: number) => api.get(`/students/${id}`),
  update:  (id: number, data: any) => api.put(`/students/${id}`, data),
  remove:  (id: number) => api.delete(`/students/${id}`),
}

// Groups
export const groupsApi = {
  create:  (data: any) => api.post('/groups', data),
  findAll: () => api.get('/groups'),
  findOne: (id: number) => api.get(`/groups/${id}`),
  update:  (id: number, data: any) => api.put(`/groups/${id}`, data),
  remove:  (id: number) => api.delete(`/groups/${id}`),
}

// Payments
export const paymentsApi = {
  create:        (data: any) => api.post('/payments', data),
  findAll:       () => api.get('/payments'),
  findByStudent: (studentId: number) => api.get(`/payments/student/${studentId}`),
  remove:        (id: number) => api.delete(`/payments/${id}`),
}

// Attendance
export const attendanceApi = {
  create:           (data: any) => api.post('/attendance', data),
  bulkCreate:       (records: any[]) => api.post('/attendance/bulk', records),
  findAll:          () => api.get('/attendance'),
  findByDate:       (date: string) => api.get(`/attendance/date/${date}`),
  findByGroup:      (groupId: number) => api.get(`/attendance/group/${groupId}`),
  findByGroupDate:  (groupId: number, date: string) => api.get(`/attendance/group/${groupId}/date/${date}`),
  remove:           (id: number) => api.delete(`/attendance/${id}`),
}

// Requests
export const requestsApi = {
  create:        (data: any) => api.post('/requests', data),
  findAll:       () => api.get('/requests'),
  findToday:     () => api.get('/requests/today'),
  findYesterday: () => api.get('/requests/yesterday'),
  update:        (id: number, data: any) => api.put(`/requests/${id}`, data),
  remove:        (id: number) => api.delete(`/requests/${id}`),
}

// Reports
export const reportsApi = {
  getSummary: () => api.get('/reports/summary'),
}

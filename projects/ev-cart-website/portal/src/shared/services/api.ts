import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 处理 token 过期
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          const { accessToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// API 模块导出
export const purchaseApi = {
  getList: () => apiClient.get('/purchases'),
  getById: (id: string) => apiClient.get(`/purchases/${id}`),
  create: (data: any) => apiClient.post('/purchases', data),
  update: (id: string, data: any) => apiClient.put(`/purchases/${id}`, data),
  delete: (id: string) => apiClient.delete(`/purchases/${id}`),
  approve: (id: string) => apiClient.post(`/purchases/${id}/approve`),
  reject: (id: string) => apiClient.post(`/purchases/${id}/reject`),
}

export const inventoryApi = {
  getList: () => apiClient.get('/inventory'),
  getInList: () => apiClient.get('/inventory/in'),
  getOutList: () => apiClient.get('/inventory/out'),
  createIn: (data: any) => apiClient.post('/inventory/in', data),
  createOut: (data: any) => apiClient.post('/inventory/out', data),
}

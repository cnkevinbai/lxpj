/**
 * API 服务
 * 提供与后端 API 通信的接口
 */

import axios from 'axios'

// API 基础配置
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
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

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== 通用 API ====================

export const apiService = {
  // GET 请求
  get: <T>(url: string, params?: any) => api.get<T, T>(url, { params }),
  
  // POST 请求
  post: <T>(url: string, data?: any) => api.post<T, T>(url, data),
  
  // PUT 请求
  put: <T>(url: string, data?: any) => api.put<T, T>(url, data),
  
  // DELETE 请求
  delete: <T>(url: string) => api.delete<T, T>(url),
  
  // PATCH 请求
  patch: <T>(url: string, data?: any) => api.patch<T, T>(url, data),
}

// ==================== 客户 API ====================

export const customerApi = {
  list: (params?: any) => apiService.get('/customers', params),
  get: (id: string) => apiService.get(`/customers/${id}`),
  create: (data: any) => apiService.post('/customers', data),
  update: (id: string, data: any) => apiService.put(`/customers/${id}`, data),
  delete: (id: string) => apiService.delete(`/customers/${id}`),
}

// ==================== 线索 API ====================

export const leadApi = {
  list: (params?: any) => apiService.get('/leads', params),
  get: (id: string) => apiService.get(`/leads/${id}`),
  create: (data: any) => apiService.post('/leads', data),
  update: (id: string, data: any) => apiService.put(`/leads/${id}`, data),
  delete: (id: string) => apiService.delete(`/leads/${id}`),
  convert: (id: string) => apiService.post(`/leads/${id}/convert`),
}

// ==================== 商机 API ====================

export const opportunityApi = {
  list: (params?: any) => apiService.get('/opportunities', params),
  get: (id: string) => apiService.get(`/opportunities/${id}`),
  create: (data: any) => apiService.post('/opportunities', data),
  update: (id: string, data: any) => apiService.put(`/opportunities/${id}`, data),
  delete: (id: string) => apiService.delete(`/opportunities/${id}`),
}

// ==================== 经销商 API ====================

export const dealerApi = {
  list: (params?: any) => apiService.get('/dealers', params),
  get: (id: string) => apiService.get(`/dealers/${id}`),
  create: (data: any) => apiService.post('/dealers', data),
  update: (id: string, data: any) => apiService.put(`/dealers/${id}`, data),
  delete: (id: string) => apiService.delete(`/dealers/${id}`),
}

// ==================== 认证 API ====================

export const authApi = {
  login: (username: string, password: string) => 
    apiService.post('/auth/login', { username, password }),
  register: (data: any) => apiService.post('/auth/register', data),
  logout: () => apiService.post('/auth/logout'),
  refreshToken: (token: string) => 
    apiService.post('/auth/refresh', { token }),
  me: () => apiService.get('/auth/me'),
}

// ==================== 数据可视化 API ====================

export const dashboardApi = {
  getStats: () => apiService.get('/dashboard/stats'),
  getChartData: (type: string) => apiService.get(`/dashboard/charts/${type}`),
}

// ==================== 集成 API ====================

export const integrationApi = {
  list: () => apiService.get('/integrations'),
  connect: (type: string, config: any) => 
    apiService.post(`/integrations/${type}/connect`, config),
  disconnect: (type: string) => 
    apiService.post(`/integrations/${type}/disconnect`),
  sync: (type: string) => apiService.post(`/integrations/${type}/sync`),
}

// ==================== 数据隐私 API ====================

export const dataPrivacyApi = {
  getSettings: () => apiService.get('/data-privacy/settings'),
  updateSettings: (data: any) => apiService.put('/data-privacy/settings', data),
  exportData: () => apiService.post('/data-privacy/export'),
  deleteData: () => apiService.delete('/data-privacy/delete'),
}

// ==================== 跟进记录 API ====================

export const followUpApi = {
  list: (customerId: string) => apiService.get(`/customers/${customerId}/follow-ups`),
  create: (customerId: string, data: any) => 
    apiService.post(`/customers/${customerId}/follow-ups`, data),
}

// ==================== 外贸 API ====================

export const foreignApi = {
  getDashboard: () => apiService.get('/foreign/dashboard'),
  getOrders: (params?: any) => apiService.get('/foreign/orders', params),
  getInquiries: (params?: any) => apiService.get('/foreign/inquiries', params),
  getCustomers: (params?: any) => apiService.get('/foreign/customers', params),
}

// ==================== 权限 API ====================

export const permissionApi = {
  getRoles: () => apiService.get('/roles'),
  getPermissions: () => apiService.get('/permissions'),
  updateRolePermissions: (roleId: string, permissions: string[]) => 
    apiService.put(`/roles/${roleId}/permissions`, { permissions }),
}

export default api
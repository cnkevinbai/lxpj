import axios from 'axios'

const API_BASE_URL = '/api/erp'

// 创建 axios 实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器 - 添加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 统一处理错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('erp_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关
export const login = (data: { username: string; password: string }) =>
  request.post('/auth/login', data)

export const logout = () => request.post('/auth/logout')

export const getCurrentUser = () => request.get('/auth/me')

// 采购管理
export const purchaseApi = {
  list: (params?: any) => request.get('/purchase', { params }),
  create: (data: any) => request.post('/purchase', data),
  get: (id: string) => request.get(`/purchase/${id}`),
  update: (id: string, data: any) => request.put(`/purchase/${id}`, data),
  delete: (id: string) => request.delete(`/purchase/${id}`),
  approve: (id: string) => request.post(`/purchase/${id}/approve`),
}

// 库存管理
export const inventoryApi = {
  list: (params?: any) => request.get('/inventory', { params }),
  in: (data: any) => request.post('/inventory/in', data),
  out: (data: any) => request.post('/inventory/out', data),
  adjust: (data: any) => request.post('/inventory/adjust', data),
  getStock: (sku: string) => request.get(`/inventory/stock/${sku}`),
}

// 生产管理
export const productionApi = {
  planList: (params?: any) => request.get('/production/plan', { params }),
  createPlan: (data: any) => request.post('/production/plan', data),
  taskList: (params?: any) => request.get('/production/task', { params }),
  createTask: (data: any) => request.post('/production/task', data),
  updateTaskStatus: (id: string, status: string) =>
    request.put(`/production/task/${id}/status`, { status }),
}

// 财务管理
export const financeApi = {
  overview: () => request.get('/finance/overview'),
  receiveList: (params?: any) => request.get('/finance/receive', { params }),
  createReceive: (data: any) => request.post('/finance/receive', data),
  payList: (params?: any) => request.get('/finance/pay', { params }),
  createPay: (data: any) => request.post('/finance/pay', data),
  statistics: (params?: any) => request.get('/finance/statistics', { params }),
}

export default request

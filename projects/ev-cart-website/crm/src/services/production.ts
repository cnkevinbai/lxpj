import apiClient from './api'

export const productionApi = {
  getOrders: (params?: any) => apiClient.get('/production/orders', { params }),
  getOrder: (id: string) => apiClient.get(`/production/orders/${id}`),
  createOrder: (data: any) => apiClient.post('/production/orders', data),
  updateOrder: (id: string, data: any) => apiClient.put(`/production/orders/${id}`, data),
  deleteOrder: (id: string) => apiClient.delete(`/production/orders/${id}`),
  getProgress: (orderId: string) => apiClient.get(`/production/orders/${orderId}/progress`),
  updateProgress: (orderId: string, data: any) => apiClient.post(`/production/orders/${orderId}/progress`, data),
}

export default productionApi

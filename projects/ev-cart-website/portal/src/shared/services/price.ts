import apiClient from './api'

export const priceApi = {
  getPriceList: (params?: any) => apiClient.get('/price/list', { params }),
  getPrice: (id: string) => apiClient.get(`/price/list/${id}`),
  createPrice: (data: any) => apiClient.post('/price/list', data),
  updatePrice: (id: string, data: any) => apiClient.put(`/price/list/${id}`, data),
  deletePrice: (id: string) => apiClient.delete(`/price/list/${id}`),
}

export default priceApi

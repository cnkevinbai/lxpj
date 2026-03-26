import apiClient from './api'

export const serviceApi = {
  getTickets: (params?: any) => apiClient.get('/service/tickets', { params }),
  getTicket: (id: string) => apiClient.get(`/service/tickets/${id}`),
  createTicket: (data: any) => apiClient.post('/service/tickets', data),
  updateTicket: (id: string, data: any) => apiClient.put(`/service/tickets/${id}`, data),
  deleteTicket: (id: string) => apiClient.delete(`/service/tickets/${id}`),
  getParts: (params?: any) => apiClient.get('/service/parts', { params }),
  getPart: (id: string) => apiClient.get(`/service/parts/${id}`),
  createPart: (data: any) => apiClient.post('/service/parts', data),
  updatePart: (id: string, data: any) => apiClient.put(`/service/parts/${id}`, data),
}

export default serviceApi

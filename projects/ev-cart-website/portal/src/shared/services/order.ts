import api from './api'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: { name: string }
  amount: number
  status: string
  paymentStatus: string
  deliveryStatus: string
}

export const orderService = {
  getList: async (params: { page?: number; pageSize?: number }) => {
    return api.get('/crm/orders', { params })
  },

  getById: async (id: string) => {
    return api.get(`/crm/orders/${id}`)
  },

  create: async (data: Partial<Order>) => {
    return api.post('/crm/orders', data)
  },

  update: async (id: string, data: Partial<Order>) => {
    return api.put(`/crm/orders/${id}`, data)
  },

  confirm: async (id: string) => {
    return api.post(`/crm/orders/${id}/confirm`)
  },

  cancel: async (id: string, reason?: string) => {
    return api.post(`/crm/orders/${id}/cancel`, { reason })
  },

  getStatistics: async () => {
    return api.get('/crm/orders/statistics')
  },
}

export default orderService

import api from './api'

export interface ProductionOrder {
  id: string
  orderNumber: string
  productId: string
  productName: string
  quantity: number
  status: 'PENDING' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  plannedStartDate?: string
  plannedEndDate?: string
  actualStartDate?: string
  actualEndDate?: string
}

export const productionService = {
  getList: async (params: { page?: number; pageSize?: number; status?: string }) => {
    return api.get('/erp/production', { params })
  },

  getById: async (id: string) => {
    return api.get(`/erp/production/${id}`)
  },

  create: async (data: Partial<ProductionOrder>) => {
    return api.post('/erp/production', data)
  },

  update: async (id: string, data: Partial<ProductionOrder>) => {
    return api.put(`/erp/production/${id}`, data)
  },

  remove: async (id: string) => {
    return api.delete(`/erp/production/${id}`)
  },

  getStatistics: async () => {
    return api.get('/erp/production/statistics')
  },
}

export default productionService

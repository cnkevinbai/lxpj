import api from './api'

export interface Inventory {
  id: string
  productId: string
  productName: string
  quantity: number
  warehouse: string
  location?: string
  minStock: number
  maxStock: number
}

export const inventoryService = {
  getList: async (params: { page?: number; pageSize?: number; warehouse?: string }) => {
    return api.get('/erp/inventory', { params })
  },

  getById: async (id: string) => {
    return api.get(`/erp/inventory/${id}`)
  },

  create: async (data: Partial<Inventory>) => {
    return api.post('/erp/inventory', data)
  },

  update: async (id: string, data: Partial<Inventory>) => {
    return api.put(`/erp/inventory/${id}`, data)
  },

  remove: async (id: string) => {
    return api.delete(`/erp/inventory/${id}`)
  },

  inbound: async (id: string, quantity: number) => {
    return api.post(`/erp/inventory/${id}/inbound`, { quantity })
  },

  outbound: async (id: string, quantity: number) => {
    return api.post(`/erp/inventory/${id}/outbound`, { quantity })
  },

  transfer: async (id: string, toWarehouse: string, quantity: number) => {
    return api.post(`/erp/inventory/${id}/transfer`, { toWarehouse, quantity })
  },

  getWarnings: async () => {
    return api.get('/erp/inventory/warnings')
  },
}

export default inventoryService

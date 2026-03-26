import api from './api'

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED'
}

export const purchaseService = {
  getList: async (params: { page?: number; pageSize?: number; status?: string }) => {
    return api.get('/erp/purchase', { params })
  },

  getById: async (id: string) => {
    return api.get(`/erp/purchase/${id}`)
  },

  create: async (data: Partial<PurchaseOrder>) => {
    return api.post('/erp/purchase', data)
  },

  update: async (id: string, data: Partial<PurchaseOrder>) => {
    return api.put(`/erp/purchase/${id}`, data)
  },

  remove: async (id: string) => {
    return api.delete(`/erp/purchase/${id}`)
  },

  approve: async (id: string) => {
    return api.post(`/erp/purchase/${id}/approve`)
  },

  receive: async (id: string) => {
    return api.post(`/erp/purchase/${id}/receive`)
  },
}

export default purchaseService

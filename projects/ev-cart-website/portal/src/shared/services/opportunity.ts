import api from './api'

export interface Opportunity {
  id: string
  name: string
  customerId: string
  customer?: { name: string }
  amount: number
  stage: string
  probability: number
  closeDate?: string
  status: string
}

export const opportunityService = {
  getList: async (params: { page?: number; pageSize?: number }) => {
    return api.get('/crm/opportunities', { params })
  },

  getById: async (id: string) => {
    return api.get(`/crm/opportunities/${id}`)
  },

  create: async (data: Partial<Opportunity>) => {
    return api.post('/crm/opportunities', data)
  },

  update: async (id: string, data: Partial<Opportunity>) => {
    return api.put(`/crm/opportunities/${id}`, data)
  },

  win: async (id: string) => {
    return api.post(`/crm/opportunities/${id}/win`)
  },

  lose: async (id: string, reason?: string) => {
    return api.post(`/crm/opportunities/${id}/lose`, { reason })
  },

  getStatistics: async () => {
    return api.get('/crm/opportunities/statistics')
  },
}

export default opportunityService

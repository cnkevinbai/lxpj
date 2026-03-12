import request from '@/utils/request'

// 创建合同
export const create = async (data: any) => {
  return request.post('/api/v1/crm/contracts', data)
}

// 获取合同列表
export const getList = async (orderId?: string) => {
  return request.get('/api/v1/crm/contracts', {
    params: { order_id: orderId },
  })
}

// 获取合同详情
export const getDetail = async (id: string) => {
  return request.get(`/api/v1/crm/contracts/${id}`)
}

// 合同同步 ERP
export const syncToErp = async (data: any) => {
  return request.post('/api/v1/integration/erp/contract-sync', data)
}

import request from '@/shared/utils/request'

// 配送列表
export const getDeliveryList = async (params?: any) => {
  return request.get('/api/v1/crm/deliveries', { params })
}

// 创建配送
export const createDelivery = async (data: any) => {
  return request.post('/api/v1/crm/deliveries', data)
}

// 获取配送详情
export const getDeliveryDetail = async (id: string) => {
  return request.get(`/api/v1/crm/deliveries/${id}`)
}

// 配送通知
export const deliveryNotify = async (data: any) => {
  return request.post('/api/v1/integration/erp/delivery-notify', data)
}

import request from '@/utils/request'

// 创建发货单
export const create = async (data: any) => {
  return request.post('/api/v1/crm/deliveries', data)
}

// 获取发货单列表
export const getList = async (orderId?: string) => {
  return request.get('/api/v1/crm/deliveries', {
    params: { order_id: orderId },
  })
}

// 获取发货单详情
export const getDetail = async (id: string) => {
  return request.get(`/api/v1/crm/deliveries/${id}`)
}

// 发货通知 ERP
export const notifyErp = async (data: any) => {
  return request.post('/api/v1/integration/erp/delivery-notify', data)
}

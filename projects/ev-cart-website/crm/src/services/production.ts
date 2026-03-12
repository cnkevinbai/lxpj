import request from '@/utils/request'

// 查询生产进度
export const getProgress = async (orderId: string) => {
  return request.get('/api/v1/integration/erp/production/progress', {
    params: { order_id: orderId },
  })
}

// 获取生产工单详情
export const getProductionOrder = async (id: string) => {
  return request.get(`/api/v1/integration/erp/production/orders/${id}`)
}

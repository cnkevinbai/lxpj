import request from '@/utils/request'

// 获取产品价格
export const getProductPrice = async (productId: string, customerId?: string) => {
  return request.get(`/api/v1/integration/erp/products/${productId}/price`, {
    params: { customer_id: customerId },
  })
}

// 同步产品价格
export const syncProductPrice = async (data: any) => {
  return request.post('/api/v1/integration/erp/products/price/sync', data)
}

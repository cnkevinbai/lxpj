import request from '@/shared/utils/request'

// 信用查询
export const queryCredit = async (customerId: string) => {
  return request.get(`/api/v1/integration/erp/customers/${customerId}/credit`)
}

// 同步客户信用
export const syncCustomerCredit = async (data: any) => {
  return request.post('/api/v1/integration/erp/customers/credit/sync', data)
}

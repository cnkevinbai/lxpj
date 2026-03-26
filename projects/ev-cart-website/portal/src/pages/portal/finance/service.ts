import request from '@/shared/utils/request'

// 客户财务
export const getCustomerFinance = async (customerId: string) => {
  return request.get(`/api/v1/finance/customers/${customerId}/finance`)
}

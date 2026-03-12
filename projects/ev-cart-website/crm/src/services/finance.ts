import request from '@/utils/request'

// 查询客户财务数据
export const getCustomerFinance = async (customerId: string) => {
  return request.get(`/api/v1/integration/erp/customers/${customerId}/finance`)
}

// 同步客户财务数据
export const syncCustomerFinance = async (data: any) => {
  return request.post('/api/v1/integration/erp/customers/finance/sync', data)
}

// 信用检查
export const checkCredit = async (customerId: string, orderAmount: number) => {
  return request.post('/api/v1/integration/erp/customers/credit-check', {
    customer_id: customerId,
    order_amount: orderAmount,
  })
}

// 应收账款列表
export const getReceivables = async (customerId?: string) => {
  return request.get('/api/v1/integration/erp/customers/receivables', {
    params: { customer_id: customerId },
  })
}

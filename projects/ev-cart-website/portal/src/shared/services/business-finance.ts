import api from '@shared/services/api'

/**
 * 业财一体化服务
 * 实现业务单据自动生成财务凭证
 */

export interface BusinessFinanceLink {
  businessType: 'sales' | 'purchase' | 'production' | 'service'
  businessId: string
  financeVoucherId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export const businessFinanceService = {
  /**
   * 销售订单 → 应收账款
   */
  createReceivableFromSales: async (orderId: string) => {
    return api.post('/finance/receivables/from-sales', { orderId })
  },

  /**
   * 采购订单 → 应付账款
   */
  createPayableFromPurchase: async (orderId: string) => {
    return api.post('/finance/payables/from-purchase', { orderId })
  },

  /**
   * 出库单 → 成本结转
   */
  createCostFromOutbound: async (outboundId: string) => {
    return api.post('/finance/cost/from-outbound', { outboundId })
  },

  /**
   * 服务工单 → 服务收入
   */
  createRevenueFromService: async (serviceId: string) => {
    return api.post('/finance/revenue/from-service', { serviceId })
  },

  /**
   * 生成财务凭证
   */
  createVoucher: async (data: {
    type: string
    businessType: string
    businessId: string
    amount: number
    accountId: string
  }) => {
    return api.post('/finance/vouchers', data)
  },
}

/**
 * 业财一体化流程
 * 
 * 1. 销售订单审核通过 → 自动生成应收账款
 * 2. 采购订单入库 → 自动生成应付账款
 * 3. 出库单完成 → 自动结转成本
 * 4. 服务工单完成 → 自动生成服务收入
 */

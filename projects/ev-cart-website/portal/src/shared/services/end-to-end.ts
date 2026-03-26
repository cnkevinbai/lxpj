import api from '@shared/services/api'

/**
 * 端到端流程自动化服务
 * 实现从销售订单到收款的全流程自动化
 */

export interface EndToEndOrder {
  salesOrderId: string
  customerId: string
  products: OrderProduct[]
  status: 'pending' | 'production' | 'purchasing' | 'producing' | 'stocked' | 'shipped' | 'completed'
  productionOrderId?: string
  purchaseOrders?: string[]
  outboundId?: string
  receivableId?: string
}

export interface OrderProduct {
  productId: string
  productName: string
  quantity: number
  stockQuantity: number
  needProduction: boolean
}

export const endToEndService = {
  /**
   * 创建销售订单并自动触发后续流程
   */
  createSalesOrderAuto: async (orderData: {
    customerId: string
    products: OrderProduct[]
    deliveryDate: string
  }) => {
    return api.post('/sales/orders/auto', orderData)
  },

  /**
   * 检查库存和产能
   */
  checkStockAndCapacity: async (products: OrderProduct[]) => {
    return api.post('/check/stock-capacity', { products })
  },

  /**
   * 自动创建生产工单
   */
  autoCreateProductionOrder: async (salesOrderId: string, products: OrderProduct[]) => {
    return api.post('/production/orders/auto', { salesOrderId, products })
  },

  /**
   * 自动创建采购申请
   */
  autoCreatePurchaseRequest: async (productionOrderId: string, materials: any[]) => {
    return api.post('/purchase/requests/auto', { productionOrderId, materials })
  },

  /**
   * 自动出库
   */
  autoOutbound: async (salesOrderId: string) => {
    return api.post('/outbound/auto', { salesOrderId })
  },

  /**
   * 自动创建应收账款
   */
  autoCreateReceivable: async (salesOrderId: string, outboundId: string) => {
    return api.post('/finance/receivables/auto', { salesOrderId, outboundId })
  },

  /**
   * 全流程状态跟踪
   */
  trackOrderStatus: async (salesOrderId: string) => {
    return api.get(`/sales/orders/${salesOrderId}/track`)
  },
}

/**
 * 端到端自动化流程
 * 
 * 1. 客户下单 → 检查库存/产能
 * 2. 库存不足 → 自动创建生产工单
 * 3. 物料不足 → 自动创建采购申请
 * 4. 生产完成 → 自动入库
 * 5. 自动出库发货
 * 6. 自动生成应收账款
 * 7. 自动跟踪回款
 * 
 * 全流程无需手工干预！
 */

import api from '@shared/services/api'

/**
 * 业服一体化服务
 * 实现服务工单与业务系统的联动
 */

export interface ServiceBusinessLink {
  serviceId: string
  salesOrderId?: string
  customerId: string
  parts: ServicePart[]
  status: 'pending' | 'processing' | 'completed'
}

export interface ServicePart {
  partId: string
  partName: string
  quantity: number
  stockId?: string
}

export const serviceBusinessService = {
  /**
   * 服务工单关联销售订单
   */
  linkServiceToSalesOrder: async (serviceId: string, salesOrderId: string) => {
    return api.post(`/service/${serviceId}/link-sales-order`, { salesOrderId })
  },

  /**
   * 服务工单扣减配件库存
   */
  deductPartsInventory: async (serviceId: string, parts: ServicePart[]) => {
    return api.post(`/service/${serviceId}/deduct-parts`, { parts })
  },

  /**
   * 服务工单结算费用
   */
  settleServiceFee: async (serviceId: string, feeData: {
    laborFee: number
    partsFee: number
    otherFee: number
  }) => {
    return api.post(`/service/${serviceId}/settle-fee`, feeData)
  },

  /**
   * 检查配件库存
   */
  checkPartsStock: async (partIds: string[]) => {
    return api.get('/inventory/parts/check', { params: { partIds } })
  },

  /**
   * 配件库存不足时自动触发采购申请
   */
  autoCreatePurchaseRequest: async (parts: ServicePart[]) => {
    return api.post('/purchase/requests/auto', { parts })
  },
}

/**
 * 业服一体化流程
 * 
 * 1. 创建服务工单 → 关联销售订单 → 获取客户信息
 * 2. 服务工单领料 → 检查库存 → 扣减库存
 * 3. 库存不足 → 自动触发采购申请
 * 4. 服务完成 → 结算费用 → 生成服务收入
 */

import api from './api'
import type { MailService, Part } from '../types/service-ticket'

/**
 * 邮寄管理服务
 */
export const mailServiceService = {
  // ==================== 邮寄单管理 ====================
  
  /**
   * 创建邮寄单
   */
  createMail: async (data: {
    ticketId: string
    parts: Part[]
    courierCompany?: string
    shippingAddress: {
      name: string
      phone: string
      province: string
      city: string
      district: string
      address: string
      zipCode?: string
    }
    returnRequired?: boolean
    returnAddress?: {
      name: string
      phone: string
      province: string
      city: string
      district: string
      address: string
      zipCode?: string
    }
  }) => {
    return api.post('/service/mail', data)
  },

  /**
   * 获取邮寄单详情
   */
  getMailById: async (mailId: string) => {
    return api.get(`/service/mail/${mailId}`)
  },

  /**
   * 获取工单的邮寄单
   */
  getMailByTicketId: async (ticketId: string) => {
    return api.get(`/service/tickets/${ticketId}/mail`)
  },

  /**
   * 获取邮寄单列表
   */
  getMailList: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    ticketId?: string
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/mail', { params })
  },

  // ==================== 配件管理 ====================
  
  /**
   * 配件拣货
   */
  pickParts: async (mailId: string, data: {
    parts: Part[]
    warehouseId: string
    pickerId: string
    pickerName: string
  }) => {
    return api.post(`/service/mail/${mailId}/pick`, data)
  },

  /**
   * 配件质检
   */
  qualityCheck: async (mailId: string, data: {
    checkerId: string
    checkerName: string
    checked: boolean
    notes?: string
    photos?: string[]
  }) => {
    return api.post(`/service/mail/${mailId}/quality-check`, data)
  },

  /**
   * 配件打包
   */
  packParts: async (mailId: string, data: {
    packerId: string
    packerName: string
    packageWeight?: number
    packageSize?: {
      length: number
      width: number
      height: number
    }
    packagingMaterials?: string[]
    notes?: string
  }) => {
    return api.post(`/service/mail/${mailId}/pack`, data)
  },

  // ==================== 快递管理 ====================
  
  /**
   * 快递下单
   */
  createShippingOrder: async (mailId: string, data: {
    courierCompany: string
    serviceType: 'standard' | 'express' | 'same_day'
    senderInfo: {
      name: string
      phone: string
      address: string
    }
    receiverInfo: {
      name: string
      phone: string
      address: string
    }
    packageInfo: {
      weight: number
      length: number
      width: number
      height: number
      declaredValue: number
    }
    codAmount?: number // 代收货款
  }) => {
    return api.post(`/service/mail/${mailId}/shipping`, data)
  },

  /**
   * 获取快递价格
   */
  getShippingPrice: async (data: {
    courierCompany: string
    fromProvince: string
    fromCity: string
    toProvince: string
    toCity: string
    weight: number
  }) => {
    return api.post('/service/shipping/price', data)
  },

  /**
   * 支持的快递公司
   */
  getSupportedCouriers: async () => {
    return api.get('/service/shipping/couriers')
  },

  /**
   * 打印快递单
   */
  printShippingLabel: async (mailId: string, data?: {
    template?: string
    size?: 'A4' | 'A5' | 'custom'
  }) => {
    return api.post(`/service/mail/${mailId}/print-label`, data, {
      responseType: 'blob',
    })
  },

  // ==================== 发货管理 ====================
  
  /**
   * 确认发货
   */
  confirmShipment: async (mailId: string, data: {
    courierCompany: string
    trackingNumber: string
    shippedAt: string
    shippingCost: number
    notes?: string
  }) => {
    return api.post(`/service/mail/${mailId}/ship`, data)
  },

  /**
   * 取消发货
   */
  cancelShipment: async (mailId: string, reason: string) => {
    return api.post(`/service/mail/${mailId}/cancel-ship`, { reason })
  },

  // ==================== 物流跟踪 ====================
  
  /**
   * 查询物流信息
   */
  trackShipping: async (mailId: string) => {
    return api.get(`/service/mail/${mailId}/tracking`)
  },

  /**
   * 自动同步物流信息
   */
  syncTracking: async (mailId: string) => {
    return api.post(`/service/mail/${mailId}/tracking/sync`)
  },

  /**
   * 获取物流轨迹
   */
  getTrackingHistory: async (mailId: string) => {
    return api.get(`/service/mail/${mailId}/tracking/history`)
  },

  /**
   * 物流异常预警
   */
  getTrackingAlerts: async (params?: {
    page?: number
    pageSize?: number
    type?: 'delayed' | 'lost' | 'damaged' | 'returned'
  }) => {
    return api.get('/service/shipping/alerts', { params })
  },

  // ==================== 收货确认 ====================
  
  /**
   * 客户确认收货
   */
  confirmDelivery: async (mailId: string, data: {
    receivedAt: string
    receivedBy?: string
    condition: 'good' | 'damaged' | 'incomplete'
    notes?: string
    photos?: string[]
  }) => {
    return api.post(`/service/mail/${mailId}/confirm-delivery`, data)
  },

  /**
   * 系统确认收货（超时自动确认）
   */
  autoConfirmDelivery: async (mailId: string) => {
    return api.post(`/service/mail/${mailId}/auto-confirm`)
  },

  /**
   * 收货异常处理
   */
  handleDeliveryIssue: async (mailId: string, data: {
    issueType: 'damaged' | 'incomplete' | 'wrong' | 'lost'
    description: string
    photos: string[]
    solution: 'resend' | 'refund' | 'compensate'
  }) => {
    return api.post(`/service/mail/${mailId}/issue`, data)
  },

  // ==================== 旧件回收 ====================
  
  /**
   * 创建旧件回收单
   */
  createReturnOrder: async (mailId: string, data: {
    parts: Part[]
    returnReason: string
    returnAddress: {
      name: string
      phone: string
      address: string
    }
  }) => {
    return api.post(`/service/mail/${mailId}/return`, data)
  },

  /**
   * 旧件寄回
   */
  shipReturn: async (mailId: string, data: {
    courierCompany: string
    trackingNumber: string
    shippedAt: string
  }) => {
    return api.post(`/service/mail/${mailId}/return-ship`, data)
  },

  /**
   * 仓库确认收货
   */
  confirmReturnReceived: async (mailId: string, data: {
    receivedAt: string
    receiverId: string
    receiverName: string
    condition: 'good' | 'damaged' | 'incomplete'
    notes?: string
  }) => {
    return api.post(`/service/mail/${mailId}/return-confirm`, data)
  },

  /**
   * 旧件检验
   */
  inspectReturn: async (mailId: string, data: {
    inspectorId: string
    inspectorName: string
    condition: 'good' | 'damaged' | 'scrap'
    notes?: string
    photos?: string[]
  }) => {
    return api.post(`/service/mail/${mailId}/return-inspect`, data)
  },

  // ==================== 统计分析 ====================
  
  /**
   * 邮寄统计
   */
  getMailStatistics: async (params?: {
    startDate?: string
    endDate?: string
    courierCompany?: string
    serviceType?: string
  }) => {
    return api.get('/service/mail/statistics', { params })
  },

  /**
   * 快递费用统计
   */
  getShippingCostStatistics: async (params?: {
    startDate?: string
    endDate?: string
    courierCompany?: string
  }) => {
    return api.get('/service/shipping/cost-statistics', { params })
  },

  /**
   * 邮寄时效分析
   */
  getDeliveryTimeAnalysis: async (params?: {
    startDate?: string
    endDate?: string
    courierCompany?: string
  }) => {
    return api.get('/service/shipping/time-analysis', { params })
  },

  // ==================== 快递公司集成 ====================
  
  /**
   * 顺丰速运
   */
  sfExpress: {
    createOrder: (data: any) => api.post('/shipping/sf/create', data),
    cancelOrder: (orderId: string) => api.post(`/shipping/sf/${orderId}/cancel`),
    track: (trackingNumber: string) => api.get(`/shipping/sf/track/${trackingNumber}`),
    printLabel: (orderId: string) => api.post(`/shipping/sf/${orderId}/print`, { responseType: 'blob' }),
  },

  /**
   * 中通快递
   */
  ztoExpress: {
    createOrder: (data: any) => api.post('/shipping/zto/create', data),
    track: (trackingNumber: string) => api.get(`/shipping/zto/track/${trackingNumber}`),
  },

  /**
   * 圆通速递
   */
  ytoExpress: {
    createOrder: (data: any) => api.post('/shipping/yto/create', data),
    track: (trackingNumber: string) => api.get(`/shipping/yto/track/${trackingNumber}`),
  },

  /**
   * 申通快递
   */
  stoExpress: {
    createOrder: (data: any) => api.post('/shipping/sto/create', data),
    track: (trackingNumber: string) => api.get(`/shipping/sto/track/${trackingNumber}`),
  },

  /**
   * 韵达快递
   */
  yundaExpress: {
    createOrder: (data: any) => api.post('/shipping/yunda/create', data),
    track: (trackingNumber: string) => api.get(`/shipping/yunda/track/${trackingNumber}`),
  },

  /**
   * 邮政 EMS
   */
  ems: {
    createOrder: (data: any) => api.post('/shipping/ems/create', data),
    track: (trackingNumber: string) => api.get(`/shipping/ems/track/${trackingNumber}`),
  },
}

/**
 * 邮寄流程快捷方法
 */
export const mailFlow = {
  /**
   * 完整邮寄流程
   */
  async completeMailProcess(ticketId: string, parts: Part[], shippingAddress: any) {
    // 1. 创建邮寄单
    const mail = await mailServiceService.createMail({
      ticketId,
      parts,
      shippingAddress,
      returnRequired: true,
    })

    // 2. 配件拣货
    await mailServiceService.pickParts(mail.id, {
      parts,
      warehouseId: 'main-warehouse',
      pickerId: 'picker-001',
      pickerName: '张三',
    })

    // 3. 配件质检
    await mailServiceService.qualityCheck(mail.id, {
      checkerId: 'checker-001',
      checkerName: '李四',
      checked: true,
    })

    // 4. 配件打包
    await mailServiceService.packParts(mail.id, {
      packerId: 'packer-001',
      packerName: '王五',
    })

    // 5. 快递下单
    const shippingOrder = await mailServiceService.createShippingOrder(mail.id, {
      courierCompany: 'sf',
      serviceType: 'express',
      senderInfo: {
        name: '道达智能',
        phone: '400-XXX-XXXX',
        address: 'XXX 省 XXX 市 XXX 区 XXX 路 XXX 号',
      },
      receiverInfo: shippingAddress,
      packageInfo: {
        weight: 1,
        length: 20,
        width: 15,
        height: 10,
        declaredValue: 1000,
      },
    })

    // 6. 打印快递单
    await mailServiceService.printShippingLabel(mail.id)

    // 7. 确认发货
    await mailServiceService.confirmShipment(mail.id, {
      courierCompany: 'sf',
      trackingNumber: shippingOrder.trackingNumber,
      shippedAt: new Date().toISOString(),
      shippingCost: shippingOrder.cost,
    })

    return mail
  },
}

export default mailServiceService

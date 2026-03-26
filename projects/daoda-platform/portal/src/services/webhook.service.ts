import { request } from './api'

export interface Webhook {
  id: string
  name: string
  url: string
  secret?: string
  events: string[]
  enabled: boolean
  lastTriggeredAt?: string
  failureCount: number
  createdAt: string
}

export interface WebhookLog {
  id: string
  webhookId: string
  event: string
  payload: any
  response?: any
  statusCode?: number
  success: boolean
  duration?: number
  createdAt: string
}

export const webhookService = {
  getAll(): Promise<Webhook[]> {
    return request.get<Webhook[]>('/webhooks')
  },

  getOne(id: string): Promise<Webhook> {
    return request.get<Webhook>(`/webhooks/${id}`)
  },

  create(data: Partial<Webhook>): Promise<Webhook> {
    return request.post<Webhook>('/webhooks', data)
  },

  update(id: string, data: Partial<Webhook>): Promise<Webhook> {
    return request.put<Webhook>(`/webhooks/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return request.delete(`/webhooks/${id}`)
  },

  test(id: string): Promise<{ success: boolean; message: string }> {
    return request.post(`/webhooks/${id}/test`, {})
  },

  getLogs(id: string): Promise<WebhookLog[]> {
    return request.get<WebhookLog[]>(`/webhooks/${id}/logs`)
  },
}

// 可订阅的事件类型
export const WEBHOOK_EVENTS = [
  // CRM
  { value: 'customer.created', label: '客户创建' },
  { value: 'customer.updated', label: '客户更新' },
  { value: 'lead.created', label: '线索创建' },
  { value: 'opportunity.won', label: '商机赢单' },
  { value: 'order.created', label: '订单创建' },
  
  // ERP
  { value: 'purchase.completed', label: '采购完成' },
  { value: 'production.started', label: '生产开始' },
  { value: 'inventory.low', label: '库存预警' },
  
  // Finance
  { value: 'invoice.issued', label: '发票开具' },
  { value: 'payment.received', label: '收款到账' },
]

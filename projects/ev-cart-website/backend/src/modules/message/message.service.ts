import { Injectable } from '@nestjs/common'

@Injectable()
export class MessageService {
  private messages: any[] = [
    {
      id: '1',
      type: 'system',
      title: '系统升级通知',
      content: '系统将于今晚 22:00 进行例行维护，预计持续 2 小时。',
      sender: '系统管理员',
      isRead: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'approval',
      title: '新的审批请求',
      content: '您有一个新的采购订单待审批，金额：¥28,500',
      sender: '采购部',
      isRead: false,
      priority: 'normal',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'order',
      title: '订单完成通知',
      content: '订单 ORD-20260312-001 已完成发货，请注意查收。',
      sender: '订单系统',
      isRead: true,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'inventory',
      title: '库存预警',
      content: '产品 EV Cart Pro 库存不足，当前库存：23 件。',
      sender: '库存系统',
      isRead: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      type: 'service',
      title: '新的服务工单',
      content: '收到新的售后服务请求，客户：张三，问题：产品故障。',
      sender: '售后系统',
      isRead: true,
      priority: 'normal',
      createdAt: new Date().toISOString(),
    },
  ]

  async getMessages(params: any) {
    const { page = 1, limit = 20, type, priority } = params
    let filtered = this.messages

    if (type) filtered = filtered.filter(m => m.type === type)
    if (priority) filtered = filtered.filter(m => m.priority === priority)

    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    }
  }

  async markAsRead(id: string) {
    const message = this.messages.find(m => m.id === id)
    if (message) {
      message.isRead = true
    }
    return message
  }

  async markAllAsRead() {
    this.messages.forEach(m => m.isRead = true)
    return { success: true }
  }

  async deleteMessage(id: string) {
    const index = this.messages.findIndex(m => m.id === id)
    if (index >= 0) {
      this.messages.splice(index, 1)
    }
    return { success: true }
  }
}

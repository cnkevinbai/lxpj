import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductionService {
  private orders: any[] = []
  private boms: any[] = []

  // ==================== 生产工单 ====================

  async createOrder(dto: any) {
    const order = {
      id: `MO-${Date.now()}`,
      order_no: `MO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
      progress: 0,
      created_at: new Date().toISOString(),
    }
    this.orders.push(order)
    return { success: true, data: order }
  }

  async getOrders(status?: string) {
    let orders = this.orders
    if (status) {
      orders = orders.filter(o => o.status === status)
    }
    return orders
  }

  async getOrder(id: string) {
    return this.orders.find(o => o.id === id)
  }

  async updateOrderStatus(id: string, status: string) {
    const order = this.orders.find(o => o.id === id)
    if (order) {
      order.status = status
      if (status === 'completed') {
        order.progress = 100
        order.actual_end_date = new Date().toISOString()
      }
      return { success: true, data: order }
    }
    return { success: false, message: '生产工单不存在' }
  }

  async getProgress(orderId: string) {
    const order = this.orders.find(o => o.id === orderId)
    if (order) {
      return {
        order_id: orderId,
        production_orders: [order],
        overall_progress: order.progress,
        estimated_delivery_date: order.planned_end_date,
      }
    }
    return { success: false, message: '生产工单不存在' }
  }

  // ==================== BOM 管理 ====================

  async createBom(dto: any) {
    const bom = {
      id: `BOM-${Date.now()}`,
      bom_code: `BOM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'active',
      created_at: new Date().toISOString(),
    }
    this.boms.push(bom)
    return { success: true, data: bom }
  }

  async getBoms() {
    return this.boms
  }

  async getBom(id: string) {
    return this.boms.find(b => b.id === id)
  }
}

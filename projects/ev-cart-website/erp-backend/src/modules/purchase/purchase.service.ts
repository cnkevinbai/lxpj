import { Injectable } from '@nestjs/common'

@Injectable()
export class PurchaseService {
  private requests: any[] = []
  private orders: any[] = []
  private suppliers: any[] = []

  // ==================== 采购申请 ====================

  async createRequest(dto: any) {
    const request = {
      id: `PR-${Date.now()}`,
      request_no: `PR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    this.requests.push(request)
    return { success: true, data: request }
  }

  async getRequests(status?: string) {
    let requests = this.requests
    if (status) {
      requests = requests.filter(r => r.status === status)
    }
    return requests
  }

  async getRequest(id: string) {
    return this.requests.find(r => r.id === id)
  }

  async updateRequestStatus(id: string, status: string) {
    const request = this.requests.find(r => r.id === id)
    if (request) {
      request.status = status
      return { success: true, data: request }
    }
    return { success: false, message: '采购申请不存在' }
  }

  // ==================== 采购订单 ====================

  async createOrder(dto: any) {
    const order = {
      id: `PO-${Date.now()}`,
      order_no: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
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
      return { success: true, data: order }
    }
    return { success: false, message: '采购订单不存在' }
  }

  async receiveOrder(id: string) {
    const order = this.orders.find(o => o.id === id)
    if (order) {
      order.status = 'received'
      return { success: true, message: '采购入库成功', data: order }
    }
    return { success: false, message: '采购订单不存在' }
  }

  // ==================== 供应商 ====================

  async createSupplier(dto: any) {
    const supplier = {
      id: `SUP-${Date.now()}`,
      supplier_code: `SUP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'active',
      created_at: new Date().toISOString(),
    }
    this.suppliers.push(supplier)
    return { success: true, data: supplier }
  }

  async getSuppliers() {
    return this.suppliers
  }

  async getSupplier(id: string) {
    return this.suppliers.find(s => s.id === id)
  }
}

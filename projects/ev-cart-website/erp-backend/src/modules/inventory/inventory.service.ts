import { Injectable } from '@nestjs/common'

@Injectable()
export class InventoryService {
  private inventory: any[] = []
  private inboundOrders: any[] = []
  private outboundOrders: any[] = []

  // ==================== 库存查询 ====================

  async getStock(materialId?: string, warehouseId?: string) {
    let stock = this.inventory
    if (materialId) {
      stock = stock.filter(i => i.material_id === materialId)
    }
    if (warehouseId) {
      stock = stock.filter(i => i.warehouse_id === warehouseId)
    }
    return stock
  }

  async getWarnings() {
    return this.inventory.filter(i => i.quantity < i.safety_stock)
  }

  async checkAvailability(items: any[]) {
    const results = []
    for (const item of items) {
      const stock = this.inventory.find(
        i => i.material_id === item.material_id,
      )
      const available = stock ? stock.quantity - stock.locked_qty : 0
      results.push({
        material_id: item.material_id,
        required: item.quantity,
        available,
        sufficient: available >= item.quantity,
      })
    }
    return results
  }

  // ==================== 入库管理 ====================

  async createInbound(dto: any) {
    const inbound = {
      id: `IN-${Date.now()}`,
      inbound_no: `IN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    this.inboundOrders.push(inbound)
    return { success: true, data: inbound }
  }

  async getInbound(warehouseId?: string) {
    let orders = this.inboundOrders
    if (warehouseId) {
      orders = orders.filter(o => o.warehouse_id === warehouseId)
    }
    return orders
  }

  async confirmInbound(id: string) {
    const order = this.inboundOrders.find(o => o.id === id)
    if (order) {
      order.status = 'confirmed'
      // 更新库存
      for (const item of order.items || []) {
        const stock = this.inventory.find(
          i => i.material_id === item.material_id && i.warehouse_id === order.warehouse_id,
        )
        if (stock) {
          stock.quantity += item.quantity
        } else {
          this.inventory.push({
            warehouse_id: order.warehouse_id,
            material_id: item.material_id,
            quantity: item.quantity,
            locked_qty: 0,
          })
        }
      }
      return { success: true, message: '入库确认成功' }
    }
    return { success: false, message: '入库单不存在' }
  }

  // ==================== 出库管理 ====================

  async createOutbound(dto: any) {
    const outbound = {
      id: `OUT-${Date.now()}`,
      outbound_no: `OUT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    this.outboundOrders.push(outbound)
    return { success: true, data: outbound }
  }

  async getOutbound(warehouseId?: string) {
    let orders = this.outboundOrders
    if (warehouseId) {
      orders = orders.filter(o => o.warehouse_id === warehouseId)
    }
    return orders
  }

  async confirmOutbound(id: string) {
    const order = this.outboundOrders.find(o => o.id === id)
    if (order) {
      order.status = 'confirmed'
      // 扣减库存
      for (const item of order.items || []) {
        const stock = this.inventory.find(
          i => i.material_id === item.material_id && i.warehouse_id === order.warehouse_id,
        )
        if (stock) {
          stock.quantity -= item.quantity
        }
      }
      return { success: true, message: '出库确认成功' }
    }
    return { success: false, message: '出库单不存在' }
  }
}

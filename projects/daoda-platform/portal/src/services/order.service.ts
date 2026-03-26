/**
 * 订单服务
 * 处理订单管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PRODUCING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  totalPrice: number
  remark: string | null
}

export interface Order {
  id: string
  orderNo: string
  status: OrderStatus
  totalAmount: number
  paidAmount: number
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  remark: string | null
  customerId: string
  customerName: string
  userId: string | null
  userName: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderDto {
  customerId: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    remark?: string
  }[]
  paymentMethod?: string
  remark?: string
}

export interface UpdateOrderDto {
  status?: OrderStatus
  paymentMethod?: string
  remark?: string
}

export interface OrderQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  customerId?: string
  startDate?: string
  endDate?: string
}

export interface OrderStatistics {
  total: number
  pending: number
  completed: number
  totalAmount: number
  paidAmount: number
}

// ==================== 订单服务 ====================

export const orderService = {
  /**
   * 获取订单列表
   */
  getList(params: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    return request.get<PaginatedResponse<Order>>('/orders', { params })
  },

  /**
   * 获取订单详情
   */
  getOne(id: string): Promise<Order> {
    return request.get<Order>(`/orders/${id}`)
  },

  /**
   * 根据订单号获取订单
   */
  getByOrderNo(orderNo: string): Promise<Order> {
    return request.get<Order>(`/orders/no/${orderNo}`)
  },

  /**
   * 创建订单
   */
  create(dto: CreateOrderDto): Promise<Order> {
    return request.post<Order>('/orders', dto)
  },

  /**
   * 更新订单
   */
  update(id: string, dto: UpdateOrderDto): Promise<Order> {
    return request.put<Order>(`/orders/${id}`, dto)
  },

  /**
   * 取消订单
   */
  cancel(id: string, reason?: string): Promise<Order> {
    return request.post<Order>(`/orders/${id}/cancel`, { reason })
  },

  /**
   * 确认订单
   */
  confirm(id: string): Promise<Order> {
    return request.post<Order>(`/orders/${id}/confirm`)
  },

  /**
   * 更新订单状态
   */
  updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return request.patch<Order>(`/orders/${id}/status`, { status })
  },

  /**
   * 获取订单统计
   */
  getStatistics(params?: { startDate?: string; endDate?: string }): Promise<OrderStatistics> {
    return request.get<OrderStatistics>('/orders/statistics', { params })
  },
}

export default orderService
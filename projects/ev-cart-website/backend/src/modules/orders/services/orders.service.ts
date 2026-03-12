import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
  ) {}

  /**
   * 获取订单列表
   */
  async getOrders(params: any) {
    const { page = 1, limit = 20, status, customer } = params
    const query = this.orderRepo.createQueryBuilder('order')

    if (status) {
      query.andWhere('order.status = :status', { status })
    }
    if (customer) {
      query.andWhere('order.customerId = :customer', { customer })
    }

    query.orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 创建订单
   */
  async createOrder(data: any, userId: string) {
    const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const order = this.orderRepo.create({
      ...data,
      orderCode,
      salesRepId: userId,
    })

    const savedOrder = await this.orderRepo.save(order)

    // 创建订单明细
    if (data.items && data.items.length > 0) {
      const items = data.items.map((item: any) =>
        this.itemRepo.create({
          ...item,
          orderId: savedOrder.id,
          finalAmount: item.totalPrice - item.discount + item.taxAmount,
        })
      )
      await this.itemRepo.save(items)
    }

    return savedOrder
  }

  /**
   * 更新订单状态
   */
  async updateStatus(id: string, status: string) {
    const order = await this.orderRepo.findOne({ where: { id } })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }
    order.status = status
    return this.orderRepo.save(order)
  }

  /**
   * 获取订单统计
   */
  async getStatistics() {
    const totalOrders = await this.orderRepo.count()
    const pendingOrders = await this.orderRepo.count({ where: { status: 'pending' } })
    const processingOrders = await this.orderRepo.count({ where: { status: 'processing' } })
    const completedOrders = await this.orderRepo.count({ where: { status: 'completed' } })

    const totalAmount = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'sum')
      .getRawOne()

    const paidAmount = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.paid_amount)', 'sum')
      .getRawOne()

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalAmount: parseFloat(totalAmount?.sum) || 0,
      paidAmount: parseFloat(paidAmount?.sum) || 0,
    }
  }
}

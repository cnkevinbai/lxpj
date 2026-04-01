/**
 * 订单服务
 * 处理订单的 CRUD 操作、状态流转和支付管理
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Order, OrderStatus, PaymentStatus, OrderItem } from '@prisma/client'
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  PaymentDto,
  OrderQueryDto,
  OrderListResponse,
  OrderStatsResponse,
} from './order.dto'

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name)

  constructor(private prisma: PrismaService) {}

  // ==================== 订单号生成 ====================

  /**
   * 生成订单号
   * 格式：ORD-YYYYMMDD-XXXX
   */
  private async generateOrderNo(): Promise<string> {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')

    // 查询当天已有订单数量
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    })

    // 生成序号（4 位数字）
    const seq = (count + 1).toString().padStart(4, '0')
    return `ORD-${dateStr}-${seq}`
  }

  // ==================== 订单 CRUD 操作 ====================

  /**
   * 创建订单
   * @param dto 订单信息
   * @param userId 创建者 ID
   */
  async create(dto: CreateOrderDto, userId?: string): Promise<Order> {
    // 检查客户是否存在
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    // 验证订单项并计算总价
    const itemsData: any[] = []
    let totalAmount = 0

    for (const item of dto.items) {
      // 检查产品是否存在
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (!product) {
        throw new NotFoundException(`产品不存在：${item.productId}`)
      }

      const totalPrice = item.unitPrice * item.quantity
      totalAmount += totalPrice

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        amount: totalPrice.toString(),
        remark: item.remark,
      })
    }

    // 生成订单号
    const orderNo = await this.generateOrderNo()

    // 创建订单（使用事务）
    const order = await this.prisma.order.create({
      data: {
        orderNo,
        customerId: dto.customerId,
        status: OrderStatus.PENDING,
        amount: totalAmount.toString(),
        paidAmount: '0',
        paymentStatus: PaymentStatus.UNPAID,
        remark: dto.remark,
        items: {
          create: itemsData,
        },
      },
    })

    this.logger.log(`创建订单成功：${order.orderNo}`)
    return order
  }

  /**
   * 更新订单
   * @param id 订单 ID
   * @param dto 更新内容
   */
  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    // 检查订单是否存在
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }

    // 更新订单
    const updated = await this.prisma.order.update({
      where: { id },
      data: dto,
    })

    this.logger.log(`更新订单成功：${updated.orderNo}`)
    return updated
  }

  /**
   * 删除订单（软删除 - 实际是取消订单）
   * @param id 订单 ID
   */
  async delete(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }

    // 只有待确认的订单可以直接删除
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('只能删除待确认状态的订单')
    }

    // 更新状态为已取消
    await this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    })

    this.logger.log(`取消订单成功：${order.orderNo}`)
  }

  /**
   * 获取订单详情
   * @param id 订单 ID
   */
  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }
    return order
  }

  /**
   * 获取订单列表（分页、筛选、搜索）
   * @param query 查询参数
   */
  async findAll(query: OrderQueryDto): Promise<OrderListResponse> {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      status,
      paymentStatus,
      customerId,
      userId,
      startDate,
      endDate,
    } = query

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（订单号）
    if (keyword) {
      where.orderNo = { contains: keyword, mode: 'insensitive' }
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (userId) {
      where.userId = userId
    }

    // 日期范围筛选
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        // 包含结束日期当天
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        where.createdAt.lt = end
      }
    }

    // 查询总数
    const total = await this.prisma.order.count({ where })

    // 查询列表
    const list = await this.prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  // ==================== 订单状态流转 ====================

  /**
   * 更新订单状态
   * 状态流转：PENDING → CONFIRMED → PRODUCING → SHIPPED → COMPLETED
   *                          ↓
   *                       CANCELLED
   * @param id 订单 ID
   * @param status 新状态
   * @param remark 备注
   */
  async updateStatus(id: string, status: string, remark?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }

    // 验证状态流转
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    }

    const allowedStatuses = validTransitions[order.status]
    if (!allowedStatuses.includes(status as OrderStatus)) {
      throw new BadRequestException(`订单状态不能从 ${order.status} 变更为 ${status}`)
    }

    // 更新状态
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        remark: remark
          ? `${order.remark || ''}\n[${new Date().toISOString()}] ${remark}`
          : order.remark,
      },
    })

    this.logger.log(`订单状态更新：${order.orderNo} ${order.status} -> ${status}`)
    return updated
  }

  // ==================== 支付管理 ====================

  /**
   * 记录支付
   * @param id 订单 ID
   * @param amount 支付金额
   * @param remark 备注
   */
  async recordPayment(id: string, amount: number, remark?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('已取消的订单不能支付')
    }

    const totalAmount = parseFloat(order.amount.toString())
    const paidAmount = parseFloat(order.paidAmount.toString())
    const newPaidAmount = paidAmount + amount

    // 检查支付金额
    if (newPaidAmount > totalAmount) {
      throw new BadRequestException('支付金额不能超过订单总额')
    }

    // 确定支付状态
    let paymentStatus: PaymentStatus
    if (newPaidAmount >= totalAmount) {
      paymentStatus = PaymentStatus.PAID
    } else if (newPaidAmount > 0) {
      paymentStatus = PaymentStatus.PARTIAL
    } else {
      paymentStatus = PaymentStatus.UNPAID
    }

    // 更新订单
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount.toString(),
        paymentStatus,
        remark: remark ? `${order.remark || ''}\n[支付] ${remark}` : order.remark,
      },
    })

    this.logger.log(
      `订单支付记录：${order.orderNo} 支付 ${amount}，累计 ${newPaidAmount}/${totalAmount}`,
    )
    return updated
  }

  /**
   * 记录退款
   * @param id 订单 ID
   * @param amount 退款金额
   * @param remark 备注
   */
  async recordRefund(id: string, amount: number, remark?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      throw new NotFoundException('订单不存在')
    }

    const paidAmount = parseFloat(order.paidAmount.toString())
    const newPaidAmount = paidAmount - amount

    if (newPaidAmount < 0) {
      throw new BadRequestException('退款金额不能超过已支付金额')
    }

    // 确定支付状态
    let paymentStatus: PaymentStatus
    if (newPaidAmount <= 0) {
      paymentStatus = PaymentStatus.REFUNDED
    } else {
      paymentStatus = PaymentStatus.PARTIAL
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount.toString(),
        paymentStatus,
        remark: remark ? `${order.remark || ''}\n[退款] ${remark}` : order.remark,
      },
    })

    this.logger.log(`订单退款记录：${order.orderNo} 退款 ${amount}`)
    return updated
  }

  // ==================== 统计接口 ====================

  /**
   * 获取订单统计
   */
  async getStats(): Promise<OrderStatsResponse> {
    // 总订单数和总金额
    const [totalResult, statsResult] = await this.prisma.$transaction(
      async (prisma) =>
        [
          await prisma.order.aggregate({
            _sum: { amount: true },
            _count: { id: true },
          }),
          await prisma.order.groupBy({
            by: ['status'],
            orderBy: { _count: { id: 'desc' } },
            _count: { id: true },
            _sum: { amount: true },
          }),
        ] as any[],
    )

    // 按状态统计
    const statusStats: Record<string, { count: number; amount: number }> = {}
    statsResult.forEach((s: any) => {
      statusStats[s.status] = {
        count: (s as any)._count.id,
        amount: parseFloat((s as any)?._sum?.amount?.toString() || '0'),
      }
    })

    // 支付统计
    const paymentStats = await this.prisma.order.aggregate({
      _sum: { paidAmount: true },
      where: { paymentStatus: { in: [PaymentStatus.PAID, PaymentStatus.PARTIAL] } },
    })

    const unpaidStats = await this.prisma.order.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: PaymentStatus.UNPAID },
    })

    return {
      totalOrders: totalResult._count.id,
      totalAmount: parseFloat(totalResult._sum.amount?.toString() || '0'),
      pendingOrders: statusStats[OrderStatus.PENDING]?.count || 0,
      completedOrders: statusStats[OrderStatus.DELIVERED]?.count || 0,
      cancelledOrders: statusStats[OrderStatus.CANCELLED]?.count || 0,
      unpaidAmount: parseFloat(unpaidStats._sum.amount?.toString() || '0'),
      paidAmount: parseFloat(paymentStats._sum.paidAmount?.toString() || '0'),
    }
  }

  /**
   * 获取客户订单统计
   * @param customerId 客户 ID
   */
  async getCustomerStats(customerId: string): Promise<{ orderCount: number; totalAmount: number }> {
    const stats = await this.prisma.order.aggregate({
      _count: { id: true },
      _sum: { amount: true },
      where: { customerId },
    })

    return {
      orderCount: stats._count.id,
      totalAmount: parseFloat(stats._sum.amount?.toString() || '0'),
    }
  }
}

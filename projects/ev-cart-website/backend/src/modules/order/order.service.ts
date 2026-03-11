import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual } from 'typeorm'
import { Order } from './entities/order.entity'
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNo = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const order = this.repository.create({
      ...createOrderDto,
      orderNo,
    })
    return this.repository.save(order)
  }

  async findAll(page: number = 1, limit: number = 20, status?: string, startDate?: Date) {
    const query = this.repository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
    if (status) {
      query.where('order.status = :status', { status })
    }
    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate })
    }
    query.orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.repository.findOne({ 
      where: { id },
      relations: ['customer', 'opportunity']
    })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id)
    Object.assign(order, updateOrderDto)
    return this.repository.save(order)
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id)
    order.status = status
    return this.repository.save(order)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async getStatistics() {
    const total = await this.repository.count()
    const pending = await this.repository.count({ where: { status: 'pending' } })
    const completed = await this.repository.count({ where: { status: 'completed' } })
    const revenue = await this.repository
      .createQueryBuilder('order')
      .where('status = :status', { status: 'completed' })
      .select('SUM(total_amount)', 'total')
      .getRawOne()
    return {
      total,
      pending,
      completed,
      revenue: revenue?.total || 0,
    }
  }
}

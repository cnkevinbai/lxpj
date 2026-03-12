import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { FinanceReceivable } from './entities/finance-receivable.entity'
import { FinancePayment } from './entities/finance-payment.entity'

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(FinanceReceivable)
    private receivableRepo: Repository<FinanceReceivable>,
    @InjectRepository(FinancePayment)
    private paymentRepo: Repository<FinancePayment>,
  ) {}

  /**
   * 获取应收账款列表
   */
  async getReceivables(params: any) {
    const { page = 1, limit = 20, status, customerId } = params
    const query = this.receivableRepo.createQueryBuilder('receivable')

    if (status) {
      query.andWhere('receivable.status = :status', { status })
    }
    if (customerId) {
      query.andWhere('receivable.customerId = :customerId', { customerId })
    }

    query.orderBy('receivable.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 创建应收账款
   */
  async createReceivable(data: any, userId: string) {
    const receivableCode = `AR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const receivable = this.receivableRepo.create({
      ...data,
      receivableCode,
      createdBy: userId,
    })
    return this.receivableRepo.save(receivable)
  }

  /**
   * 记录收款
   */
  async recordPayment(data: any, userId: string) {
    const paymentCode = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // 更新应收账款
    const receivable = await this.receivableRepo.findOne({ where: { id: data.receivableId } })
    if (receivable) {
      receivable.paidAmount += data.amount
      receivable.balance -= data.amount
      if (receivable.balance <= 0) {
        receivable.status = 'paid'
      }
      await this.receivableRepo.save(receivable)
    }

    // 创建收款记录
    const payment = this.paymentRepo.create({
      ...data,
      paymentCode,
      createdBy: userId,
      paymentDate: new Date(data.paymentDate),
    })
    return this.paymentRepo.save(payment)
  }

  /**
   * 获取财务统计
   */
  async getStatistics() {
    const totalReceivables = await this.receivableRepo.count()
    const pendingReceivables = await this.receivableRepo.count({ where: { status: 'pending' } })
    const overdueReceivables = await this.receivableRepo.count({ 
      where: { 
        status: 'pending',
        dueDate: new Date()
      }
    })

    const totalAmount = await this.receivableRepo
      .createQueryBuilder('receivable')
      .select('SUM(receivable.amount)', 'sum')
      .getRawOne()

    const paidAmount = await this.receivableRepo
      .createQueryBuilder('receivable')
      .select('SUM(receivable.paid_amount)', 'sum')
      .where('receivable.status = :status', { status: 'paid' })
      .getRawOne()

    return {
      totalReceivables,
      pendingReceivables,
      overdueReceivables,
      totalAmount: parseFloat(totalAmount?.sum) || 0,
      paidAmount: parseFloat(paidAmount?.sum) || 0,
      collectionRate: totalAmount?.sum > 0 ? ((paidAmount?.sum / totalAmount?.sum) * 100).toFixed(2) : 0,
    }
  }

  /**
   * 获取收款记录列表
   */
  async getPayments(params: any) {
    const { page = 1, limit = 20 } = params
    const query = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.receivable', 'receivable')

    query.orderBy('payment.paymentDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }
}

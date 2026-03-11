import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { User } from '../user/entities/user.entity'

/**
 * 客户分配记录实体
 */
@Injectable()
export class CustomerAssignService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 分配客户给业务员
   */
  async assignCustomer(customerId: string, newOwnerId: string, currentUserId: string) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const oldOwnerId = customer.ownerId
    customer.ownerId = newOwnerId

    return this.customerRepository.save(customer)
  }

  /**
   * 批量分配客户
   */
  async batchAssignCustomer(customerIds: string[], newOwnerId: string) {
    await this.customerRepository.update(
      { id: In(customerIds) },
      { ownerId: newOwnerId },
    )

    return {
      success: true,
      count: customerIds.length,
    }
  }

  /**
   * 获取业务员的客户列表
   */
  async getCustomersByOwner(ownerId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await this.customerRepository.findAndCount({
      where: { ownerId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
    }
  }

  /**
   * 获取未分配客户
   */
  async getUnassignedCustomers(page: number = 1, limit: number = 20) {
    const [data, total] = await this.customerRepository.findAndCount({
      where: { ownerId: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
    }
  }

  /**
   * 业务员业绩统计
   */
  async getSalesPerformance(ownerId: string, startDate: string, endDate: string) {
    const totalCustomers = await this.customerRepository.count({
      where: {
        ownerId,
        createdAt: Between(startDate, endDate),
      },
    })

    const activeCustomers = await this.customerRepository.count({
      where: {
        ownerId,
        status: 'active',
      },
    })

    const byLevel = await this.customerRepository
      .createQueryBuilder('customer')
      .select('customer.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('customer.ownerId = :ownerId', { ownerId })
      .groupBy('customer.level')
      .getRawMany()

    return {
      ownerId,
      totalCustomers,
      activeCustomers,
      byLevel,
      startDate,
      endDate,
    }
  }
}

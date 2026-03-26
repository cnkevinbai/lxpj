/**
 * 服务合同服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceContract } from './entities/service-contract.entity'

// 类型定义
type ContractType = 'warranty' | 'maintenance' | 'support' | 'training'
type ContractStatus = 'active' | 'expired' | 'terminated' | 'suspended' | 'expiring'

@Injectable()
export class AfterSalesContractService {
  constructor(
    @InjectRepository(ServiceContract)
    private contractRepository: Repository<ServiceContract>,
  ) {}

  /**
   * 创建服务合同
   */
  async create(data: Partial<ServiceContract>): Promise<ServiceContract> {
    const contract = this.contractRepository.create({
      ...data,
      contractNo: this.generateContractNo(),
      status: 'active',
    })
    return this.contractRepository.save(contract)
  }

  /**
   * 生成合同编号
   */
  private generateContractNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `SC-${date}-${random}`
  }

  /**
   * 获取合同列表
   */
  async getContracts(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: ContractType
      status?: ContractStatus
      customerId?: string
    },
  ) {
    const query = this.contractRepository.createQueryBuilder('contract')
      .orderBy('contract.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.type) {
      query.andWhere('contract.type = :type', { type: filters.type })
    }
    if (filters?.status) {
      query.andWhere('contract.status = :status', { status: filters.status })
    }
    if (filters?.customerId) {
      query.andWhere('contract.customerId = :customerId', { customerId: filters.customerId })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取合同详情
   */
  async getContract(id: string): Promise<ServiceContract> {
    const contract = await this.contractRepository.findOne({ where: { id } })
    if (!contract) {
      throw new NotFoundException('服务合同不存在')
    }
    return contract
  }

  /**
   * 更新合同
   */
  async update(id: string, data: Partial<ServiceContract>): Promise<ServiceContract> {
    const contract = await this.getContract(id)
    Object.assign(contract, data)
    return this.contractRepository.save(contract)
  }

  /**
   * 检查合同状态
   */
  async checkContractStatus(id: string): Promise<ContractStatus> {
    const contract = await this.getContract(id)
    const today = new Date()
    const endDate = new Date(contract.endDate)

    if (contract.status === 'terminated') {
      return 'terminated'
    }

    if (today > endDate) {
      contract.status = 'expired'
      await this.contractRepository.save(contract)
      return 'expired'
    }

    // 检查是否即将到期 (30 天内)
    const daysUntilExpiry = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    if (daysUntilExpiry <= 30 && contract.status !== 'expiring') {
      contract.status = 'expiring'
      await this.contractRepository.save(contract)
      return 'expiring'
    }

    return 'active'
  }

  /**
   * 获取即将到期合同
   */
  async getExpiringContracts(days: number = 30) {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'active' })
      .andWhere('contract.endDate <= :futureDate', { futureDate })
      .andWhere('contract.endDate > :today', { today })
      .orderBy('contract.endDate', 'ASC')
      .getMany()
  }

  /**
   * 检查产品是否在保修期内
   */
  async isProductInWarranty(customerId: string, productId?: string): Promise<boolean> {
    const contract = await this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.customerId = :customerId', { customerId })
      .andWhere('contract.status = :status', { status: 'active' })
      .andWhere('contract.endDate > NOW()')
      .getOne()

    return !!contract
  }

  /**
   * 获取合同统计
   */
  async getContractStats() {
    const total = await this.contractRepository.count()
    const byStatus = await this.contractRepository
      .createQueryBuilder('contract')
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    const byType = await this.contractRepository
      .createQueryBuilder('contract')
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    const expiringCount = await this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'expiring' })
      .getCount()

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count)
        return acc
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count)
        return acc
      }, {}),
      expiringCount,
    }
  }
}

/**
 * 合同服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contract, ContractStatus, ContractSignature } from './entities/contract.entity'
import { EsignService } from './esign.service'

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private repository: Repository<Contract>,
    private esignService: EsignService,
  ) {}

  /**
   * 创建合同
   */
  async create(data: Partial<Contract>): Promise<Contract> {
    const contract = this.repository.create({
      ...data,
      contractNo: this.generateContractNo(),
      status: 'draft',
      version: 1,
    })
    return this.repository.save(contract)
  }

  /**
   * 生成合同编号
   */
  private generateContractNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 8).toUpperCase()
    return `CT-${date}-${random}`
  }

  /**
   * 获取合同列表
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string
      status?: string
      customerId?: string
      startDate?: string
      endDate?: string
    },
  ) {
    const query = this.repository.createQueryBuilder('contract')
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
    if (filters?.startDate) {
      query.andWhere('contract.startDate >= :startDate', { startDate: filters.startDate })
    }
    if (filters?.endDate) {
      query.andWhere('contract.endDate <= :endDate', { endDate: filters.endDate })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取合同详情
   */
  async findOne(id: string): Promise<Contract> {
    const contract = await this.repository.findOne({ where: { id } })
    if (!contract) {
      throw new NotFoundException('合同不存在')
    }
    return contract
  }

  /**
   * 更新合同
   */
  async update(id: string, data: Partial<Contract>): Promise<Contract> {
    const contract = await this.findOne(id)
    Object.assign(contract, data)
    return this.repository.save(contract)
  }

  /**
   * 提交审批
   */
  async submitForApproval(id: string): Promise<Contract> {
    const contract = await this.findOne(id)
    contract.status = 'pending'
    return this.repository.save(contract)
  }

  /**
   * 审批合同
   */
  async approve(id: string, approved: boolean, approverId: string): Promise<Contract> {
    const contract = await this.findOne(id)
    contract.status = approved ? 'approved' : 'rejected'
    contract.approvedAt = new Date()
    return this.repository.save(contract)
  }

  /**
   * 电子签名
   */
  async signContract(
    id: string,
    signatureData: ContractSignature,
  ): Promise<Contract> {
    const contract = await this.findOne(id)

    // 调用电子签名服务
    const esignResult = await this.esignService.sign(
      contract.filePath,
      signatureData,
    )

    // 更新签署信息
    if (!contract.signatures) {
      contract.signatures = []
    }
    contract.signatures.push({
      ...signatureData,
      signedAt: new Date().toISOString(),
      esignId: esignResult.signatureId,
      verified: true,
    })

    // 检查是否所有方都已签署
    const allSigned = contract.parties?.every(party =>
      contract.signatures?.some(sig => sig.party === party.type)
    )

    if (allSigned) {
      contract.status = 'signed'
      contract.signedAt = new Date()
      contract.sealedFilePath = esignResult.sealedFilePath
    } else {
      contract.status = 'signing'
    }

    return this.repository.save(contract)
  }

  /**
   * 生效合同
   */
  async activate(id: string): Promise<Contract> {
    const contract = await this.findOne(id)
    if (contract.status !== 'signed') {
      throw new Error('只有已签署的合同才能生效')
    }
    contract.status = 'effective'
    contract.effectiveAt = new Date()
    return this.repository.save(contract)
  }

  /**
   * 归档合同
   */
  async archive(id: string): Promise<Contract> {
    const contract = await this.findOne(id)
    contract.status = 'archived'
    contract.archivedAt = new Date()
    return this.repository.save(contract)
  }

  /**
   * 创建合同变更
   */
  async createChange(parentId: string, changeData: Partial<Contract>): Promise<Contract> {
    const parent = await this.findOne(parentId)
    
    const contract = this.repository.create({
      ...changeData,
      contractNo: this.generateContractNo(),
      parentContractId: parentId,
      version: parent.version + 1,
      status: 'draft',
    })

    return this.repository.save(contract)
  }

  /**
   * 获取即将到期合同
   */
  async getExpiringContracts(days: number = 30): Promise<Contract[]> {
    const remindDate = new Date()
    remindDate.setDate(remindDate.getDate() + days)

    return this.repository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'effective' })
      .andWhere('contract.endDate <= :remindDate', { remindDate })
      .andWhere('contract.endDate > NOW()')
      .orderBy('contract.endDate', 'ASC')
      .getMany()
  }

  /**
   * 合同统计
   */
  async getStats() {
    const query = this.repository.createQueryBuilder('contract')

    const total = await query.getCount()
    const byStatus = await query
      .clone()
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    const byType = await query
      .clone()
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    const totalAmount = await query
      .clone()
      .select('SUM(amount)', 'total')
      .where('status IN (:...statuses)', { statuses: ['effective', 'signed'] })
      .getRawOne()

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {}),
      byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {}),
      totalAmount: parseFloat(totalAmount.total || 0),
    }
  }
}

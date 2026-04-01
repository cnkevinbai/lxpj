/**
 * 合同模块 Service
 * 负责合同数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import {
  CreateContractDto,
  UpdateContractDto,
  ContractQueryDto,
  ContractStatus,
} from './contract.dto'

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 生成合同编号
   * 格式：CT-YYYYMMDD-XXXX
   */
  private generateContractNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `CT-${dateStr}-${random}`
  }

  /**
   * 创建合同
   */
  async create(dto: CreateContractDto, userId?: string) {
    // 检查客户是否存在
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    // 如果没有提供合同编号，自动生成
    const contractNo = dto.contractNo || this.generateContractNo()

    // 计算合同天数
    const startDate = new Date(dto.startDate)
    const endDate = new Date(dto.endDate)
    if (startDate >= endDate) {
      throw new BadRequestException('开始日期必须晚于结束日期')
    }

    const contract = await this.prisma.contract.create({
      data: {
        contractNo,
        customerId: dto.customerId,
        title: dto.title,
        amount: dto.amount,
        startDate,
        endDate,
        signDate: dto.signDate ? new Date(dto.signDate) : null,
        status: dto.status || ContractStatus.DRAFT,
        attachments: dto.attachments || [],
        remark: dto.remark,
      },
    })

    this.logger.log(`创建合同：${contractNo}`)
    return contract
  }

  /**
   * 获取合同详情
   */
  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    })
    if (!contract) {
      throw new NotFoundException('合同不存在')
    }
    return contract
  }

  /**
   * 获取合同列表
   */
  async findAll(query: ContractQueryDto) {
    const { page = 1, pageSize = 10, keyword, status, customerId, upcoming } = query
    const skip = (page - 1) * pageSize

    const where: any = {}

    // 搜索关键词
    if (keyword) {
      where.OR = [{ contractNo: { contains: keyword } }, { title: { contains: keyword } }]
    }

    // 状态过滤
    if (status) {
      where.status = status
    }

    // 客户ID过滤
    if (customerId) {
      where.customerId = customerId
    }

    // 即将到期的合同
    if (upcoming) {
      const now = new Date()
      const thirtyDaysLater = new Date()
      thirtyDaysLater.setDate(now.getDate() + 30)

      where.AND = [
        {
          OR: [{ status: ContractStatus.ACTIVE }, { status: ContractStatus.PENDING_RENEWAL }],
        },
        {
          endDate: {
            gte: now,
            lte: thirtyDaysLater,
          },
        },
      ]
    }

    const [list, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              contact: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.contract.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新合同
   */
  async update(id: string, dto: UpdateContractDto) {
    const contract = await this.findOne(id)

    // 如果更新了日期，验证日期逻辑
    if (dto.startDate || dto.endDate) {
      const startDate = new Date(dto.startDate || contract.startDate)
      const endDate = new Date(dto.endDate || contract.endDate)

      if (startDate >= endDate) {
        throw new BadRequestException('开始日期必须晚于结束日期')
      }
    }

    const updateData: any = { ...dto }

    // 处理日期类型字段
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate)
    }
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate)
    }
    if (dto.signDate) {
      updateData.signDate = new Date(dto.signDate)
    } else if (dto.signDate === null) {
      updateData.signDate = null
    }

    const updated = await this.prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    })

    this.logger.log(`更新合同：${contract.contractNo}`)
    return updated
  }

  /**
   * 删除合同
   */
  async delete(id: string) {
    const contract = await this.findOne(id)

    // 只能删除草稿状态的合同
    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的合同可以删除')
    }

    await this.prisma.contract.delete({
      where: { id },
    })

    this.logger.log(`删除合同：${contract.contractNo}`)
  }

  /**
   * 合同续约
   */
  async renew(id: string) {
    const contract = await this.findOne(id)

    // 只有 ACTIVE 或 PENDING_RENEWAL 状态的合同可以续约
    if (
      contract.status !== ContractStatus.ACTIVE &&
      contract.status !== ContractStatus.PENDING_RENEWAL
    ) {
      throw new BadRequestException('只有 ACTIVE 或 PENDING_RENEWAL 状态的合同可以续约')
    }

    // 创建续约记录（保持原合同数据，仅更新日期）
    const newEndDate = new Date(contract.endDate)
    newEndDate.setFullYear(newEndDate.getFullYear() + 1) // 续约一年

    const renewed = await this.prisma.contract.update({
      where: { id },
      data: {
        startDate: contract.endDate, // 新周期从原结束日期开始
        endDate: newEndDate,
        status: ContractStatus.ACTIVE,
      },
    })

    this.logger.log(`合同续约：${contract.contractNo}`)
    return renewed
  }

  /**
   * 合同终止
   */
  async terminate(id: string) {
    const contract = await this.findOne(id)

    // 只有 ACTIVE 或 PENDING_RENEWAL 状态的合同可以终止
    if (
      contract.status !== ContractStatus.ACTIVE &&
      contract.status !== ContractStatus.PENDING_RENEWAL
    ) {
      throw new BadRequestException('只有 ACTIVE 或 PENDING_RENEWAL 状态的合同可以终止')
    }

    const terminated = await this.prisma.contract.update({
      where: { id },
      data: {
        status: ContractStatus.TERMINATED,
      },
    })

    this.logger.log(`合同终止：${contract.contractNo}`)
    return terminated
  }

  /**
   * 获取即将到期的合同列表
   */
  async getUpcomingExpiringContracts(days: number = 30) {
    const now = new Date()
    const daysLater = new Date()
    daysLater.setDate(now.getDate() + days)

    const contracts = await this.prisma.contract.findMany({
      where: {
        AND: [
          {
            OR: [{ status: ContractStatus.ACTIVE }, { status: ContractStatus.PENDING_RENEWAL }],
          },
          {
            endDate: {
              gte: now,
              lte: daysLater,
            },
          },
        ],
      },
      orderBy: { endDate: 'asc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            contact: true,
            phone: true,
          },
        },
      },
    })

    this.logger.log(`获取即将到期合同：最近 ${days} 天`)
    return contracts
  }

  /**
   * 获取合同统计
   */
  async getStats() {
    const [total, draft, active, expired, pendingRenewal, terminated] = await Promise.all([
      this.prisma.contract.count(),
      this.prisma.contract.count({ where: { status: ContractStatus.DRAFT } }),
      this.prisma.contract.count({ where: { status: ContractStatus.ACTIVE } }),
      this.prisma.contract.count({ where: { status: ContractStatus.EXPIRED } }),
      this.prisma.contract.count({ where: { status: ContractStatus.PENDING_RENEWAL } }),
      this.prisma.contract.count({ where: { status: ContractStatus.TERMINATED } }),
    ])

    // 计算总金额
    const totalAmountResult = await this.prisma.contract.aggregate({
      _sum: { amount: true },
    })

    return {
      total,
      draft,
      active,
      expired,
      pendingRenewal,
      terminated,
      totalAmount: totalAmountResult._sum.amount || 0,
    }
  }
}

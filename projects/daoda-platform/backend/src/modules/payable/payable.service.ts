/**
 * 应付模块 Service
 * 负责应付数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreatePayableDto, UpdatePayableDto, PayableQueryDto } from './payable.dto'
import { PayableStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class PayableService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成应付单号
   * 格式：AP-YYYYMMDD-XXXX
   */
  private generatePayableNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `AP-${dateStr}-${random}`
  }

  /**
   * 比较金额（Decimal 比较）
   */
  private amountGte(amount: number | Decimal, target: number): boolean {
    if (amount instanceof Decimal) {
      return amount.gte(new Decimal(target))
    }
    return amount >= target
  }

  private amountGt(amount: number | Decimal, target: number): boolean {
    if (amount instanceof Decimal) {
      return amount.gt(new Decimal(target))
    }
    return amount > target
  }

  /**
   * 创建应付
   * @param dto 创建应付 DTO
   * @returns 创建的应付
   */
  async create(dto: CreatePayableDto) {
    // 计算付款状态
    let status: PayableStatus = PayableStatus.PENDING
    if (dto.paidAmount !== undefined && dto.paidAmount >= dto.amount) {
      status = PayableStatus.PAID
    } else if (dto.paidAmount !== undefined && dto.paidAmount > 0) {
      status = PayableStatus.APPROVED
    }

    // 生成应付单号
    const payableNo = this.generatePayableNo()

    // 构建数据对象
    const data: any = {
      payableNo,
      supplierName: dto.supplierName || '',
      amount: dto.amount,
      paidAmount: dto.paidAmount ?? 0,
      status,
      dueDate: dto.dueDate,
      remark: dto.remark,
      purchaseId: dto.purchaseId,
      supplierId: dto.supplierId,
    }

    return this.prisma.payable.create({
      data,
    })
  }

  /**
   * 根据 ID 查找应付
   * @param id 应付 ID
   * @returns 应付详情
   */
  async findOne(id: string) {
    const payable = await this.prisma.payable.findUnique({
      where: { id },
    })

    if (!payable) {
      throw new NotFoundException('应付不存在')
    }

    return payable
  }

  /**
   * 获取应付列表（分页）
   * @param query 查询参数
   * @returns 应付列表和总数
   */
  async findAll(query: PayableQueryDto) {
    const { page = 1, pageSize = 10, keyword, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（应付单号或供应商名称）
    if (keyword) {
      where.OR = [
        { payableNo: { contains: keyword } },
        { supplierName: { contains: keyword } },
        { remark: { contains: keyword } },
      ]
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.payable.count({ where })

    const list = await this.prisma.payable.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 更新应付
   * @param id 应付 ID
   * @param dto 更新 DTO
   * @returns 更新后的应付
   */
  async update(id: string, dto: UpdatePayableDto) {
    // 检查应付是否存在
    const existing = await this.prisma.payable.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('应付不存在')
    }

    // 如果更新已付金额，需要验证并自动更新状态
    if (dto.paidAmount !== undefined) {
      if (dto.paidAmount < 0) {
        throw new BadRequestException('已付金额不能为负数')
      }
      const existingAmount = existing.amount instanceof Decimal 
        ? existing.amount.toNumber() 
        : Number(existing.amount)
      if (dto.paidAmount > existingAmount) {
        throw new BadRequestException('已付金额不能大于总金额')
      }

      // 自动更新支付状态
      let status: PayableStatus = PayableStatus.PENDING
      if (dto.paidAmount >= existingAmount) {
        status = PayableStatus.PAID
      } else if (dto.paidAmount > 0) {
        status = PayableStatus.APPROVED
      }

      dto.status = status
    }

    // 构建更新数据
    const updateData: any = { ...dto }

    return this.prisma.payable.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * 更新应付状态
   * @param id 应付 ID
   * @param status 目标状态
   * @returns 更新后的应付
   */
  async updateStatus(id: string, status: PayableStatus) {
    const payable = await this.findOne(id)

    // 校验状态流转
    if (status === PayableStatus.PAID && payable.status === PayableStatus.CANCELLED) {
      throw new BadRequestException('已取消的应付不能标记为已付款')
    }
    if (status === PayableStatus.CANCELLED && payable.status === PayableStatus.PAID) {
      throw new BadRequestException('已付款的应付不能取消')
    }

    return this.prisma.payable.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * 付款
   * @param id 应付 ID
   * @param paidAmount 实际付款金额
   * @returns 更新后的应付
   */
  async pay(id: string, paidAmount?: number) {
    const payable = await this.findOne(id)

    if (payable.status === PayableStatus.PAID) {
      throw new BadRequestException('已经付款的应付不能再次付款')
    }

    const existingAmount = payable.amount instanceof Decimal 
      ? payable.amount.toNumber() 
      : Number(payable.amount)
    const amount = paidAmount || existingAmount
    const status = amount >= existingAmount
      ? PayableStatus.PAID
      : PayableStatus.APPROVED // 部分付款保持已批准状态

    return this.prisma.payable.update({
      where: { id },
      data: {
        paidAmount: amount,
        status,
      },
    })
  }

  /**
   * 标记为逾期
   * @param id 应付 ID
   * @returns 更新后的应付
   */
  async overdue(id: string) {
    // PayableStatus 没有 OVERDUE 状态，使用 PENDING 表示待处理
    return this.updateStatus(id, PayableStatus.PENDING)
  }

  /**
   * 删除应付
   * @param id 应付 ID
   */
  async delete(id: string) {
    // 检查应付是否存在
    const existing = await this.prisma.payable.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('应付不存在')
    }

    // 只能删除未付款的应付
    if (existing.status !== PayableStatus.PENDING) {
      throw new BadRequestException('只有未付款的应付可以删除')
    }

    // 删除应付
    await this.prisma.payable.delete({
      where: { id },
    })

    return { message: '应付已删除' }
  }
}
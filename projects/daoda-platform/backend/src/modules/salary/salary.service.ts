/**
 * 工资模块 Service
 * 负责工资数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateSalaryDto, UpdateSalaryDto, SalaryQueryDto } from './salary.dto'
import { SalaryStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建工资记录
   * @param dto 创建工资 DTO
   * @param userId 用户 ID
   * @returns 创建的工资记录
   */
  async create(dto: CreateSalaryDto, userId?: string) {
    // 检查员工是否存在
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    })

    if (!employee) {
      throw new NotFoundException('员工不存在')
    }

    // 验证月份格式 (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/
    if (!monthRegex.test(dto.month)) {
      throw new BadRequestException('月份格式错误，应为 YYYY-MM')
    }

    // 检查是否已存在该员工该月份的工资记录
    const existing = await this.prisma.salary.findUnique({
      where: {
        employeeId_month: {
          employeeId: dto.employeeId,
          month: dto.month,
        },
      },
    })

    if (existing) {
      throw new ConflictException('该员工该月份的工资记录已存在')
    }

    // 计算应发工资
    const total = dto.baseSalary + (dto.bonus || 0) - (dto.deduction || 0)

    // 创建工资记录
    return this.prisma.salary.create({
      data: {
        employeeId: dto.employeeId,
        month: dto.month,
        baseSalary: dto.baseSalary,
        bonus: dto.bonus || 0,
        deduction: dto.deduction || 0,
        total,
        status: SalaryStatus.PENDING,
        remark: dto.remark,
        userId,
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * 根据 ID 查找工资记录
   * @param id 工资 ID
   * @returns 工资详情
   */
  async findOne(id: string) {
    const salary = await this.prisma.salary.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!salary) {
      throw new NotFoundException('工资记录不存在')
    }

    return salary
  }

  /**
   * 获取工资列表（分页）
   * @param query 查询参数
   * @returns 工资列表和总数
   */
  async findAll(query: SalaryQueryDto) {
    const { page = 1, pageSize = 10, employeeId, month, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (month) {
      where.month = month
    }

    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.salary.count({ where })

    // 查询数据
    const list = await this.prisma.salary.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { month: 'desc' },
    })

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 更新工资记录
   * @param id 工资 ID
   * @param dto 更新 DTO
   * @returns 更新后的工资记录
   */
  async update(id: string, dto: UpdateSalaryDto) {
    // 检查工资记录是否存在
    const existing = await this.prisma.salary.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('工资记录不存在')
    }

    // 如果已发放，不能修改金额
    if (existing.status === SalaryStatus.PAID) {
      throw new BadRequestException('已发放的工资不能修改')
    }

    // 计算新的应发工资
    const baseSalary = dto.baseSalary !== undefined ? dto.baseSalary : existing.baseSalary
    const bonus = dto.bonus !== undefined ? dto.bonus : existing.bonus
    const deduction = dto.deduction !== undefined ? dto.deduction : existing.deduction
    // 使用 Decimal 处理计算
    const baseDecimal = baseSalary instanceof Decimal ? baseSalary : new Decimal(Number(baseSalary))
    const bonusDecimal = bonus instanceof Decimal ? bonus : new Decimal(Number(bonus))
    const deductionDecimal = deduction instanceof Decimal ? deduction : new Decimal(Number(deduction))
    const total = baseDecimal.plus(bonusDecimal).minus(deductionDecimal)

    // 更新工资记录
    return this.prisma.salary.update({
      where: { id },
      data: {
        baseSalary: dto.baseSalary,
        bonus: dto.bonus,
        deduction: dto.deduction,
        total,
        status: dto.status,
        paidDate: dto.paidDate,
        remark: dto.remark,
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * 发放工资
   * @param id 工资 ID
   * @param userId 用户 ID
   * @returns 更新后的工资记录
   */
  async pay(id: string, userId?: string) {
    const salary = await this.prisma.salary.findUnique({
      where: { id },
    })

    if (!salary) {
      throw new NotFoundException('工资记录不存在')
    }

    if (salary.status === SalaryStatus.PAID) {
      throw new BadRequestException('工资已发放')
    }

    if (salary.status === SalaryStatus.CANCELLED) {
      throw new BadRequestException('已取消的工资不能发放')
    }

    // 更新工资状态为已发放
    return this.prisma.salary.update({
      where: { id },
      data: {
        status: SalaryStatus.PAID,
        paidDate: new Date(),
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * 取消工资
   * @param id 工资 ID
   * @returns 更新后的工资记录
   */
  async cancel(id: string) {
    const salary = await this.prisma.salary.findUnique({
      where: { id },
    })

    if (!salary) {
      throw new NotFoundException('工资记录不存在')
    }

    if (salary.status === SalaryStatus.PAID) {
      throw new BadRequestException('已发放的工资不能取消')
    }

    return this.prisma.salary.update({
      where: { id },
      data: { status: SalaryStatus.CANCELLED },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * 删除工资记录
   * @param id 工资 ID
   */
  async delete(id: string) {
    // 检查工资记录是否存在
    const existing = await this.prisma.salary.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('工资记录不存在')
    }

    // 只能删除待发放的工资
    if (existing.status !== SalaryStatus.PENDING) {
      throw new BadRequestException('只能删除待发放的工资')
    }

    // 删除工资记录
    await this.prisma.salary.delete({
      where: { id },
    })

    return { message: '工资记录已删除' }
  }
}

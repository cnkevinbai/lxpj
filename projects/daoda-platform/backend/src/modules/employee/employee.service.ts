/**
 * 员工模块 Service
 * 负责员工数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryDto } from './employee.dto'
import { EmployeeStatus } from '@prisma/client'

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建员工
   * @param dto 创建员工 DTO
   * @returns 创建的员工
   */
  async create(dto: CreateEmployeeDto) {
    // 检查员工编号是否已存在
    const existingByNo = await this.prisma.employee.findUnique({
      where: { employeeNo: dto.employeeNo },
    })

    if (existingByNo) {
      throw new ConflictException('员工编号已存在')
    }

    // 如果提供了 userId，检查用户是否存在以及是否已是员工
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      })

      if (!user) {
        throw new NotFoundException('用户不存在')
      }

      // 检查用户是否已是员工
      const existingByUser = await this.prisma.employee.findUnique({
        where: { userId: dto.userId },
      })

      if (existingByUser) {
        throw new ConflictException('该用户已是员工')
      }
    }

    // 创建员工
    return this.prisma.employee.create({
      data: {
        userId: dto.userId,
        employeeNo: dto.employeeNo,
        name: dto.name,
        phone: dto.phone,
        department: dto.department,
        position: dto.position,
        entryDate: dto.entryDate || new Date(),
        status: EmployeeStatus.ACTIVE,
        baseSalary: dto.baseSalary,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    })
  }

  /**
   * 根据 ID 查找员工
   * @param id 员工 ID
   * @returns 员工详情
   */
  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        salaries: {
          orderBy: { month: 'desc' },
          take: 10,
        },
      },
    })

    if (!employee) {
      throw new NotFoundException('员工不存在')
    }

    return employee
  }

  /**
   * 根据用户 ID 查找员工
   * @param userId 用户 ID
   * @returns 员工详情
   */
  async findByUserId(userId: string) {
    return this.prisma.employee.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    })
  }

  /**
   * 获取员工列表（分页）
   * @param query 查询参数
   * @returns 员工列表和总数
   */
  async findAll(query: EmployeeQueryDto) {
    const { page = 1, pageSize = 10, keyword, department, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（员工编号、姓名、手机）
    if (keyword) {
      where.OR = [
        { employeeNo: { contains: keyword } },
        { name: { contains: keyword } },
        { phone: { contains: keyword } },
      ]
    }

    // 部门筛选
    if (department) {
      where.department = department
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.employee.count({ where })

    // 查询数据
    const list = await this.prisma.employee.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
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
   * 更新员工
   * @param id 员工 ID
   * @param dto 更新 DTO
   * @returns 更新后的员工
   */
  async update(id: string, dto: UpdateEmployeeDto) {
    // 检查员工是否存在
    const existing = await this.prisma.employee.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('员工不存在')
    }

    // 如果更新员工编号，检查是否已存在
    if (dto.employeeNo && dto.employeeNo !== existing.employeeNo) {
      const duplicate = await this.prisma.employee.findUnique({
        where: { employeeNo: dto.employeeNo },
      })

      if (duplicate) {
        throw new ConflictException('员工编号已存在')
      }
    }

    // 如果设置离职日期，自动更新状态
    if (dto.leaveDate && !dto.status) {
      dto.status = EmployeeStatus.RESIGNED
    }

    // 更新员工
    return this.prisma.employee.update({
      where: { id },
      data: {
        employeeNo: dto.employeeNo,
        name: dto.name,
        phone: dto.phone,
        department: dto.department,
        position: dto.position,
        leaveDate: dto.leaveDate,
        status: dto.status,
        baseSalary: dto.baseSalary,
      },
      include: {
        user: true,
      },
    })
  }

  /**
   * 离职处理
   * @param id 员工 ID
   * @returns 更新后的员工
   */
  async resign(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        status: EmployeeStatus.RESIGNED,
        leaveDate: new Date(),
      },
      include: { user: true },
    })
  }

  /**
   * 删除员工
   * @param id 员工 ID
   */
  async delete(id: string) {
    // 检查员工是否存在
    const existing = await this.prisma.employee.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('员工不存在')
    }

    // 只能删除已离职的员工
    if (existing.status === EmployeeStatus.ACTIVE || existing.status === EmployeeStatus.PROBATION) {
      throw new BadRequestException('只能删除已离职的员工')
    }

    // 删除员工（考勤和工资记录会级联删除）
    await this.prisma.employee.delete({
      where: { id },
    })

    return { message: '员工已删除' }
  }
}
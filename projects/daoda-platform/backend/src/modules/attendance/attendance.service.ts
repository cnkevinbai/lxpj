/**
 * 考勤模块 Service
 * 负责考勤数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateAttendanceDto, UpdateAttendanceDto, AttendanceQueryDto } from './attendance.dto'
import { AttendanceStatus } from '@prisma/client'

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建考勤记录
   * @param dto 创建考勤 DTO
   * @param userId 用户 ID
   * @returns 创建的考勤记录
   */
  async create(dto: CreateAttendanceDto, userId?: string) {
    // 检查员工是否存在
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    })

    if (!employee) {
      throw new NotFoundException('员工不存在')
    }

    // 格式化日期为 YYYY-MM-DD
    const dateStr = this.formatDate(dto.date)

    // 检查是否已存在该员工该日期的考勤记录
    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date: new Date(dateStr),
        },
      },
    })

    if (existing) {
      throw new ConflictException('该员工该日期的考勤记录已存在')
    }

    // 创建考勤记录
    return this.prisma.attendance.create({
      data: {
        employeeId: dto.employeeId,
        date: new Date(dateStr),
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        status: dto.status || AttendanceStatus.PRESENT,
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
   * 签到
   * @param employeeId 员工 ID
   * @param userId 用户 ID
   * @returns 考勤记录
   */
  async checkIn(employeeId: string, userId?: string) {
    // 检查员工是否存在
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee) {
      throw new NotFoundException('员工不存在')
    }

    // 获取今天日期
    const today = new Date()
    const dateStr = this.formatDate(today)
    const date = new Date(dateStr)

    // 查找或创建今天的考勤记录
    let attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
    })

    if (attendance) {
      if (attendance.checkIn) {
        throw new BadRequestException('今日已签到')
      }

      // 更新签到时间
      attendance = await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: { checkIn: new Date() },
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
    } else {
      // 创建新的考勤记录
      attendance = await this.prisma.attendance.create({
        data: {
          employeeId,
          date,
          checkIn: new Date(),
          status: AttendanceStatus.PRESENT,
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

    return attendance
  }

  /**
   * 签退
   * @param employeeId 员工 ID
   * @returns 考勤记录
   */
  async checkOut(employeeId: string) {
    // 检查员工是否存在
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee) {
      throw new NotFoundException('员工不存在')
    }

    // 获取今天日期
    const today = new Date()
    const dateStr = this.formatDate(today)
    const date = new Date(dateStr)

    // 查找今天的考勤记录
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
    })

    if (!attendance) {
      throw new BadRequestException('今日未签到，无法签退')
    }

    if (!attendance.checkIn) {
      throw new BadRequestException('今日未签到')
    }

    if (attendance.checkOut) {
      throw new BadRequestException('今日已签退')
    }

    // 更新签退时间
    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() },
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
   * 根据 ID 查找考勤记录
   * @param id 考勤 ID
   * @returns 考勤详情
   */
  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
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

    if (!attendance) {
      throw new NotFoundException('考勤记录不存在')
    }

    return attendance
  }

  /**
   * 获取考勤列表（分页）
   * @param query 查询参数
   * @returns 考勤列表和总数
   */
  async findAll(query: AttendanceQueryDto) {
    const { page = 1, pageSize = 10, employeeId, startDate, endDate, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (startDate) {
      where.date = { ...where.date, gte: new Date(this.formatDate(startDate)) }
    }

    if (endDate) {
      where.date = { ...where.date, lte: new Date(this.formatDate(endDate)) }
    }

    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.attendance.count({ where })

    // 查询数据
    const list = await this.prisma.attendance.findMany({
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
      orderBy: { date: 'desc' },
    })

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 更新考勤记录
   * @param id 考勤 ID
   * @param dto 更新 DTO
   * @returns 更新后的考勤记录
   */
  async update(id: string, dto: UpdateAttendanceDto) {
    // 检查考勤记录是否存在
    const existing = await this.prisma.attendance.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('考勤记录不存在')
    }

    // 更新考勤记录
    return this.prisma.attendance.update({
      where: { id },
      data: {
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        status: dto.status,
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
   * 删除考勤记录
   * @param id 考勤 ID
   */
  async delete(id: string) {
    // 检查考勤记录是否存在
    const existing = await this.prisma.attendance.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('考勤记录不存在')
    }

    // 删除考勤记录
    await this.prisma.attendance.delete({
      where: { id },
    })

    return { message: '考勤记录已删除' }
  }

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

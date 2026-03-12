import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { Lead } from '../lead/entities/lead.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { Dealer } from '../dealer/entities/dealer.entity'
import { AuditLogService } from '../audit-log/audit-log.service'
import * as ExcelJS from 'exceljs'

export interface ExportOptions {
  userId: string
  userName: string
  ip: string
  userAgent?: string
  startDate?: string
  endDate?: string
  desensitize?: boolean // 是否脱敏
}

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Dealer)
    private dealerRepository: Repository<Dealer>,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * 手机号脱敏：138****1234
   */
  private desensitizePhone(phone: string): string {
    if (!phone) return ''
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  /**
   * 邮箱脱敏：zhang****@example.com
   */
  private desensitizeEmail(email: string): string {
    if (!email) return ''
    const [username, domain] = email.split('@')
    if (!username || !domain) return email
    const masked = username.substring(0, 3) + '****' + username.substring(username.length - 1)
    return `${masked}@${domain}`
  }

  /**
   * 身份证脱敏：510***********1234
   */
  private desensitizeIdCard(idCard: string): string {
    if (!idCard || idCard.length < 18) return ''
    return idCard.substring(0, 3) + '***********' + idCard.substring(14)
  }

  /**
   * 姓名脱敏：张** / 张*三
   */
  private desensitizeName(name: string): string {
    if (!name) return ''
    if (name.length === 1) return name
    if (name.length === 2) return name[0] + '*'
    return name[0] + '*' + name[name.length - 1]
  }

  /**
   * 检查导出权限并记录
   */
  private async checkAndRecordExport(
    userId: string,
    userName: string,
    dataType: string,
    recordCount: number,
    ip: string,
    userAgent?: string,
  ) {
    // 检查导出限制
    const checkResult = await this.auditLogService.checkExportLimit(
      userId,
      dataType as any,
      recordCount,
    )

    if (!checkResult.allowed) {
      throw new ForbiddenException(checkResult.reason)
    }

    // 如果需要审批，创建待审批记录
    if (checkResult.requiresApproval) {
      await this.auditLogService.createExportRecord(
        userId,
        userName,
        dataType,
        recordCount,
        ip,
        userAgent,
        '需要审批的导出请求',
      )
      throw new ForbiddenException('导出请求已提交审批，请等待管理员审批')
    }

    // 记录导出操作
    await this.auditLogService.createExportRecord(
      userId,
      userName,
      dataType,
      recordCount,
      ip,
      userAgent,
    )

    // 记录审计日志
    await this.auditLogService.recordSensitiveAction(
      'EXPORT',
      dataType as any,
      userId,
      userName,
      ip,
      { recordCount, dataType },
      `导出数据：${dataType} ${recordCount}条`,
    )

    return checkResult
  }

  async exportCustomers(options: ExportOptions) {
    const { userId, userName, ip, userAgent, startDate, endDate, desensitize } = options

    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.customerRepository.find({ where, take: 10000 })

    // 检查并记录导出
    await this.checkAndRecordExport(
      userId,
      userName,
      'customer',
      data.length,
      ip,
      userAgent,
    )

    return this.createExcel([
      ['ID', '客户名称', '类型', '行业', '联系人', '电话', '邮箱', '省份', '城市', '等级', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.name,
        item.type,
        item.industry,
        desensitize ? this.desensitizeName(item.contactPerson) : item.contactPerson,
        desensitize ? this.desensitizePhone(item.contactPhone) : item.contactPhone,
        desensitize ? this.desensitizeEmail(item.contactEmail) : item.contactEmail,
        item.province,
        item.city,
        item.level,
        item.status,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '客户数据')
  }

  async exportLeads(options: ExportOptions) {
    const { userId, userName, ip, userAgent, startDate, endDate, desensitize } = options

    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.leadRepository.find({ where, take: 10000 })

    await this.checkAndRecordExport(userId, userName, 'lead', data.length, ip, userAgent)

    return this.createExcel([
      ['ID', '姓名', '手机', '邮箱', '公司', '意向产品', '预算', '来源', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        desensitize ? this.desensitizeName(item.name) : item.name,
        desensitize ? this.desensitizePhone(item.phone) : item.phone,
        desensitize ? this.desensitizeEmail(item.email) : item.email,
        item.company,
        item.productInterest,
        item.budget,
        item.source,
        item.status,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '线索数据')
  }

  async exportOpportunities(options: ExportOptions) {
    const { userId, userName, ip, userAgent, startDate, endDate, desensitize } = options

    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.opportunityRepository.find({ where, relations: ['customer'], take: 10000 })

    await this.checkAndRecordExport(userId, userName, 'opportunity', data.length, ip, userAgent)

    return this.createExcel([
      ['ID', '商机名称', '客户', '阶段', '预估金额', '成交概率', '预计成交日期', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.name,
        desensitize ? this.desensitizeName((item.customer as any)?.name) : (item.customer as any)?.name || '-',
        item.stage,
        item.estimatedAmount,
        item.probability + '%',
        item.expectedCloseDate ? new Date(item.expectedCloseDate).toLocaleDateString() : '-',
        item.actualCloseDate ? '已完成' : '进行中',
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '商机数据')
  }

  async exportOrders(options: ExportOptions) {
    const { userId, userName, ip, userAgent, startDate, endDate, desensitize } = options

    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.orderRepository.find({ where, relations: ['customer'], take: 10000 })

    await this.checkAndRecordExport(userId, userName, 'order', data.length, ip, userAgent)

    return this.createExcel([
      ['ID', '订单号', '客户', '金额', '已付金额', '订单状态', '付款状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.orderNo,
        desensitize ? this.desensitizeName((item.customer as any)?.name) : (item.customer as any)?.name || '-',
        item.totalAmount,
        item.paidAmount,
        item.status,
        item.paymentStatus,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '订单数据')
  }

  async exportDealers(options: ExportOptions) {
    const { userId, userName, ip, userAgent, startDate, endDate, desensitize } = options

    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.dealerRepository.find({ where, take: 10000 })

    await this.checkAndRecordExport(userId, userName, 'dealer', data.length, ip, userAgent)

    return this.createExcel([
      ['ID', '经销商编码', '公司名称', '联系人', '电话', '邮箱', '省份', '城市', '级别', '状态', '销售目标', '实际销售', '创建时间'],
      ...data.map(item => [
        item.id,
        item.dealerCode,
        item.companyName,
        desensitize ? this.desensitizeName(item.contactPerson) : item.contactPerson,
        desensitize ? this.desensitizePhone(item.contactPhone) : item.contactPhone,
        desensitize ? this.desensitizeEmail(item.contactEmail) : item.contactEmail,
        item.province,
        item.city,
        item.level,
        item.status,
        item.salesTarget,
        item.salesActual,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '经销商数据')
  }

  private async createExcel(data: any[][], sheetName: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'EV Cart CRM'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet(sheetName)

    // 添加表头
    worksheet.getRow(1).values = data[0]
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' },
    }
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true }

    // 添加数据
    data.slice(1).forEach((row, index) => {
      worksheet.getRow(index + 2).values = row
    })

    // 自动调整列宽
    worksheet.columns.forEach(column => {
      column.width = 15
    })

    // 生成 buffer
    return await workbook.xlsx.writeBuffer()
  }
}

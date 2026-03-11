import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { Lead } from '../lead/entities/lead.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { Dealer } from '../dealer/entities/dealer.entity'
import * as ExcelJS from 'exceljs'

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
  ) {}

  async exportCustomers(startDate?: string, endDate?: string) {
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.customerRepository.find({ where, take: 10000 })
    return this.createExcel([
      ['ID', '客户名称', '类型', '行业', '联系人', '电话', '邮箱', '省份', '城市', '等级', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.name,
        item.type,
        item.industry,
        item.contactPerson,
        item.contactPhone,
        item.contactEmail,
        item.province,
        item.city,
        item.level,
        item.status,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '客户数据')
  }

  async exportLeads(startDate?: string, endDate?: string) {
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.leadRepository.find({ where, take: 10000 })
    return this.createExcel([
      ['ID', '姓名', '手机', '邮箱', '公司', '意向产品', '预算', '来源', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.name,
        item.phone,
        item.email,
        item.company,
        item.productInterest,
        item.budget,
        item.source,
        item.status,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '线索数据')
  }

  async exportOpportunities(startDate?: string, endDate?: string) {
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.opportunityRepository.find({ where, relations: ['customer'], take: 10000 })
    return this.createExcel([
      ['ID', '商机名称', '客户', '阶段', '预估金额', '成交概率', '预计成交日期', '状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.name,
        (item.customer as any)?.name || '-',
        item.stage,
        item.estimatedAmount,
        item.probability + '%',
        item.expectedCloseDate ? new Date(item.expectedCloseDate).toLocaleDateString() : '-',
        item.actualCloseDate ? '已完成' : '进行中',
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '商机数据')
  }

  async exportOrders(startDate?: string, endDate?: string) {
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.orderRepository.find({ where, relations: ['customer'], take: 10000 })
    return this.createExcel([
      ['ID', '订单号', '客户', '金额', '已付金额', '订单状态', '付款状态', '创建时间'],
      ...data.map(item => [
        item.id,
        item.orderNo,
        (item.customer as any)?.name || '-',
        item.totalAmount,
        item.paidAmount,
        item.status,
        item.paymentStatus,
        new Date(item.createdAt).toLocaleString(),
      ]),
    ], '订单数据')
  }

  async exportDealers(startDate?: string, endDate?: string) {
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const data = await this.dealerRepository.find({ where, take: 10000 })
    return this.createExcel([
      ['ID', '经销商编码', '公司名称', '联系人', '电话', '邮箱', '省份', '城市', '级别', '状态', '销售目标', '实际销售', '创建时间'],
      ...data.map(item => [
        item.id,
        item.dealerCode,
        item.companyName,
        item.contactPerson,
        item.contactPhone,
        item.contactEmail,
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

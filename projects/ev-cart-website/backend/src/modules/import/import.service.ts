import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import * as xlsx from 'xlsx'

/**
 * 数据导入服务
 * 支持 Excel/CSV 导入
 */
@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  /**
   * 解析 Excel 文件
   */
  async parseExcel(buffer: Buffer): Promise<any[]> {
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)
    return data
  }

  /**
   * 导入线索
   */
  async importLeads(data: any[], businessType: string, ownerId: string) {
    const leads = data.map(row => ({
      name: row['姓名'] || row['Name'],
      phone: row['手机'] || row['Phone'],
      email: row['邮箱'] || row['Email'],
      company: row['公司'] || row['Company'],
      productInterest: row['意向产品'] || row['Product'],
      source: row['来源'] || 'import',
      businessType,
      ownerId,
    }))

    return this.leadRepository.save(leads)
  }

  /**
   * 导入客户
   */
  async importCustomers(data: any[], businessType: string, ownerId: string) {
    const customers = data.map(row => ({
      name: row['客户名称'] || row['Name'],
      companyName: row['公司名称'] || row['Company'],
      country: row['国家'] || row['Country'],
      contactPerson: row['联系人'] || row['Contact'],
      contactPhone: row['电话'] || row['Phone'],
      contactEmail: row['邮箱'] || row['Email'],
      businessType,
      ownerId,
    }))

    return this.customerRepository.save(customers)
  }

  /**
   * 验证数据
   */
  validateData(data: any[], type: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    data.forEach((row, index) => {
      if (type === 'leads') {
        if (!row['姓名'] && !row['Name']) {
          errors.push(`第${index + 1}行：缺少姓名`)
        }
        if (!row['手机'] && !row['Phone']) {
          errors.push(`第${index + 1}行：缺少手机号`)
        }
      } else if (type === 'customers') {
        if (!row['客户名称'] && !row['Name']) {
          errors.push(`第${index + 1}行：缺少客户名称`)
        }
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * 生成导入模板
   */
  generateTemplate(type: string): Buffer {
    const data = type === 'leads'
      ? [['姓名', '手机', '邮箱', '公司', '意向产品', '来源']]
      : [['客户名称', '公司名称', '国家', '联系人', '电话', '邮箱']]

    const worksheet = xlsx.utils.aoa_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Template')

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }
}

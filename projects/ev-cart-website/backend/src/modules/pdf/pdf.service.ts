import { Injectable } from '@nestjs/common'
import * as PDFDocument from 'pdfkit'
import * as moment from 'moment'

/**
 * PDF 生成服务
 */
@Injectable()
export class PdfService {
  /**
   * 生成销售报表 PDF
   */
  async generateSalesReport(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      // 标题
      doc.fontSize(20).text('销售报表', { align: 'center' })
      doc.moveDown()

      // 日期范围
      doc.fontSize(12).text(`日期范围：${data.startDate} - ${data.endDate}`)
      doc.moveDown()

      // 统计信息
      doc.fontSize(14).text('统计信息', { underline: true })
      doc.moveDown()
      doc.fontSize(12).text(`总订单数：${data.totalOrders}`)
      doc.text(`总金额：¥${data.totalAmount.toLocaleString()}`)
      doc.moveDown()

      // 按月统计
      doc.fontSize(14).text('按月统计', { underline: true })
      doc.moveDown()

      Object.entries(data.byMonth).forEach(([month, stats]: [string, any]) => {
        doc.text(`${month}: ${stats.count} 订单，¥${stats.amount.toLocaleString()}`)
      })

      // 页脚
      doc.fontSize(10).text(`生成时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`, {
        align: 'right',
      })

      doc.end()
    })
  }

  /**
   * 生成客户报表 PDF
   */
  async generateCustomerReport(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      // 标题
      doc.fontSize(20).text('客户报表', { align: 'center' })
      doc.moveDown()

      // 统计信息
      doc.fontSize(14).text('统计信息', { underline: true })
      doc.moveDown()
      doc.fontSize(12).text(`总客户数：${data.totalCustomers}`)
      doc.moveDown()

      // 按等级统计
      doc.fontSize(14).text('按等级统计', { underline: true })
      doc.moveDown()
      Object.entries(data.byLevel).forEach(([level, count]: [string, any]) => {
        doc.text(`${level}级：${count} 个客户`)
      })

      // 页脚
      doc.fontSize(10).text(`生成时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`, {
        align: 'right',
      })

      doc.end()
    })
  }

  /**
   * 生成线索报表 PDF
   */
  async generateLeadReport(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      // 标题
      doc.fontSize(20).text('线索报表', { align: 'center' })
      doc.moveDown()

      // 统计信息
      doc.fontSize(14).text('统计信息', { underline: true })
      doc.moveDown()
      doc.fontSize(12).text(`总线索数：${data.totalLeads}`)
      doc.text(`转化率：${data.conversionRate}%`)
      doc.moveDown()

      // 按来源统计
      doc.fontSize(14).text('按来源统计', { underline: true })
      doc.moveDown()
      Object.entries(data.bySource).forEach(([source, count]: [string, any]) => {
        doc.text(`${source}: ${count} 条`)
      })

      // 页脚
      doc.fontSize(10).text(`生成时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`, {
        align: 'right',
      })

      doc.end()
    })
  }
}

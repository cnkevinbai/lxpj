/**
 * 移动端服务 - 精简数据/批量操作/文件上传
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as QRCode from 'qrcode'

@Injectable()
export class MobileService {
  constructor(
    @InjectRepository('customers')
    private customerRepository: Repository<any>,
  ) {}

  /**
   * 精简字段查询
   */
  async findWithFields(entity: string, id: string, fields: string[]) {
    const data = await this.customerRepository.findOne({ where: { id } })
    
    if (!data) return null

    // 只返回指定字段
    const result: any = {}
    fields.forEach(field => {
      if (data[field] !== undefined) {
        result[field] = data[field]
      }
    })

    return result
  }

  /**
   * 批量创建
   */
  async batchCreate(entity: string, items: any[]) {
    return this.customerRepository.save(items)
  }

  /**
   * 批量更新
   */
  async batchUpdate(entity: string, items: Array<{ id: string; [key: string]: any }>) {
    const results = await Promise.all(
      items.map(item => this.customerRepository.update(item.id, item))
    )
    return { affected: results.reduce((sum, r) => sum + (r.affected || 0), 0) }
  }

  /**
   * 批量删除
   */
  async batchDelete(entity: string, ids: string[]) {
    return this.customerRepository.delete(ids)
  }

  /**
   * 生成二维码
   */
  async generateQRCode(data: string): Promise<string> {
    return await QRCode.toDataURL(data)
  }

  /**
   * 解析二维码
   */
  parseQRCode(qrCode: string): any {
    try {
      // TODO: 使用 qrcode-reader 解析
      return JSON.parse(qrCode)
    } catch (error) {
      return null
    }
  }

  /**
   * 游标分页
   */
  async findWithCursor(
    entity: string,
    limit: number,
    cursor?: string,
    filters?: any
  ) {
    const query = this.customerRepository.createQueryBuilder('entity')
    
    if (cursor) {
      const lastItem = JSON.parse(Buffer.from(cursor, 'base64').toString())
      query.andWhere('entity.id > :id', { id: lastItem.id })
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.andWhere(`entity.${key} = :${key}`, { [key]: value })
      })
    }

    const data = await query.take(limit + 1).getMany()
    const hasMore = data.length > limit

    if (hasMore) {
      data.pop()
    }

    const lastItem = data[data.length - 1]
    const nextCursor = lastItem
      ? Buffer.from(JSON.stringify({ id: lastItem.id })).toString('base64')
      : null

    return {
      data,
      nextCursor,
      hasMore
    }
  }
}

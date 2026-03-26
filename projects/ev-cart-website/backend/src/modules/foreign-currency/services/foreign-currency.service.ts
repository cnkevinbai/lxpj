import { Injectable } from '@nestjs/common'

/**
 * ForeignCurrency 服务
 */
@Injectable()
export class ForeignCurrencyService {
  async findAll() { return [] }
  async findOne(id: string) { return { id } }
  async create(data: any) { return data }
  async update(id: string, data: any) { return { id, ...data } }
  async remove(id: string) { return { deleted: true } }
}

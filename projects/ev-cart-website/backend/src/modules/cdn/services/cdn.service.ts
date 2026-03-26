import { Injectable } from '@nestjs/common'

/**
 * Cdn 服务
 */
@Injectable()
export class CdnService {
  async findAll() { return [] }
  async findOne(id: string) { return { id } }
  async create(data: any) { return data }
  async update(id: string, data: any) { return { id, ...data } }
  async remove(id: string) { return { deleted: true } }
}

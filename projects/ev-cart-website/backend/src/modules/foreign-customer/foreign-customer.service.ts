import { Injectable } from '@nestjs/common'

@Injectable()
export class ForeignCustomerService {
  async findAll() { return [] }
  async findOne(id: string) { return { id } }
  async create(data: any) { return data }
}

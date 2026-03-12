import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PurchaseOrder } from './entities/purchase-order.entity'

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
  ) {}

  async getPurchaseOrders(params: any) {
    const { page = 1, limit = 20, status } = params
    const query = this.poRepo.createQueryBuilder('po')
    if (status) query.andWhere('po.status = :status', { status })
    query.orderBy('po.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async getStatistics() {
    const total = await this.poRepo.count()
    const pending = await this.poRepo.count({ where: { status: 'pending' } })
    return { total, pending }
  }
}

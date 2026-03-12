import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductionOrder } from './entities/production-order.entity'

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(ProductionOrder)
    private moRepo: Repository<ProductionOrder>,
  ) {}

  async getProductionOrders(params: any) {
    const { page = 1, limit = 20, status } = params
    const query = this.moRepo.createQueryBuilder('mo')
    if (status) query.andWhere('mo.status = :status', { status })
    query.orderBy('mo.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async getStatistics() {
    const total = await this.moRepo.count()
    const pending = await this.moRepo.count({ where: { status: 'pending' } })
    return { total, pending }
  }
}

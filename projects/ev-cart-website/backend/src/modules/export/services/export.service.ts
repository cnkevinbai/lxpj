import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExportOrder } from './entities/export-order.entity'

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(ExportOrder)
    private exportRepo: Repository<ExportOrder>,
  ) {}

  async getExportOrders(params: any) {
    const { page = 1, limit = 20, status, country } = params
    const query = this.exportRepo.createQueryBuilder('export')
    if (status) query.andWhere('export.status = :status', { status })
    if (country) query.andWhere('export.country = :country', { country })
    query.orderBy('export.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async getStatistics() {
    const total = await this.exportRepo.count()
    const byCountry = await this.exportRepo
      .createQueryBuilder('export')
      .select('export.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('export.country')
      .getRawMany()
    return { total, byCountry }
  }
}

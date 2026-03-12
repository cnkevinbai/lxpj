import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceRequest } from './entities/service-request.entity'

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRequest)
    private requestRepo: Repository<ServiceRequest>,
  ) {}

  async getServiceRequests(params: any) {
    const { page = 1, limit = 20, status, priority } = params
    const query = this.requestRepo.createQueryBuilder('request')
    if (status) query.andWhere('request.status = :status', { status })
    if (priority) query.andWhere('request.priority = :priority', { priority })
    query.orderBy('request.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async createRequest(data: any) {
    const requestCode = `SR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const request = this.requestRepo.create({ ...data, requestCode })
    return this.requestRepo.save(request)
  }

  async getStatistics() {
    const total = await this.requestRepo.count()
    const pending = await this.requestRepo.count({ where: { status: 'pending' } })
    const processing = await this.requestRepo.count({ where: { status: 'processing' } })
    const resolved = await this.requestRepo.count({ where: { status: 'resolved' } })
    return { total, pending, processing, resolved }
  }
}

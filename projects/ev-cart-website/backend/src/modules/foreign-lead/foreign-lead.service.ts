import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ForeignLead } from './entities/foreign-lead.entity'
import { CreateForeignLeadDto, UpdateForeignLeadDto } from './dto/foreign-lead.dto'

@Injectable()
export class ForeignLeadService {
  constructor(
    @InjectRepository(ForeignLead)
    private repository: Repository<ForeignLead>,
  ) {}

  async create(createDto: CreateForeignLeadDto) {
    const lead = this.repository.create({
      ...createDto,
      businessType: 'foreign',
    })
    return this.repository.save(lead)
  }

  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const query = this.repository.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.owner', 'owner')
      .where('lead.businessType = :businessType', { businessType: 'foreign' })

    if (filters?.country) {
      query.andWhere('lead.country = :country', { country: filters.country })
    }
    if (filters?.status) {
      query.andWhere('lead.status = :status', { status: filters.status })
    }
    if (filters?.source) {
      query.andWhere('lead.source = :source', { source: filters.source })
    }

    query.orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  async findOne(id: string) {
    const lead = await this.repository.findOne({
      where: { id },
      relations: ['owner'],
    })
    if (!lead) {
      throw new NotFoundException('Foreign lead not found')
    }
    return lead
  }

  async update(id: string, updateDto: UpdateForeignLeadDto) {
    const lead = await this.findOne(id)
    Object.assign(lead, updateDto)
    return this.repository.save(lead)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async getStats(startDate: string, endDate: string) {
    const total = await this.repository.count({
      where: {
        businessType: 'foreign',
        createdAt: Between(startDate, endDate),
      },
    })

    const byCountry = await this.repository
      .createQueryBuilder('lead')
      .select('lead.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where('lead.businessType = :businessType', { businessType: 'foreign' })
      .groupBy('lead.country')
      .orderBy('count', 'DESC')
      .getRawMany()

    const bySource = await this.repository
      .createQueryBuilder('lead')
      .select('lead.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .where('lead.businessType = :businessType', { businessType: 'foreign' })
      .groupBy('lead.source')
      .getRawMany()

    return {
      total,
      byCountry,
      bySource,
      startDate,
      endDate,
    }
  }
}

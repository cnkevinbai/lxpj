import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Lead } from './entities/lead.entity'
import { CreateLeadDto, UpdateLeadDto, ConvertLeadDto } from './dto/lead.dto'

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private repository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.repository.create(createLeadDto)
    return this.repository.save(lead)
  }

  async findAll(page: number = 1, limit: number = 20, status?: string) {
    const query = this.repository.createQueryBuilder('lead')
    if (status) {
      query.where('lead.status = :status', { status })
    }
    query.orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.repository.findOne({ where: { id } })
    if (!lead) {
      throw new NotFoundException('Lead not found')
    }
    return lead
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id)
    Object.assign(lead, updateLeadDto)
    return this.repository.save(lead)
  }

  async assign(id: string, ownerId: string): Promise<Lead> {
    const lead = await this.findOne(id)
    lead.owner = { id: ownerId } as any
    return this.repository.save(lead)
  }

  async convert(id: string, convertLeadDto: ConvertLeadDto): Promise<any> {
    const lead = await this.findOne(id)
    lead.status = 'converted'
    lead.convertedCustomerId = convertLeadDto.customerId
    await this.repository.save(lead)
    return { success: true, leadId: id, customerId: convertLeadDto.customerId }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByStatus(status: string): Promise<Lead[]> {
    return this.repository.find({ where: { status } })
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Opportunity } from './entities/opportunity.entity'
import { CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunity.dto'

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private repository: Repository<Opportunity>,
  ) {}

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    const opportunity = this.repository.create(createOpportunityDto)
    return this.repository.save(opportunity)
  }

  async findAll(page: number = 1, limit: number = 20, stage?: string) {
    const query = this.repository.createQueryBuilder('opportunity')
      .leftJoinAndSelect('opportunity.customer', 'customer')
    if (stage) {
      query.where('opportunity.stage = :stage', { stage })
    }
    query.orderBy('opportunity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.repository.findOne({ 
      where: { id },
      relations: ['customer']
    })
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found')
    }
    return opportunity
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(id)
    Object.assign(opportunity, updateOpportunityDto)
    return this.repository.save(opportunity)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByStage(stage: string): Promise<Opportunity[]> {
    return this.repository.find({ 
      where: { stage },
      relations: ['customer']
    })
  }

  async getFunnelData() {
    const stages = ['discovery', 'needs', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
    const funnel = await Promise.all(
      stages.map(async (stage) => {
        const count = await this.repository.count({ where: { stage } })
        const total = await this.repository
          .createQueryBuilder('opportunity')
          .where('stage = :stage', { stage })
          .select('SUM(estimated_amount)', 'total')
          .getRawOne()
        return { stage, count, total: total?.total || 0 }
      })
    )
    return funnel
  }
}

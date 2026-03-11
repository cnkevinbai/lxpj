import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Dealer } from './entities/dealer.entity'
import { CreateDealerDto, UpdateDealerDto } from './dto/dealer.dto'

@Injectable()
export class DealerService {
  constructor(
    @InjectRepository(Dealer)
    private repository: Repository<Dealer>,
  ) {}

  async create(createDealerDto: CreateDealerDto): Promise<Dealer> {
    const dealerCode = `DLR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const dealer = this.repository.create({
      ...createDealerDto,
      dealerCode,
    })
    return this.repository.save(dealer)
  }

  async findAll(page: number = 1, limit: number = 20, province?: string, status?: string) {
    const query = this.repository.createQueryBuilder('dealer')
    if (province) {
      query.where('dealer.province = :province', { province })
    }
    if (status) {
      query.andWhere('dealer.status = :status', { status })
    }
    query.orderBy('dealer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Dealer> {
    const dealer = await this.repository.findOne({ where: { id } })
    if (!dealer) {
      throw new NotFoundException('Dealer not found')
    }
    return dealer
  }

  async update(id: string, updateDealerDto: UpdateDealerDto): Promise<Dealer> {
    const dealer = await this.findOne(id)
    Object.assign(dealer, updateDealerDto)
    return this.repository.save(dealer)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByProvince(province: string): Promise<Dealer[]> {
    return this.repository.find({ where: { province } })
  }

  async getStatistics() {
    const total = await this.repository.count()
    const active = await this.repository.count({ where: { status: 'active' } })
    const standard = await this.repository.count({ where: { level: 'standard' } })
    const gold = await this.repository.count({ where: { level: 'gold' } })
    const platinum = await this.repository.count({ where: { level: 'platinum' } })
    const target = await this.repository
      .createQueryBuilder('dealer')
      .select('SUM(salesTarget)', 'total')
      .getRawOne()
    const actual = await this.repository
      .createQueryBuilder('dealer')
      .select('SUM(salesActual)', 'total')
      .getRawOne()
    return {
      total,
      active,
      levels: { standard, gold, platinum },
      sales: {
        target: target?.total || 0,
        actual: actual?.total || 0,
      },
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RecycleBin, EntityType } from './entities/recycle-bin.entity'

interface CreateRecycleDto {
  entityType: EntityType
  originalId: string
  data: Record<string, any>
  deletedBy: string
  deletedByName: string
  ip: string
}

@Injectable()
export class RecycleBinService {
  constructor(
    @InjectRepository(RecycleBin)
    private repository: Repository<RecycleBin>,
  ) {}

  async create(data: CreateRecycleDto): Promise<RecycleBin> {
    const recycleBin = this.repository.create(data)
    return this.repository.save(recycleBin)
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    entityType?: string,
  ) {
    const query = this.repository.createQueryBuilder('rb')
      .where('rb.isRestored = :isRestored', { isRestored: false })
      .orderBy('rb.deletedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (entityType) {
      query.andWhere('rb.entityType = :entityType', { entityType })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async restore(id: string): Promise<RecycleBin> {
    const item = await this.repository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException('回收站记录不存在')
    }

    item.isRestored = true
    item.restoredAt = new Date()
    return this.repository.save(item)
  }

  async deletePermanently(id: string): Promise<void> {
    const item = await this.repository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException('回收站记录不存在')
    }

    item.permanentlyDeletedAt = new Date()
    item.isRestored = true
    await this.repository.save(item)
    await this.repository.delete(id)
  }

  async restoreBatch(ids: string[]): Promise<number> {
    await this.repository
      .createQueryBuilder()
      .update(RecycleBin)
      .set({ isRestored: true, restoredAt: new Date() })
      .where('id IN (:...ids)', { ids })
      .execute()

    return ids.length
  }
}

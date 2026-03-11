import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Setting } from './entities/setting.entity'
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto'

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private repository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.repository.create(createSettingDto)
    return this.repository.save(setting)
  }

  async findAll() {
    return this.repository.find({ order: { key: 'ASC' } })
  }

  async findOne(key: string): Promise<Setting> {
    const setting = await this.repository.findOne({ where: { key } })
    if (!setting) {
      throw new NotFoundException('Setting not found')
    }
    return setting
  }

  async update(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(key)
    Object.assign(setting, updateSettingDto)
    return this.repository.save(setting)
  }

  async remove(key: string): Promise<void> {
    const setting = await this.findOne(key)
    await this.repository.delete(setting.id)
  }

  async getByKeys(keys: string[]) {
    const settings = await this.repository.findBy(keys)
    const result: Record<string, any> = {}
    settings.forEach(s => {
      result[s.key] = s.type === 'json' ? JSON.parse(s.value) : s.value
    })
    return result
  }
}

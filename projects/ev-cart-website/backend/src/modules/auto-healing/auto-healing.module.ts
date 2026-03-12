/**
 * 自动排障模块 - 自我修复系统
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealingRecord } from './entities/healing-record.entity'
import { AutoHealingService } from './auto-healing.service'
import { AutoHealingController } from './auto-healing.controller'

@Module({
  imports: [TypeOrmModule.forFeature([HealingRecord])],
  providers: [AutoHealingService],
  controllers: [AutoHealingController],
  exports: [AutoHealingService],
})
export class AutoHealingModule {}

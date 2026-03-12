/**
 * 自动排障控制器
 * 渔晓白 ⚙️ · 专业交付
 */

import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AutoHealingService } from './auto-healing.service'

@Controller('auto-healing')
@UseGuards(JwtAuthGuard)
export class AutoHealingController {
  constructor(private readonly healingService: AutoHealingService) {}

  @Get('records')
  async getRecords() {
    return this.healingService.getRecords()
  }

  @Get('stats')
  async getStats() {
    return this.healingService.getStats()
  }
}

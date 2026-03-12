import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CrmPoolService } from './crm-pool.service'

@ApiTags('crm-pool')
@Controller('crm-pool')
@UseGuards(JwtAuthGuard)
export class CrmPoolController {
  constructor(private readonly poolService: CrmPoolService) {}

  @Get()
  @ApiOperation({ summary: '获取公海池客户列表' })
  async getPoolCustomers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('source') source?: string,
    @Query('level') level?: string,
  ) {
    return this.poolService.getPoolCustomers(page, limit, { source, level })
  }

  @Post('claim')
  @ApiOperation({ summary: '领取公海客户' })
  async claimCustomer(
    @Body() dto: { customerId: string; reason?: string },
    @Request() req: any,
  ) {
    return this.poolService.claimCustomer(dto.customerId, req.user.id, req.user.name, dto.reason)
  }

  @Post('return')
  @ApiOperation({ summary: '退回客户到公海' })
  async returnCustomer(
    @Body() dto: { customerId: string; reason: string },
    @Request() req: any,
  ) {
    return this.poolService.returnCustomer(dto.customerId, req.user.id, req.user.name, dto.reason)
  }

  @Get('rules')
  @ApiOperation({ summary: '获取公海池规则' })
  async getPoolRules() {
    return this.poolService.getPoolRules()
  }

  @Post('rules')
  @ApiOperation({ summary: '创建公海池规则' })
  async createPoolRule(@Body() dto: any) {
    return this.poolService.createPoolRule(dto)
  }

  @Put('rules/:id')
  @ApiOperation({ summary: '更新公海池规则' })
  async updatePoolRule(@Param('id') id: string, @Body() dto: any) {
    return this.poolService.updatePoolRule(id, dto)
  }

  @Get('stats')
  @ApiOperation({ summary: '获取公海池统计' })
  async getPoolStats() {
    return this.poolService.getPoolStats()
  }
}

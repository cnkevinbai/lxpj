import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DealerRebateService } from '../services/dealer-rebate.service'
import { CreateDealerRebateDto, UpdateDealerRebateDto, CalculateRebateDto, PayRebateDto } from '../dto/dealer-rebate.dto'

@ApiTags('经销商返利')
@ApiBearerAuth()
@Controller('dealer-rebates')
export class DealerRebateController {
  constructor(private readonly rebateService: DealerRebateService) {}

  @Post()
  @ApiOperation({ summary: '创建返利记录' })
  create(@Body() dto: CreateDealerRebateDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.rebateService.create(dto, userId, userName)
  }

  @Get()
  @ApiOperation({ summary: '获取返利列表' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('dealerId') dealerId?: string,
    @Query('period') period?: string,
    @Query('rebateType') rebateType?: string,
    @Query('status') status?: string,
  ) {
    return this.rebateService.findAll({ page, limit, dealerId, period, rebateType, status })
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取返利统计' })
  getStatistics(@Query('period') period?: string, @Query('rebateType') rebateType?: string) {
    return this.rebateService.getStatistics(period, rebateType)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取返利详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rebateService.findOne(id)
  }

  @Get('dealer/:dealerId')
  @ApiOperation({ summary: '获取经销商返利历史' })
  findByDealer(
    @Param('dealerId', ParseUUIDPipe) dealerId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.rebateService.findByDealer(dealerId, limit)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新返利' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDealerRebateDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.rebateService.update(id, dto, userId, userName)
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '审批返利' })
  approve(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.rebateService.approve(id, userId, userName)
  }

  @Post(':id/pay')
  @ApiOperation({ summary: '发放返利' })
  pay(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PayRebateDto) {
    return this.rebateService.pay(id, dto.paymentMethod, dto.paymentRef)
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消返利' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Body('reason') reason: string) {
    return this.rebateService.cancel(id, reason)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除返利' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rebateService.remove(id)
  }

  @Post('calculate')
  @ApiOperation({ summary: '自动计算返利' })
  calculate(@Body() dto: CalculateRebateDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.rebateService.calculate(dto, userId, userName)
  }
}

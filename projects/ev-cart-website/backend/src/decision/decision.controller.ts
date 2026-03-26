import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DecisionService } from './decision.service';

@ApiTags('智能决策')
@Controller('service/decisions')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post('recommend')
  @ApiOperation({ summary: '推荐服务方式' })
  @ApiResponse({ status: 200, description: '推荐成功' })
  async recommend(@Body() ticketData: any) {
    return this.decisionService.recommendServiceType(ticketData);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取决策统计' })
  @ApiResponse({ status: 200, description: '统计获取成功' })
  async getStatistics(@Query() params: any) {
    return this.decisionService.getStatistics(params);
  }
}

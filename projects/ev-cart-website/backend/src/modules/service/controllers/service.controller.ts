import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ServiceService } from '../services/service.service'

@ApiTags('售后服务')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('requests')
  @ApiOperation({ summary: '获取服务请求列表' })
  getServiceRequests(@Query() params: any) {
    return this.serviceService.getServiceRequests(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取服务统计' })
  getStatistics() {
    return this.serviceService.getStatistics()
  }

  @Post('requests')
  @ApiOperation({ summary: '创建服务请求' })
  createRequest(@Body() data: any) {
    return this.serviceService.createRequest(data)
  }
}

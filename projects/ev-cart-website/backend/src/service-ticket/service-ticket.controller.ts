import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceTicketService, CreateServiceTicketDto, ReceiveTicketDto, AssessTicketDto, DecideServiceTypeDto } from './service-ticket.service';

@ApiTags('服务工单')
@ApiBearerAuth()
@Controller('service/tickets')
export class ServiceTicketController {
  constructor(private readonly service: ServiceTicketService) {}

  @Post()
  @ApiOperation({ summary: '创建工单' })
  @ApiResponse({ status: 201, description: '工单创建成功' })
  create(@Body() data: CreateServiceTicketDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: '获取工单列表' })
  @ApiResponse({ status: 200, description: '工单列表获取成功' })
  findAll(@Query() params: any) {
    return this.service.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取工单详情' })
  @ApiResponse({ status: 200, description: '工单详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/receive')
  @ApiOperation({ summary: '客服接待' })
  @ApiResponse({ status: 200, description: '接待成功' })
  @UseGuards() // TODO: 添加 JWT Guard
  receive(@Param('id') id: string, @Body() data: ReceiveTicketDto, @Request() req: any) {
    // TODO: 从 req.user 获取 userId
    return this.service.receive(id, 'user-id', data);
  }

  @Post(':id/assess')
  @ApiOperation({ summary: '主管评估' })
  @ApiResponse({ status: 200, description: '评估成功' })
  @UseGuards()
  assess(@Param('id') id: string, @Body() data: AssessTicketDto, @Request() req: any) {
    return this.service.assess(id, 'user-id', data);
  }

  @Post(':id/decide')
  @ApiOperation({ summary: '决策服务方式' })
  @ApiResponse({ status: 200, description: '决策成功' })
  @UseGuards()
  decideServiceType(@Param('id') id: string, @Body() data: DecideServiceTypeDto, @Request() req: any) {
    return this.service.decideServiceType(id, 'user-id', data);
  }

  @Post(':id/assign-engineer')
  @ApiOperation({ summary: '指派工程师' })
  @ApiResponse({ status: 200, description: '指派成功' })
  @UseGuards()
  assignEngineer(
    @Param('id') id: string,
    @Body() data: { assigneeId: string; scheduledTime: Date },
    @Request() req: any,
  ) {
    return this.service.assignEngineer(id, 'user-id', data.assigneeId, data.scheduledTime);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: '完成工单' })
  @ApiResponse({ status: 200, description: '完成成功' })
  @UseGuards()
  complete(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.service.complete(id, 'user-id', data);
  }

  @Post(':id/close')
  @ApiOperation({ summary: '关闭工单' })
  @ApiResponse({ status: 200, description: '关闭成功' })
  @UseGuards()
  close(@Param('id') id: string, @Body() data: { reason?: string }, @Request() req: any) {
    return this.service.close(id, 'user-id', data.reason);
  }
}

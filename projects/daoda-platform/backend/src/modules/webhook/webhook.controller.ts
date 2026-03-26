import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { WebhookService } from './webhook.service'
import { CreateWebhookDto, UpdateWebhookDto } from './webhook.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Webhook 管理')
@Controller('webhooks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '创建 Webhook' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateWebhookDto, @Request() req: any) {
    return this.webhookService.create(dto, req.user?.tenantId)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取 Webhook 列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Request() req: any) {
    return this.webhookService.findAll(req.user?.tenantId)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取 Webhook 详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.webhookService.findOne(id, req.user?.tenantId)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '更新 Webhook' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateWebhookDto, @Request() req: any) {
    return this.webhookService.update(id, req.user?.tenantId, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除 Webhook' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.webhookService.delete(id, req.user?.tenantId)
    return { message: '删除成功' }
  }

  @Post(':id/test')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '测试 Webhook' })
  @ApiResponse({ status: 200, description: '测试完成' })
  async test(@Param('id') id: string, @Request() req: any) {
    const result = await this.webhookService.test(id, req.user?.tenantId)
    return result
  }

  @Get(':id/logs')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取 Webhook 日志' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getLogs(@Param('id') id: string, @Request() req: any) {
    return this.webhookService.getLogs(id, req.user?.tenantId)
  }
}

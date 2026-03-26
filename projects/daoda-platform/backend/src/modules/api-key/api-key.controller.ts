/**
 * API Key 控制器
 */
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
  Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { ApiKeyService } from './api-key.service'
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyQueryDto } from './api-key.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Request } from 'express'

@ApiTags('API Key')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @ApiOperation({ summary: '获取 API Key 列表' })
  async findAll(@Query() query: ApiKeyQueryDto, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.findAll(tenantId, query)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取 API Key 详情' })
  @ApiResponse({ status: 200, description: '返回 API Key 详情' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.findOne(id, tenantId)
  }

  @Post()
  @ApiOperation({ summary: '创建 API Key' })
  @ApiResponse({ status: 201, description: 'API Key 创建成功' })
  async create(@Body() dto: CreateApiKeyDto, @Req() req: Request) {
    const tenantId = req.tenantId as string
    // 注意：实际密钥在服务端生成，不会返回给客户端
    // 客户端需要在创建后立即保存返回的完整密钥（包含 key 字段）
    const result = await this.apiKeyService.create(dto, tenantId)
    return result
  }

  @Put(':id')
  @ApiOperation({ summary: '更新 API Key' })
  @ApiResponse({ status: 200, description: 'API Key 更新成功' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateApiKeyDto,
    @Req() req: Request,
  ) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.update(id, dto, tenantId)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除 API Key' })
  @ApiResponse({ status: 200, description: 'API Key 已删除' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.delete(id, tenantId)
  }

  @Put(':id/regenerate')
  @ApiOperation({ summary: '重新生成 API Key' })
  @ApiResponse({ status: 200, description: 'API Key 已重新生成' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async regenerate(@Param('id') id: string, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.regenerate(id, tenantId)
  }

  @Put(':id/disable')
  @ApiOperation({ summary: '禁用 API Key' })
  @ApiResponse({ status: 200, description: 'API Key 已禁用' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async disable(@Param('id') id: string, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.disable(id, tenantId)
  }

  @Put(':id/enable')
  @ApiOperation({ summary: '启用 API Key' })
  @ApiResponse({ status: 200, description: 'API Key 已启用' })
  @ApiResponse({ status: 404, description: 'API Key 不存在' })
  async enable(@Param('id') id: string, @Req() req: Request) {
    const tenantId = req.tenantId as string
    return this.apiKeyService.enable(id, tenantId)
  }
}

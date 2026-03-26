/**
 * 应收模块 Controller
 * 提供应收管理的 RESTful API 接口
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ReceivableService } from './receivable.service'
import { CreateReceivableDto, UpdateReceivableDto, ReceivableQueryDto } from './receivable.dto'
import { ReceivableStatus } from '@prisma/client'

@ApiTags('应收管理')
@Controller('receivables')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceivableController {
  constructor(private readonly receivableService: ReceivableService) {}

  /**
   * 创建应收
   */
  @Post()
  @ApiOperation({ summary: '创建应收' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreateReceivableDto) {
    return this.receivableService.create(dto)
  }

  /**
   * 获取应收列表
   */
  @Get()
  @ApiOperation({ summary: '获取应收列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: ReceivableQueryDto) {
    return this.receivableService.findAll(query)
  }

  /**
   * 根据 ID 获取应收详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取应收详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  findOne(@Param('id') id: string) {
    return this.receivableService.findOne(id)
  }

  /**
   * 更新应收
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新应收' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateReceivableDto) {
    return this.receivableService.update(id, dto)
  }

  /**
   * 收款
   */
  @Post(':id/receive')
  @ApiOperation({ summary: '收款' })
  @ApiResponse({ status: 200, description: '收款成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  @ApiResponse({ status: 400, description: '业务逻辑错误' })
  receive(@Param('id') id: string, @Body('receivedAmount') receivedAmount?: number) {
    return this.receivableService.recordPayment(id, receivedAmount || 0)
  }

  /**
   * 更新应收状态
   */
  @Post(':id/status')
  @ApiOperation({ summary: '更新应收状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReceivableStatus,
  ) {
    return this.receivableService.update(id, { status } as any)
  }

  /**
   * 标记为逾期
   */
  @Post(':id/overdue')
  @ApiOperation({ summary: '标记为逾期' })
  @ApiResponse({ status: 200, description: '逾期标记成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  overdue(@Param('id') id: string) {
    return this.receivableService.markOverdue(id)
  }

  /**
   * 删除应收
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除应收' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '应收不存在' })
  delete(@Param('id') id: string) {
    return this.receivableService.delete(id)
  }
}

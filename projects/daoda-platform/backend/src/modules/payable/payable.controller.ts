/**
 * 应付模块 Controller
 * 提供应付管理的 RESTful API 接口
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
  ParseEnumPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { PayableService } from './payable.service'
import { CreatePayableDto, UpdatePayableDto, PayableQueryDto, PayableStatus } from './payable.dto'

@ApiTags('应付管理')
@Controller('payables')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  /**
   * 创建应付
   */
  @Post()
  @ApiOperation({ summary: '创建应付' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreatePayableDto) {
    return this.payableService.create(dto)
  }

  /**
   * 获取应付列表
   */
  @Get()
  @ApiOperation({ summary: '获取应付列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: PayableQueryDto) {
    return this.payableService.findAll(query)
  }

  /**
   * 根据 ID 获取应付详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取应付详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  findOne(@Param('id') id: string) {
    return this.payableService.findOne(id)
  }

  /**
   * 更新应付
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新应付' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  update(@Param('id') id: string, @Body() dto: UpdatePayableDto) {
    return this.payableService.update(id, dto)
  }

  /**
   * 付款
   */
  @Post(':id/pay')
  @ApiOperation({ summary: '付款' })
  @ApiResponse({ status: 200, description: '付款成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  @ApiResponse({ status: 400, description: '业务逻辑错误' })
  pay(@Param('id') id: string, @Body('paidAmount') paidAmount?: number) {
    return this.payableService.pay(id, paidAmount)
  }

  /**
   * 更新应付状态
   */
  @Post(':id/status')
  @ApiOperation({ summary: '更新应付状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(PayableStatus)) status: PayableStatus,
  ) {
    return this.payableService.updateStatus(id, status)
  }

  /**
   * 标记为逾期
   */
  @Post(':id/overdue')
  @ApiOperation({ summary: '标记为逾期' })
  @ApiResponse({ status: 200, description: '逾期标记成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  overdue(@Param('id') id: string) {
    return this.payableService.overdue(id)
  }

  /**
   * 删除应付
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除应付' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '应付不存在' })
  delete(@Param('id') id: string) {
    return this.payableService.delete(id)
  }
}

/**
 * 发票模块 Controller
 * 提供发票管理的 RESTful API 接口
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
import { InvoiceService } from './invoice.service'
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceQueryDto } from './invoice.dto'

@ApiTags('发票管理')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * 创建发票
   */
  @Post()
  @ApiOperation({ summary: '创建发票' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '客户或订单不存在' })
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto)
  }

  /**
   * 获取发票列表
   */
  @Get()
  @ApiOperation({ summary: '获取发票列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: InvoiceQueryDto) {
    return this.invoiceService.findAll(query)
  }

  /**
   * 根据 ID 获取发票详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取发票详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id)
  }

  /**
   * 更新发票
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新发票' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, dto)
  }

  /**
   * 确认发票（开票）
   */
  @Post(':id/issue')
  @ApiOperation({ summary: '确认发票（开票）' })
  @ApiResponse({ status: 200, description: '确认成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  issue(@Param('id') id: string) {
    return this.invoiceService.issue(id)
  }

  /**
   * 交付发票
   */
  @Post(':id/pay')
  @ApiOperation({ summary: '标记为已支付' })
  @ApiResponse({ status: 200, description: '标记成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  markPaid(@Param('id') id: string) {
    return this.invoiceService.markPaid(id)
  }

  /**
   * 作废发票
   */
  @Post(':id/cancel')
  @ApiOperation({ summary: '作废发票' })
  @ApiResponse({ status: 200, description: '作废成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  cancel(@Param('id') id: string) {
    return this.invoiceService.cancel(id)
  }

  /**
   * 删除发票
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除发票' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '发票不存在' })
  delete(@Param('id') id: string) {
    return this.invoiceService.delete(id)
  }
}

/**
 * 报价单控制器
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
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { QuotationService } from './quotation.service'
import {
  CreateQuotationDto,
  UpdateQuotationDto,
  QuotationQueryDto,
  CreateQuotationItemDto,
} from './quotation.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { QuotationStatus } from '@prisma/client'

@ApiTags('报价单管理')
@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '创建报价单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateQuotationDto, @Request() req: any) {
    return this.quotationService.create(dto, req.user?.sub)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取报价单列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', required: false, enum: QuotationStatus })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'opportunityId', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: QuotationQueryDto) {
    return this.quotationService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取报价单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.quotationService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '更新报价单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.quotationService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除报价单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.quotationService.delete(id)
    return { message: '删除成功' }
  }

  @Post(':id/submit')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '提交审批' })
  @ApiResponse({ status: 200, description: '提交成功' })
  async submit(@Param('id') id: string) {
    return this.quotationService.submit(id)
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '审批通过' })
  @ApiResponse({ status: 200, description: '审批成功' })
  async approve(@Param('id') id: string) {
    return this.quotationService.approve(id)
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '审批拒绝' })
  @ApiResponse({ status: 200, description: '审批成功' })
  async reject(@Param('id') id: string) {
    return this.quotationService.reject(id)
  }

  @Post(':id/convert')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '转为订单' })
  @ApiResponse({ status: 200, description: '转换成功' })
  async convert(@Param('id') id: string) {
    return this.quotationService.convertToOrder(id)
  }
}

/**
 * 客户控制器
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
  ParseArrayPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { CustomerService } from './customer.service'
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
  CreateFollowUpDto,
  FollowUpQueryDto,
} from './customer.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CustomerStatus } from '@prisma/client'

@ApiTags('客户管理')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateCustomerDto, @Request() req: any) {
    return this.customerService.create(dto, req.user?.sub)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取客户列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'level', required: false, enum: ['A', 'B', 'C'] })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'LOST'] })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'industry', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: CustomerQueryDto) {
    return this.customerService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '更新客户' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.customerService.delete(id)
    return { message: '删除成功' }
  }

  @Post('batch/status')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '批量更新状态' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async batchUpdateStatus(@Body() body: { ids: string[]; status: CustomerStatus }) {
    const count = await this.customerService.batchUpdateStatus(body.ids, body.status)
    return { message: `成功更新 ${count} 条记录` }
  }

  @Post('batch/assign')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '批量分配客户' })
  @ApiResponse({ status: 200, description: '分配成功' })
  async batchAssign(@Body() body: { ids: string[]; userId: string }) {
    const count = await this.customerService.batchAssign(body.ids, body.userId)
    return { message: `成功分配 ${count} 条记录` }
  }

  @Post('batch/import')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '批量导入客户' })
  @ApiResponse({ status: 200, description: '导入完成' })
  async batchImport(@Body(new ParseArrayPipe({ items: CreateCustomerDto })) customers: CreateCustomerDto[], @Request() req: any) {
    return this.customerService.batchImport(customers, req.user?.sub)
  }

  @Get('pending-followups')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '待跟进客户' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getPendingFollowUps(@Query() query: CustomerQueryDto) {
    return this.customerService.getPendingFollowUps(query)
  }

  @Post(':id/followups')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '添加跟进记录' })
  @ApiResponse({ status: 201, description: '添加成功' })
  async addFollowUp(@Param('id') customerId: string, @Body() dto: CreateFollowUpDto) {
    return this.customerService.addFollowUp(customerId, dto)
  }

  @Get(':id/followups')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取跟进记录' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getFollowUps(@Param('id') customerId: string, @Query() query: FollowUpQueryDto) {
    return this.customerService.getFollowUps(customerId, query)
  }

  @Delete('followups/:id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除跟进记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deleteFollowUp(@Param('id') id: string) {
    await this.customerService.deleteFollowUp(id)
    return { message: '删除成功' }
  }
}

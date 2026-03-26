/**
 * 售后服务控制器
 * 处理售后服务工单的 HTTP 请求
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
import { ServiceService } from './service.service'
import {
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
  AssignTicketDto,
  ServiceTicketQueryDto,
} from './service.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Priority, TicketStatus } from '@prisma/client'

@ApiTags('售后服务管理')
@Controller('service/tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // ==================== 工单 CRUD 接口 ====================

  /**
   * 创建售后服务工单
   * POST /service-tickets
   */
  @Post()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '创建售后服务工单', description: '创建新的售后服务工单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async create(@Body() dto: CreateServiceTicketDto, @Request() req: any) {
    const userId = req.user?.sub
    return this.serviceService.create(dto, userId)
  }

  /**
   * 获取售后服务工单列表
   * GET /service-tickets
   */
  @Get()
  @Roles('ADMIN', 'MANAGER', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '获取售后服务工单列表', description: '分页查询售后服务工单列表，支持搜索和筛选' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量', example: 10 })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词（工单号）' })
  @ApiQuery({ name: 'status', required: false, description: '工单状态筛选' })
  @ApiQuery({ name: 'priority', required: false, description: '优先级筛选' })
  @ApiQuery({ name: 'customerId', required: false, description: '客户 ID 筛选' })
  @ApiQuery({ name: 'assigneeId', required: false, description: '技术人员 ID 筛选' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期', example: '2024-12-31' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: ServiceTicketQueryDto, @Request() req: any) {
    const userId = req.user?.sub
    return this.serviceService.findAll(query, userId)
  }

  /**
   * 获取售后服务工单详情
   * GET /service-tickets/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '获取售后服务工单详情', description: '根据 ID 获取售后服务工单详细信息' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '工单不存在' })
  async findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id)
  }

  /**
   * 更新售后服务工单
   * PUT /service-tickets/:id
   */
  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '更新售后服务工单', description: '更新售后服务工单信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '工单不存在' })
  async update(@Param('id') id: string, @Body() dto: UpdateServiceTicketDto) {
    return this.serviceService.update(id, dto)
  }

  /**
   * 删除售后服务工单
   * DELETE /service-tickets/:id
   */
  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除售后服务工单', description: '删除售后服务工单（软删除）' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '工单不存在' })
  async delete(@Param('id') id: string) {
    await this.serviceService.delete(id)
    return { message: '删除成功' }
  }

  // ==================== 工单操作接口 ====================

  /**
   * 分配售后服务工单
   * POST /service-tickets/:id/assign
   */
  @Post(':id/assign')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '分配售后服务工单', description: '将工单分配给技术人员' })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 404, description: '工单或技术人员不存在' })
  async assign(@Param('id') id: string, @Body() dto: AssignTicketDto) {
    return this.serviceService.assign(id, dto.assigneeId)
  }

  /**
   * 更新工单状态
   * PUT /service-tickets/:id/status
   */
  @Put(':id/status')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '更新工单状态', description: '更新工单状态（状态流转）' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '状态流转不合法' })
  @ApiResponse({ status: 404, description: '工单不存在' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TicketStatus; solution?: string },
  ) {
    return this.serviceService.updateStatus(id, body.status, body.solution)
  }

  /**
   * 关闭工单
   * POST /service-tickets/:id/close
   */
  @Post(':id/close')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '关闭工单', description: '关闭完成的工单' })
  @ApiResponse({ status: 200, description: '关闭成功' })
  @ApiResponse({ status: 400, description: '工单已关闭或未完成' })
  @ApiResponse({ status: 404, description: '工单不存在' })
  async close(@Param('id') id: string, @Body() body: { solution: string }) {
    await this.serviceService.close(id, body.solution)
    return { message: '工单已关闭' }
  }

  // ==================== 统计接口 ====================

  /**
   * 获取售后服务工单统计
   * GET /service-tickets/stats
   */
  @Get('stats')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '售后服务工单统计', description: '获取售后服务工单整体统计数据' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStats() {
    return this.serviceService.getStats()
  }

  /**
   * 获取客户售后服务统计
   * GET /service-tickets/stats/customer/:customerId
   */
  @Get('stats/customer/:customerId')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '客户售后服务统计', description: '获取指定客户的售后服务统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async getCustomerStats(@Param('customerId') customerId: string) {
    return this.serviceService.getCustomerStats(customerId)
  }
}

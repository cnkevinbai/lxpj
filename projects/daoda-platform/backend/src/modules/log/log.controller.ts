/**
 * 操作日志控制器
 * 处理操作日志的 HTTP 请求
 */
import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { LogQueryDto } from './log.dto'
import { LogService } from './log.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { LogStatus } from '@prisma/client'

@ApiTags('操作日志')
@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LogController {
  constructor(private readonly logService: LogService) {}

  /**
   * 获取日志列表
   * GET /logs
   */
  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: '获取操作日志列表', description: '分页查询操作日志列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '操作状态筛选',
    enum: LogStatus,
  })
  @ApiQuery({ name: 'username', required: false, description: '操作人' })
  @ApiQuery({ name: 'action', required: false, description: '操作动作' })
  @ApiQuery({ name: 'startTime', required: false, description: '开始时间' })
  @ApiQuery({ name: 'endTime', required: false, description: '结束时间' })
  @ApiQuery({ name: 'includeParams', required: false, description: '是否包含参数' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: LogQueryDto) {
    return this.logService.findAll(query)
  }

  /**
   * 获取日志详情
   * GET /logs/:id
   */
  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '获取操作日志详情', description: '根据ID获取操作日志详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '操作日志不存在' })
  async findOne(@Param('id') id: string) {
    return this.logService.findOne(id)
  }

  /**
   * 删除日志
   * DELETE /logs/:id
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '删除操作日志', description: '删除单个操作日志' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '操作日志不存在' })
  async delete(@Param('id') id: string) {
    await this.logService.delete(id)
    return { message: '删除成功' }
  }

  /**
   * 清空日志
   * DELETE /logs
   */
  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: '清空操作日志', description: '删除所有操作日志' })
  @ApiResponse({ status: 200, description: '清空成功' })
  async clear() {
    const count = await this.logService.clear()
    return { message: `成功清空 ${count} 条记录` }
  }
}

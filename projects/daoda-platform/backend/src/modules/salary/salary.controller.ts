/**
 * 工资模块 Controller
 * 提供工资管理的 RESTful API 接口
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
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { SalaryService } from './salary.service'
import { CreateSalaryDto, UpdateSalaryDto, SalaryQueryDto } from './salary.dto'

@ApiTags('工资管理')
@Controller('salary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  /**
   * 创建工资记录
   */
  @Post()
  @ApiOperation({ summary: '创建工资记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  @ApiResponse({ status: 409, description: '工资记录已存在' })
  create(@Body() dto: CreateSalaryDto, @Request() req: any) {
    const userId = req.user?.sub
    return this.salaryService.create(dto, userId)
  }

  /**
   * 获取工资列表
   */
  @Get()
  @ApiOperation({ summary: '获取工资列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: SalaryQueryDto) {
    return this.salaryService.findAll(query)
  }

  /**
   * 根据 ID 获取工资详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取工资详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '工资记录不存在' })
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(id)
  }

  /**
   * 更新工资记录
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新工资记录' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '工资记录不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateSalaryDto) {
    return this.salaryService.update(id, dto)
  }

  /**
   * 发放工资
   */
  @Post(':id/pay')
  @ApiOperation({ summary: '发放工资' })
  @ApiResponse({ status: 200, description: '发放成功' })
  @ApiResponse({ status: 400, description: '工资已发放或已取消' })
  @ApiResponse({ status: 404, description: '工资记录不存在' })
  pay(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub
    return this.salaryService.pay(id, userId)
  }

  /**
   * 取消工资
   */
  @Post(':id/cancel')
  @ApiOperation({ summary: '取消工资' })
  @ApiResponse({ status: 200, description: '取消成功' })
  @ApiResponse({ status: 400, description: '已发放的工资不能取消' })
  @ApiResponse({ status: 404, description: '工资记录不存在' })
  cancel(@Param('id') id: string) {
    return this.salaryService.cancel(id)
  }

  /**
   * 删除工资记录
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除工资记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '工资记录不存在' })
  delete(@Param('id') id: string) {
    return this.salaryService.delete(id)
  }
}

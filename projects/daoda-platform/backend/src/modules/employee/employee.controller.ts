/**
 * 员工模块 Controller
 * 提供员工管理的 RESTful API 接口
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
import { EmployeeService } from './employee.service'
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryDto } from './employee.dto'

@ApiTags('员工管理')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * 创建员工
   */
  @Post()
  @ApiOperation({ summary: '创建员工' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '员工编号已存在' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto)
  }

  /**
   * 获取员工列表
   */
  @Get()
  @ApiOperation({ summary: '获取员工列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: EmployeeQueryDto) {
    return this.employeeService.findAll(query)
  }

  /**
   * 根据 ID 获取员工详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取员工详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id)
  }

  /**
   * 根据用户 ID 获取员工信息
   */
  @Get('user/:userId')
  @ApiOperation({ summary: '根据用户 ID 获取员工信息' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findByUserId(@Param('userId') userId: string) {
    return this.employeeService.findByUserId(userId)
  }

  /**
   * 更新员工
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新员工' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto)
  }

  /**
   * 离职处理
   */
  @Post(':id/resign')
  @ApiOperation({ summary: '离职处理' })
  @ApiResponse({ status: 200, description: '处理成功' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  resign(@Param('id') id: string) {
    return this.employeeService.resign(id)
  }

  /**
   * 删除员工
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除员工' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  delete(@Param('id') id: string) {
    return this.employeeService.delete(id)
  }
}

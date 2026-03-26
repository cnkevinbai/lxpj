/**
 * 考勤模块 Controller
 * 提供考勤管理的 RESTful API 接口
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
import { AttendanceService } from './attendance.service'
import { CreateAttendanceDto, UpdateAttendanceDto, AttendanceQueryDto, CheckInDto, CheckOutDto } from './attendance.dto'

@ApiTags('考勤管理')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * 创建考勤记录
   */
  @Post()
  @ApiOperation({ summary: '创建考勤记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  @ApiResponse({ status: 409, description: '考勤记录已存在' })
  create(@Body() dto: CreateAttendanceDto, @Request() req: any) {
    const userId = req.user?.sub
    return this.attendanceService.create(dto, userId)
  }

  /**
   * 签到
   */
  @Post('check-in')
  @ApiOperation({ summary: '签到' })
  @ApiResponse({ status: 201, description: '签到成功' })
  @ApiResponse({ status: 400, description: '今日已签到' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  checkIn(@Body() dto: CheckInDto, @Request() req: any) {
    // 从 JWT token 中获取用户 ID，然后根据用户 ID 查找员工 ID
    const userId = req.user?.sub
    // 这里需要根据实际情况获取员工 ID，简化处理直接传 employeeId
    const employeeId = dto['employeeId'] || req.user?.employeeId
    return this.attendanceService.checkIn(employeeId, userId)
  }

  /**
   * 签退
   */
  @Post('check-out')
  @ApiOperation({ summary: '签退' })
  @ApiResponse({ status: 200, description: '签退成功' })
  @ApiResponse({ status: 400, description: '未签到或已签退' })
  @ApiResponse({ status: 404, description: '员工不存在' })
  checkOut(@Body() dto: CheckOutDto, @Request() req: any) {
    const employeeId = dto['employeeId'] || req.user?.employeeId
    return this.attendanceService.checkOut(employeeId)
  }

  /**
   * 获取考勤列表
   */
  @Get()
  @ApiOperation({ summary: '获取考勤列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAll(query)
  }

  /**
   * 根据 ID 获取考勤详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取考勤详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '考勤记录不存在' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id)
  }

  /**
   * 更新考勤记录
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新考勤记录' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '考勤记录不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, dto)
  }

  /**
   * 删除考勤记录
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除考勤记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '考勤记录不存在' })
  delete(@Param('id') id: string) {
    return this.attendanceService.delete(id)
  }
}

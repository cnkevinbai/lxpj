/**
 * 培训管理控制器
 * API 接口：培训计划、课程管理、培训记录、培训评估
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import {
  TrainingService,
  TrainingStatus,
  CourseType,
  TrainingCategory,
  RecordStatus,
} from './training.service'

@Controller('api/hr/training')
export class TrainingController {
  constructor(private readonly service: TrainingService) {}

  // ========== 课程管理 ==========

  @Get('courses')
  getCourses(@Query() params?: any) {
    return this.service.getCourses(params)
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.service.getCourse(id)
  }

  @Post('courses')
  createCourse(@Body() course: any) {
    return this.service.createCourse(course)
  }

  @Post('courses/:id')
  updateCourse(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateCourse(id, updates)
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: string) {
    return this.service.deleteCourse(id)
  }

  // ========== 培训计划管理 ==========

  @Get('plans')
  getPlans(@Query() params?: any) {
    return this.service.getPlans(params)
  }

  @Get('plans/:id')
  getPlan(@Param('id') id: string) {
    return this.service.getPlan(id)
  }

  @Post('plans')
  createPlan(@Body() plan: any) {
    return this.service.createPlan(plan)
  }

  @Post('plans/:id/publish')
  publishPlan(@Param('id') id: string) {
    return this.service.publishPlan(id)
  }

  // ========== 培训记录管理 ==========

  @Post('register')
  register(@Body() params: any) {
    return this.service.register(params)
  }

  @Get('records')
  getRecords(@Query() params?: any) {
    return this.service.getRecords(params)
  }

  @Post('records/:id/complete')
  completeTraining(@Param('id') id: string, @Body() result: any) {
    return this.service.completeTraining(id, result)
  }

  @Post('records/:id/evaluate')
  evaluateTraining(@Param('id') id: string, @Body() evaluation: any) {
    return this.service.evaluateTraining(id, evaluation)
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }
}

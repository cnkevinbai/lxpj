/**
 * 项目管理控制器
 * API 接口：项目列表、项目详情、任务管理、里程碑管理、风险管理、资源分配
 */
import { Controller, Get, Query, Param } from '@nestjs/common'
import { ProjectManagementService } from './project-management.service'

@Controller('api/erp/project-management')
export class ProjectManagementController {
  constructor(private readonly service: ProjectManagementService) {}

  // ========== 项目管理 ==========

  @Get('projects')
  getProjects(@Query() query?: any) {
    return this.service.getProjects(query)
  }

  @Get('projects/:id')
  getProject(@Param('id') id: string) {
    return this.service.getProject(id)
  }

  // ========== 任务管理 ==========

  @Get('projects/:projectId/tasks')
  getProjectTasks(@Param('projectId') projectId: string, @Query() query?: any) {
    return this.service.getProjectTasks(projectId, query)
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.service.getTask(id)
  }

  // ========== 里程碑管理 ==========

  @Get('projects/:projectId/milestones')
  getProjectMilestones(@Param('projectId') projectId: string) {
    return this.service.getProjectMilestones(projectId)
  }

  // ========== 风险管理 ==========

  @Get('projects/:projectId/risks')
  getProjectRisks(@Param('projectId') projectId: string) {
    return this.service.getProjectRisks(projectId)
  }

  // ========== 统计 ==========

  @Get('stats/projects')
  getProjectStats() {
    return this.service.getProjectStats()
  }

  @Get('stats/tasks')
  getTaskStats(@Query('projectId') projectId?: string) {
    return this.service.getTaskStats(projectId)
  }

  // ========== 资源分配 ==========

  @Get('resources/allocation')
  getResourceAllocation() {
    return this.service.getResourceAllocation()
  }
}

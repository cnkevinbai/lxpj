/**
 * 组织架构控制器
 * 组织架构管理 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { OrganizationService, OrgType, OrgStatus } from './organization.service'

@Controller('api/hr/organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  // ========== 组织树 ==========

  @Get('tree')
  async getOrgTree(@Query('parentId') parentId?: string) {
    return this.service.getOrgTree(parentId)
  }

  // ========== 组织管理 ==========

  @Get()
  async getList(@Query('type') type?: OrgType, @Query('status') status?: OrgStatus) {
    return this.service.getList(type, status)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Post()
  async create(
    @Body()
    data: Partial<{
      name: string
      code: string
      type: OrgType
      parentId?: string
      managerId?: string
      status?: OrgStatus
      description?: string
      location?: string
    }>,
  ) {
    return this.service.create(data)
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      name: string
      code: string
      type: OrgType
      managerId: string
      status: OrgStatus
      description: string
      location: string
    }>,
  ) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

  // ========== 组织操作 ==========

  @Post(':id/move')
  async move(@Param('id') id: string, @Body() body: { newParentId: string }) {
    return this.service.move(id, body.newParentId)
  }

  @Post(':id/manager')
  async setManager(@Param('id') id: string, @Body() body: { managerId: string }) {
    return this.service.setManager(id, body.managerId)
  }

  // ========== 查询 ==========

  @Get(':id/employees')
  async getEmployees(@Param('id') id: string) {
    return this.service.getEmployees(id)
  }

  @Post('by-ids')
  async getByIds(@Body() body: { ids: string[] }) {
    return this.service.getByIds(body.ids)
  }

  @Get('search/query')
  async search(@Query('keyword') keyword: string) {
    return this.service.search(keyword)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}

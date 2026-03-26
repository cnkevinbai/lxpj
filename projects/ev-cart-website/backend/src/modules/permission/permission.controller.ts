import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PermissionService } from './services/permission.service'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: '获取所有权限' })
  findAll() {
    return this.permissionService.findAll()
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户权限' })
  getUserPermissions(
    @Param('userId') userId: string,
    @Query('role') role: string,
    @Query('department') department: string,
  ) {
    return this.permissionService.getUserPermissions(userId, role, department)
  }

  @Get('check')
  @ApiOperation({ summary: '检查权限' })
  hasPermission(
    @Query('userId') userId: string,
    @Query('permission') permission: string,
    @Query('department') department: string,
  ) {
    return this.permissionService.hasPermission(userId, permission, department)
  }

  @Post()
  @ApiOperation({ summary: '创建权限' })
  create(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('module') module: string,
    @Body('action') action: string,
    @Body('businessType') businessType: string,
  ) {
    return this.permissionService.create(name, description, module, action, businessType)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.permissionService.update(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id)
  }
}

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../../common/guards/roles.guard'

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '创建角色' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  findAll() {
    return this.roleService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id)
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id)
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取角色权限' })
  getPermissions(@Param('id') id: string) {
    return this.roleService.getPermissions(id)
  }

  @Post(':id/permissions/check')
  @ApiOperation({ summary: '检查权限' })
  hasPermission(@Param('id') id: string, @Body('permission') permission: string) {
    return this.roleService.hasPermission(id, permission)
  }
}

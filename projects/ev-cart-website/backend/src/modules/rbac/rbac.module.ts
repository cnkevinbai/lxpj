/**
 * 角色权限管理模块 (RBAC)
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { UserRole } from './entities/user-role.entity'
import { RolePermission } from './entities/role-permission.entity'
import { RbacService } from './rbac.service'
import { RbacController } from './rbac.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, UserRole, RolePermission]),
  ],
  providers: [RbacService],
  controllers: [RbacController],
  exports: [RbacService],
})
export class RbacModule {}

/**
 * 角色权限服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { UserRole } from './entities/user-role.entity'
import { RolePermission } from './entities/role-permission.entity'

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  /**
   * 获取用户角色
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    })
    return userRoles.map(ur => ur.role)
  }

  /**
   * 获取用户权限
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const roles = await this.getUserRoles(userId)
    const roleIds = roles.map(r => r.id)

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId: roleIds },
      relations: ['permission'],
    })

    return rolePermissions.map(rp => rp.permission)
  }

  /**
   * 检查用户权限
   */
  async checkPermission(userId: string, permissionCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.some(p => p.code === permissionCode)
  }

  /**
   * 分配角色给用户
   */
  async assignRole(userId: string, roleId: string, grantedBy?: string, expiresAt?: Date) {
    const userRole = this.userRoleRepository.create({
      userId,
      roleId,
      grantedBy,
      expiresAt,
    })
    return this.userRoleRepository.save(userRole)
  }

  /**
   * 移除用户角色
   */
  async removeUserRole(userId: string, roleId: string) {
    return this.userRoleRepository.delete({ userId, roleId })
  }

  /**
   * 给角色分配权限
   */
  async assignPermission(roleId: string, permissionId: string) {
    const rolePermission = this.rolePermissionRepository.create({
      roleId,
      permissionId,
    })
    return this.rolePermissionRepository.save(rolePermission)
  }

  /**
   * 移除角色权限
   */
  async removeRolePermission(roleId: string, permissionId: string) {
    return this.rolePermissionRepository.delete({ roleId, permissionId })
  }

  /**
   * 获取所有角色
   */
  async getAllRoles() {
    return this.roleRepository.find({ where: { isActive: true } })
  }

  /**
   * 获取所有权限
   */
  async getAllPermissions(resourceType?: string) {
    const query = this.permissionRepository.createQueryBuilder('permission')
      .where('permission.isActive = :isActive', { isActive: true })
      .orderBy('permission.sortOrder', 'ASC')

    if (resourceType) {
      query.andWhere('permission.resourceType = :resourceType', { resourceType })
    }

    return query.getMany()
  }

  /**
   * 初始化系统角色
   */
  async initRoles() {
    const roles = [
      { code: 'admin', name: '系统管理员', department: 'system', description: '系统最高权限' },
      { code: 'manager', name: '部门经理', department: 'sales', description: '销售部门经理' },
      { code: 'sales', name: '销售人员', department: 'sales', description: '销售代表' },
      { code: 'service_manager', name: '售后主管', department: 'service', description: '售后服务主管，负责工单分配' },
      { code: 'technician', name: '服务人员', department: 'service', description: '技术服务人员' },
      { code: 'finance', name: '财务人员', department: 'finance', description: '财务会计' },
      { code: 'purchase', name: '采购人员', department: 'purchase', description: '采购专员' },
      { code: 'warehouse', name: '库管人员', department: 'warehouse', description: '仓库管理员' },
    ]

    for (const roleData of roles) {
      const existing = await this.roleRepository.findOne({ where: { code: roleData.code as any } })
      if (!existing) {
        const role = this.roleRepository.create(roleData)
        await this.roleRepository.save(role)
      }
    }
  }

  /**
   * 初始化系统权限
   */
  async initPermissions() {
    const permissions = [
      // CRM 权限
      { code: 'crm:customer:view', name: '查看客户', type: 'menu', resourceType: 'crm' },
      { code: 'crm:customer:create', name: '新建客户', type: 'button', resourceType: 'crm' },
      { code: 'crm:customer:edit', name: '编辑客户', type: 'button', resourceType: 'crm' },
      { code: 'crm:customer:delete', name: '删除客户', type: 'button', resourceType: 'crm' },
      { code: 'crm:order:view', name: '查看订单', type: 'menu', resourceType: 'crm' },
      { code: 'crm:order:create', name: '新建订单', type: 'button', resourceType: 'crm' },

      // 售后权限
      { code: 'after_sales:ticket:view', name: '查看工单', type: 'menu', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:create', name: '创建工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:assign', name: '分配工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:accept', name: '受理工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:process', name: '处理工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:complete', name: '完成工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:close', name: '关闭工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:ticket:export', name: '导出工单', type: 'button', resourceType: 'after_sales' },
      { code: 'after_sales:statistic:view', name: '查看统计', type: 'menu', resourceType: 'after_sales' },

      // ERP 权限
      { code: 'erp:purchase:view', name: '查看采购', type: 'menu', resourceType: 'erp' },
      { code: 'erp:inventory:view', name: '查看库存', type: 'menu', resourceType: 'erp' },

      // 系统权限
      { code: 'system:role:view', name: '查看角色', type: 'menu', resourceType: 'system' },
      { code: 'system:role:manage', name: '管理角色', type: 'button', resourceType: 'system' },
      { code: 'system:user:manage', name: '管理用户', type: 'button', resourceType: 'system' },
    ]

    for (const permData of permissions) {
      const existing = await this.permissionRepository.findOne({ where: { code: permData.code } })
      if (!existing) {
        const permission = this.permissionRepository.create(permData)
        await this.permissionRepository.save(permission)
      }
    }
  }
}

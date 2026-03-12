import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

/**
 * 权限面板服务
 * 可视化权限管理
 */
@Injectable()
export class PermissionPanelService {
  private readonly logger = new Logger(PermissionPanelService.name);

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ========== 权限管理 ==========

  /**
   * 获取权限树
   */
  async getPermissionTree(): Promise<PermissionTreeNode[]> {
    const permissions = await this.permissionRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    // 构建权限树
    const tree: PermissionTreeNode[] = [];
    const moduleMap = new Map<string, PermissionTreeNode>();

    // 按模块分组
    for (const permission of permissions) {
      if (!moduleMap.has(permission.module)) {
        moduleMap.set(permission.module, {
          id: permission.module,
          permissionCode: permission.module,
          permissionName: this.getModuleName(permission.module),
          module: permission.module,
          action: 'module',
          children: [],
          isModule: true,
        });
      }

      const moduleNode = moduleMap.get(permission.module);
      moduleNode.children.push({
        id: permission.id,
        permissionCode: permission.permissionCode,
        permissionName: permission.permissionName,
        module: permission.module,
        action: permission.action,
        description: permission.description,
        effect: permission.effect,
        children: [],
        isModule: false,
      });
    }

    return Array.from(moduleMap.values());
  }

  /**
   * 获取角色权限
   */
  async getRolePermissions(roleId: string): Promise<RolePermissionView> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error('角色不存在');
    }

    const permissionTree = await this.getPermissionTree();
    const rolePermissions = role.permissions || [];

    // 标记已选权限
    const markedTree = this.markPermissions(permissionTree, rolePermissions);

    return {
      role,
      permissionTree: markedTree,
    };
  }

  /**
   * 分配角色权限
   */
  async assignRolePermissions(roleId: string, permissionCodes: string[]): Promise<Role> {
    this.logger.log(`分配角色权限：${roleId}, 权限数：${permissionCodes.length}`);

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('角色不存在');
    }

    // 获取权限详情
    const permissions = await this.permissionRepository.findByIds(
      permissionCodes.map(code => code), // 简化处理
    );

    // 构建权限配置
    role.permissions = permissions.map(p => ({
      code: p.permissionCode,
      module: p.module,
      action: p.action,
      effect: p.effect,
    }));

    // 构建菜单权限
    role.menuPermissions = this.buildMenuPermissions(permissions);

    // 构建数据权限
    role.dataPermissions = this.buildDataPermissions(permissions);

    await this.roleRepository.save(role);

    this.logger.log(`角色权限分配成功：${role.roleName}`);

    return role;
  }

  /**
   * 获取用户权限
   */
  async getUserPermissions(userId: string): Promise<UserPermissionView> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 合并所有角色权限
    const allPermissions = new Set<string>();
    const menuPermissions = new Set<string>();
    const dataPermissions = new Set<string>();

    for (const role of user.roles || []) {
      if (role.permissions) {
        for (const perm of role.permissions) {
          allPermissions.add(perm.code);
        }
      }
      if (role.menuPermissions) {
        for (const menu of role.menuPermissions) {
          menuPermissions.add(menu);
        }
      }
      if (role.dataPermissions) {
        for (const data of role.dataPermissions) {
          dataPermissions.add(data);
        }
      }
    }

    // 超级管理员拥有所有权限
    if (user.isSuperAdmin) {
      const allPerms = await this.permissionRepository.find();
      for (const perm of allPerms) {
        allPermissions.add(perm.permissionCode);
      }
    }

    return {
      user,
      permissions: Array.from(allPermissions),
      menuPermissions: Array.from(menuPermissions),
      dataPermissions: Array.from(dataPermissions),
    };
  }

  /**
   * 检查用户权限
   */
  async checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.permissions.includes(permissionCode);
  }

  /**
   * 检查用户菜单权限
   */
  async checkUserMenuPermission(userId: string, menuCode: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.menuPermissions.includes(menuCode);
  }

  // ========== 权限统计 ==========

  /**
   * 获取权限统计
   */
  async getStatistics(): Promise<PermissionStatistics> {
    const total = await this.permissionRepository.count({
      where: { isActive: true },
    });

    const moduleCount = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.module', 'module')
      .addSelect('COUNT(*)', 'count')
      .groupBy('permission.module')
      .getRawMany();

    const roleCount = await this.roleRepository.count();
    const userCount = await this.userRepository.count({
      where: { status: 'active' },
    });

    return {
      total,
      moduleCount: moduleCount.reduce((acc, item) => {
        acc[item.module] = parseInt(item.count);
        return acc;
      }, {}),
      roleCount,
      userCount,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 获取模块名称
   */
  private getModuleName(module: string): string {
    const names: Record<string, string> = {
      'crm': '客户管理',
      'erp': '生产管理',
      'hr': '人力资源',
      'finance': '财务管理',
      'purchase': '采购管理',
      'sales': '销售管理',
      'inventory': '库存管理',
      'after_sales': '售后服务',
      'system': '系统管理',
      'report': '报表中心',
    };
    return names[module] || module;
  }

  /**
   * 标记权限
   */
  private markPermissions(tree: PermissionTreeNode[], selectedPermissions: any[]): PermissionTreeNode[] {
    const selectedCodes = new Set(selectedPermissions.map(p => p.code || p));

    return tree.map(node => {
      const markedNode = { ...node };

      if (node.isModule) {
        // 模块节点
        if (node.children) {
          markedNode.children = this.markPermissions(node.children, selectedPermissions);
          // 检查子节点是否全选
          markedNode.isChecked = node.children.every(child => child.isChecked);
          markedNode.isIndeterminate = node.children.some(child => child.isChecked || child.isIndeterminate);
        }
      } else {
        // 权限节点
        markedNode.isChecked = selectedCodes.has(node.permissionCode);
      }

      return markedNode;
    });
  }

  /**
   * 构建菜单权限
   */
  private buildMenuPermissions(permissions: Permission[]): string[] {
    const menus = new Set<string>();
    
    for (const perm of permissions) {
      if (perm.action === 'read' || perm.action === 'view') {
        menus.add(perm.module);
      }
    }

    return Array.from(menus);
  }

  /**
   * 构建数据权限
   */
  private buildDataPermissions(permissions: Permission[]): string[] {
    const dataPerms = [];

    for (const perm of permissions) {
      if (perm.conditions && perm.conditions.dataScope) {
        dataPerms.push(perm.conditions.dataScope);
      }
    }

    return dataPerms;
  }
}

// ========== 类型定义 ==========

interface PermissionTreeNode {
  id: string;
  permissionCode: string;
  permissionName: string;
  module: string;
  action?: string;
  description?: string;
  effect?: 'allow' | 'deny';
  children?: PermissionTreeNode[];
  isModule?: boolean;
  isChecked?: boolean;
  isIndeterminate?: boolean;
}

interface RolePermissionView {
  role: Role;
  permissionTree: PermissionTreeNode[];
}

interface UserPermissionView {
  user: User;
  permissions: string[];
  menuPermissions: string[];
  dataPermissions: string[];
}

interface PermissionStatistics {
  total: number;
  moduleCount: Record<string, number>;
  roleCount: number;
  userCount: number;
}

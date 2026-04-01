/**
 * ModulePermission 模块权限接口
 * 定义模块的权限规范
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

/**
 * 权限类型枚举
 */
export enum PermissionType {
  /** 资源权限 - 对特定资源的操作权限 */
  RESOURCE = 'resource',
  /** 操作权限 - 执行特定操作的权限 */
  ACTION = 'action',
  /** 数据权限 - 数据范围的访问权限 */
  DATA = 'data',
  /** 管理权限 - 系统管理相关权限 */
  ADMIN = 'admin',
}

/**
 * 数据范围枚举
 */
export enum DataScope {
  /** 全部数据 */
  ALL = 'all',
  /** 本部门数据 */
  DEPT = 'dept',
  /** 本部门及下级数据 */
  DEPT_TREE = 'dept_tree',
  /** 仅本人数据 */
  SELF = 'self',
  /** 自定义范围 */
  CUSTOM = 'custom',
}

/**
 * 模块权限定义
 *
 * 权限标识格式: module:resource:action
 * 示例: crm:customer:view, crm:customer:create
 *
 * @example
 * ```typescript
 * const permissions: ModulePermission[] = [
 *   {
 *     id: 'crm:customer:view',
 *     name: '查看客户',
 *     description: '查看客户列表和详情',
 *     type: PermissionType.RESOURCE,
 *     resource: 'customer',
 *     action: 'view',
 *   },
 *   {
 *     id: 'crm:customer:create',
 *     name: '创建客户',
 *     description: '创建新客户',
 *     type: PermissionType.RESOURCE,
 *     resource: 'customer',
 *     action: 'create',
 *   },
 *   {
 *     id: 'crm:customer:export',
 *     name: '导出客户',
 *     description: '导出客户数据',
 *     type: PermissionType.ACTION,
 *   },
 *   {
 *     id: 'crm:customer:data:self',
 *     name: '仅本人客户数据',
 *     description: '只能查看自己创建的客户',
 *     type: PermissionType.DATA,
 *     dataScope: DataScope.SELF,
 *   },
 * ];
 * ```
 */
export interface ModulePermission {
  // ============================================
  // 权限基本信息 (必需)
  // ============================================

  /**
   * 权限唯一标识
   *
   * 格式: module:resource:action 或 module:action
   * 示例: crm:customer:view, crm:customer:create, crm:export
   */
  id: string

  /**
   * 权限显示名称
   */
  name: string

  /**
   * 权限描述
   */
  description?: string

  /**
   * 权限类型
   */
  type: PermissionType

  // ============================================
  // 权限分类 (可选)
  // ============================================

  /**
   * 所属模块ID
   */
  moduleId?: string

  /**
   * 权限分组
   * 用于界面分类显示
   */
  group?: string

  /**
   * 资源标识 (资源类型权限)
   *
   * 示例: customer, lead, order
   */
  resource?: string

  /**
   * 操作标识 (资源类型权限)
   *
   * 标准操作: view, create, edit, delete, export, import
   * 示例: view, create
   */
  action?: string

  // ============================================
  // 数据权限配置 (可选)
  // ============================================

  /**
   * 数据范围 (数据类型权限)
   */
  dataScope?: DataScope

  /**
   * 自定义数据范围 (仅 CUSTOM 类型)
   */
  customScope?: {
    /** 部门ID列表 */
    deptIds?: string[]
    /** 自定义规则 */
    rules?: Array<{
      field: string
      operator: 'eq' | 'in' | 'like'
      value: any
    }>
  }

  // ============================================
  // 权限关系 (可选)
  // ============================================

  /**
   * 父权限ID
   * 用于构建权限树
   */
  parentId?: string

  /**
   * 依赖权限
   * 必须同时拥有这些权限才能生效
   */
  dependsOn?: string[]

  /**
   * 互斥权限
   * 拥有这些权限时此权限无效
   */
  conflictsWith?: string[]

  // ============================================
  // 其他配置 (可选)
  // ============================================

  /**
   * 权限图标
   */
  icon?: string

  /**
   * 排序权重
   */
  order?: number

  /**
   * 是否默认权限
   * 默认权限会自动分配给新用户
   */
  default?: boolean

  /**
   * 是否系统权限
   * 系统权限无法删除
   */
  system?: boolean
}

/**
 * 权限组定义
 * 用于批量管理相关权限
 */
export interface PermissionGroup {
  /** 组ID */
  id: string
  /** 组名称 */
  name: string
  /** 组描述 */
  description?: string
  /** 组内权限 */
  permissions: ModulePermission[]
  /** 资源标识 */
  resource?: string
}

/**
 * 标准 CRUD 权限生成器
 * 为资源自动生成标准 CRUD 权限
 *
 * @example
 * ```typescript
 * // 为 customer 资源生成标准权限
 * const customerPermissions = generateCrudPermissions('crm', 'customer');
 * // 结果:
 * // crm:customer:view, crm:customer:create, crm:customer:edit,
 * // crm:customer:delete, crm:customer:export
 * ```
 */
export function generateCrudPermissions(
  moduleId: string,
  resource: string,
  options?: {
    /** 是否包含导出权限 */
    export?: boolean
    /** 是否包含导入权限 */
    import?: boolean
    /** 是否包含批量操作权限 */
    batch?: boolean
  },
): ModulePermission[] {
  const permissions: ModulePermission[] = [
    {
      id: `${moduleId}:${resource}:view`,
      name: `查看${resource}`,
      type: PermissionType.RESOURCE,
      resource,
      action: 'view',
    },
    {
      id: `${moduleId}:${resource}:create`,
      name: `创建${resource}`,
      type: PermissionType.RESOURCE,
      resource,
      action: 'create',
    },
    {
      id: `${moduleId}:${resource}:edit`,
      name: `编辑${resource}`,
      type: PermissionType.RESOURCE,
      resource,
      action: 'edit',
    },
    {
      id: `${moduleId}:${resource}:delete`,
      name: `删除${resource}`,
      type: PermissionType.RESOURCE,
      resource,
      action: 'delete',
    },
  ]

  if (options?.export) {
    permissions.push({
      id: `${moduleId}:${resource}:export`,
      name: `导出${resource}`,
      type: PermissionType.ACTION,
    })
  }

  if (options?.import) {
    permissions.push({
      id: `${moduleId}:${resource}:import`,
      name: `导入${resource}`,
      type: PermissionType.ACTION,
    })
  }

  if (options?.batch) {
    permissions.push({
      id: `${moduleId}:${resource}:batch_delete`,
      name: `批量删除${resource}`,
      type: PermissionType.ACTION,
    })
  }

  return permissions
}

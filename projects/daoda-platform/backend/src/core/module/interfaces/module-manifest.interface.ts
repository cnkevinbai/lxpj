/**
 * ModuleManifest 模块清单接口
 * 定义模块的基本元信息
 *
 * 设计依据: PLUGIN_SYSTEM_DESIGN.md - 插件元数据接口
 * @version 1.0.0
 * @since 2026-03-30
 */

import { HotUpdateStrategy } from './imodule.interface'

/**
 * 模块依赖定义
 */
export interface ModuleDependency {
  /** 依赖模块ID */
  id: string
  /** 版本要求 (语义化版本范围) */
  version: string
  /** 是否可选依赖 */
  optional?: boolean
  /** 依赖描述 */
  description?: string
}

/**
 * 模块清单接口
 *
 * 每个模块必须提供清单信息，用于:
 * 1. 模块识别和注册
 * 2. 依赖检查和版本兼容
 * 3. 热更新策略配置
 * 4. 权限和能力声明
 *
 * @example
 * ```typescript
 * const crmManifest: ModuleManifest = {
 *   id: '@daoda/crm',
 *   name: 'CRM客户管理',
 *   version: '1.0.0',
 *   description: '客户关系管理模块，包含客户、线索、商机管理',
 *   author: '道达智能',
 *   category: 'business',
 *   dependencies: [
 *     { id: '@daoda/core', version: '^1.0.0' },
 *     { id: '@daoda/auth', version: '^1.0.0' },
 *   ],
 *   hotUpdate: {
 *     enabled: true,
 *     strategy: HotUpdateStrategy.ROLLING,
 *   },
 * };
 * ```
 */
export interface ModuleManifest {
  // ============================================
  // 基本信息 (必需)
  // ============================================

  /**
   * 模块唯一标识符
   *
   * 格式: @vendor/module-name
   * 示例: @daoda/crm, @daoda/erp
   *
   * 规则:
   * - 使用 npm 包命名规范
   * - vendor 为组织/公司标识
   * - module-name 为模块名称 (小写，连字符分隔)
   */
  id: string

  /**
   * 模块显示名称
   * 用于界面展示和日志输出
   */
  name: string

  /**
   * 模块版本号
   *
   * 格式: MAJOR.MINOR.PATCH
   * 示例: 1.0.0, 1.2.3-beta.1
   *
   * 规则:
   * - 遵循语义化版本规范 (SemVer)
   * - MAJOR: 不兼容的 API 变更
   * - MINOR: 向后兼容的功能新增
   * - PATCH: 向后兼容的 Bug 修复
   */
  version: string

  /**
   * 模块描述
   * 详细说明模块的功能和用途
   */
  description: string

  // ============================================
  // 作者信息 (可选)
  // ============================================

  /**
   * 模块作者
   */
  author?: string

  /**
   * 作者邮箱
   */
  authorEmail?: string

  /**
   * 维护者列表
   */
  maintainers?: Array<{
    name: string
    email: string
  }>

  // ============================================
  // 分类信息 (可选)
  // ============================================

  /**
   * 模块类别
   *
   * core - 核心模块 (认证、用户、配置)
   * business - 业务模块 (CRM、ERP、财务)
   * adapter - 适配器模块 (API、消息、存储)
   * extension - 扩展模块 (报表、分析、集成)
   */
  category?: 'core' | 'business' | 'adapter' | 'extension'

  /**
   * 模块标签
   * 用于搜索和分类
   */
  tags?: string[]

  /**
   * 模块图标
   * 用于界面展示
   */
  icon?: string

  // ============================================
  // 技术信息 (可选)
  // ============================================

  /**
   * 入口文件路径
   * 相对于模块根目录
   *
   * 默认: index.ts 或 main.ts
   */
  main?: string

  /**
   * 模块路由路径前缀
   * 所有 API 路以此前缀开头
   *
   * 示例: /api/v1/crm
   */
  routePrefix?: string

  /**
   * 模块数据库表前缀
   * 所有数据表以此前缀开头
   *
   * 示例: crm_ (crm_customer, crm_lead)
   */
  tablePrefix?: string

  // ============================================
  // 依赖管理 (可选)
  // ============================================

  /**
   * 模块依赖列表
   * 定义模块运行所需的其他模块
   */
  dependencies?: ModuleDependency[]

  /**
   * 冲突模块列表
   * 定义与此模块冲突的其他模块
   */
  conflicts?: string[]

  /**
   * 核心版本要求
   * 定义所需的核心系统版本范围
   */
  coreVersion?: string

  /**
   * Node.js 版本要求
   */
  nodeVersion?: string

  // ============================================
  // 热更新配置 (可选)
  // ============================================

  /**
   * 热更新配置
   */
  hotUpdate?: {
    /** 是否支持热更新 */
    enabled: boolean
    /** 更新策略 */
    strategy: HotUpdateStrategy
    /** 金丝雀发布比例 (仅 CANARY 策略) */
    canaryRatio?: number
    /** 更新超时时间 (毫秒) */
    timeout?: number
    /** 是否需要数据迁移 */
    needsMigration?: boolean
    /** 回滚支持 */
    rollback?: {
      enabled: boolean
      maxRetries?: number
    }
  }

  // ============================================
  // 权限和能力 (可选)
  // ============================================

  /**
   * 模块所需权限
   * 定义模块运行所需的系统权限
   */
  permissions?: string[]

  /**
   * 模块提供的能力
   * 定义模块对外暴露的功能接口
   */
  capabilities?: string[]

  // ============================================
  // 其他信息 (可选)
  // ============================================

  /**
   * 模块主页 URL
   */
  homepage?: string

  /**
   * 模块文档 URL
   */
  documentation?: string

  /**
   * 模块仓库 URL
   */
  repository?: string

  /**
   * 许可证类型
   */
  license?: string

  /**
   * 是否内置模块
   * 内置模块无法卸载
   */
  builtin?: boolean

  /**
   * 是否系统模块
   * 系统模块优先级更高
   */
  system?: boolean

  /**
   * 模块配置
   * 模块特定的配置项
   */
  config?: Record<string, any>
}

/**
 * 模块清单装饰器
 * 用于在类上声明模块清单信息
 *
 * @example
 * ```typescript
 * @ModuleManifest({
 *   id: '@daoda/crm',
 *   name: 'CRM客户管理',
 *   version: '1.0.0',
 * })
 * export class CrmModule implements IModule {
 *   // ...
 * }
 * ```
 */
export function ModuleManifest(manifest: Partial<ModuleManifest>): ClassDecorator {
  return (target: any) => {
    // 将清单信息附加到类的静态属性
    target.__moduleManifest = manifest
    return target
  }
}

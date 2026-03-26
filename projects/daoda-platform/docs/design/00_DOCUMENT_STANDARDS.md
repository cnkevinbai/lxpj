# 道达智能数字化平台 - 文档统一规范

> **版本**: v1.0  
> **创建日期**: 2026-03-19  
> **适用范围**: 所有设计开发文档

---

## 一、文档体系结构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     道达智能数字化平台文档体系                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  第一层：总体架构                                                        │
│  ├── MODULE_DESIGN_MASTER.md          # 系统模块设计开发文档总纲         │
│  └── README.md                        # 项目说明                        │
│                                                                         │
│  第二层：开发规范                                                        │
│  └── 01_DEVELOPMENT_STANDARDS.md      # 开发规范与编码标准               │
│                                                                         │
│  第三层：模块设计                                                        │
│  ├── 02_ERP_MODULE.md                 # ERP模块设计                      │
│  ├── 03_CRM_MODULE.md                 # CRM模块设计                      │
│  ├── 04_SERVICE_MODULE.md             # 售后服务模块设计                 │
│  ├── 05_MES_MODULE.md                 # MES模块设计                      │
│  ├── 09_FINANCE_MODULE.md             # 财务管理模块设计                 │
│  ├── 10_AUTH_MODULE.md                # 权限系统模块设计                 │
│  ├── 11_WORKFLOW_MODULE.md            # 审批工作流模块设计               │
│  ├── 12_SRM_MODULE.md                 # SRM供应商管理模块设计            │
│  └── 13_BI_MODULE.md                  # BI数据分析模块设计               │
│                                                                         │
│  第四层：技术规范                                                        │
│  ├── 06_DATABASE_SCHEMA.md            # 数据结构设计                     │
│  ├── 07_API_SPECIFICATION.md          # API接口规范                      │
│  └── 08_COMPONENT_LIBRARY.md          # 组件库设计                       │
│                                                                         │
│  第五层：应用架构                                                        │
│  ├── 14_WEBSITE_ARCHITECTURE.md       # 门户网站技术架构                 │
│  ├── 15_PORTAL_ARCHITECTURE.md        # 企业内部管理系统架构             │
│  └── 16_HARMONYOS_APP_ARCHITECTURE.md # 鸿蒙原生APP架构                  │
│                                                                         │
│  第六层：开发指南                                                        │
│  └── 17_WORKFLOW_DEVELOPMENT_GUIDE.md # 审批工作流开发指南               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 二、文档统一规范

### 2.1 文档头部规范

每个文档必须包含以下头部信息：

```markdown
# 道达智能数字化平台 - [模块名称]设计文档

> **版本**: v1.0  
> **设计日期**: YYYY-MM-DD  
> **模块名称**: [Module Name]  
> **模块代码**: `module-code`

---

## 一、模块概述

### 1.1 模块定位

[模块在企业数字化平台中的定位和作用]

### 1.2 设计目标

```
┌─────────────────────────────────────────────────────────────────┐
│                    [模块]设计目标                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎯 [核心目标1]                                                │
│     • [具体说明]                                                │
│                                                                 │
│  🚀 [核心目标2]                                                │
│     • [具体说明]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 主流系统对比分析

[国际国内主流系统对比表格]

### 1.4 最佳实践提炼

[从主流系统中提炼的最佳实践]

---

## 二、功能架构设计

### 2.1 功能模块总览

[功能模块树形结构图]

### 2.2 子模块详细设计

[各子模块的功能清单和实体定义]

---

## 三、数据库设计

### 3.1 核心表结构

[数据库表定义]

---

## 四、API接口设计

### 4.1 接口规范

[API接口定义]

---

## 五、页面设计

### 5.1 页面清单

[页面列表]

### 5.2 核心页面设计

[页面布局图]

---

## 六、开发计划

### 6.1 开发阶段

[开发时间表]

---

## 七、模块配置

### 7.1 模块定义

```typescript
// [module].module.ts

import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IModule, IModuleMetadata, IModuleRoute, IModulePermission, ModuleStatus } from '../../core/plugin';

@Module({...})
export class [Module]Module implements IModule, OnModuleInit, OnModuleDestroy {
  
  // 模块元数据
  static metadata: IModuleMetadata = {
    id: '[module-id]',
    name: '[模块名称]',
    version: '1.0.0',
    description: '[模块描述]',
    author: '道达智能',
    dependencies: [...],
    configSchema: {...},
    tags: [...],
    icon: '[icon]',
    enabled: true,
    loadOrder: [排序],
  };

  // 模块路由
  static routes: IModuleRoute[] = [...];

  // 模块权限
  static permissions: IModulePermission[] = [...];

  // 模块事件
  static events = [...];

  // 热插拔生命周期
  async onInstall(): Promise<void> {...}
  async onInit(): Promise<void> {...}
  async onStart(): Promise<void> {...}
  async onStop(): Promise<void> {...}
  async onUninstall(): Promise<void> {...}
  async onUpdate(from: string, to: string): Promise<void> {...}
  async onHealthCheck(): Promise<{ status: string }> {...}
}

### 7.2 模块扩展点

```typescript
// 扩展点定义
export interface I[Module]Extension {...}
```

---

> **文档维护**: 渔晓白  
> **最后更新**: YYYY-MM-DD
```

### 2.2 模块配置规范

每个模块必须包含以下配置：

#### 2.2.1 模块元数据 (metadata)

```typescript
interface IModuleMetadata {
  id: string;                    // 模块ID - 唯一标识
  name: string;                  // 模块名称
  version: string;               // 模块版本 - 语义化版本
  description: string;           // 模块描述
  author: string;                // 模块作者
  dependencies: IModuleDependency[];  // 模块依赖
  configSchema: object;          // 模块配置Schema
  tags: string[];                // 模块标签
  icon: string;                  // 模块图标
  enabled: boolean;              // 是否启用
  loadOrder: number;             // 加载顺序
}
```

#### 2.2.2 模块路由 (routes)

```typescript
interface IModuleRoute {
  path: string;                  // 路由路径
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;           // 路由描述
  permissions?: string[];        // 权限要求
  auth?: boolean;                // 是否需要认证
}
```

#### 2.2.3 模块权限 (permissions)

```typescript
interface IModulePermission {
  code: string;                  // 权限代码
  name: string;                  // 权限名称
  group: string;                 // 权限分组
  description?: string;          // 权限描述
}
```

#### 2.2.4 模块事件 (events)

```typescript
interface IModuleEvent {
  name: string;                  // 事件名称
  description: string;           // 事件描述
  payloadSchema?: object;        // 事件数据Schema
}
```

### 2.3 热插拔生命周期规范

每个模块必须实现以下生命周期钩子：

```typescript
interface IModuleLifecycle {
  // 首次安装时执行
  onInstall(): Promise<void>;
  
  // 每次启动时执行
  onInit(): Promise<void>;
  
  // 服务就绪后执行
  onStart(): Promise<void>;
  
  // 服务停止前执行
  onStop(): Promise<void>;
  
  // 移除模块时执行
  onUninstall(): Promise<void>;
  
  // 版本升级时执行
  onUpdate(fromVersion: string, toVersion: string): Promise<void>;
  
  // 健康检查
  onHealthCheck(): Promise<{ status: string; message?: string; details?: any }>;
}
```

### 2.4 扩展点规范

每个模块应定义扩展点接口：

```typescript
// 扩展点命名规范
// I + [功能] + Extension

// 示例
interface ICustomerExtension {
  // 扩展点方法
}

interface IOrderHandler {
  // 处理器方法
}

interface IReportGenerator {
  // 报表生成器
}
```

---

## 三、文档检查清单

### 3.1 必备章节

| 章节 | 必须 | 说明 |
|------|------|------|
| 模块概述 | ✅ | 模块定位、设计目标 |
| 主流系统对比 | ✅ | 国际国内对比分析 |
| 最佳实践提炼 | ✅ | 从主流系统提炼 |
| 功能架构设计 | ✅ | 功能模块树、子模块设计 |
| 数据库设计 | ✅ | 核心表结构 |
| API接口设计 | ✅ | 接口规范 |
| 页面设计 | ✅ | 页面清单、布局图 |
| 开发计划 | ✅ | 开发阶段、里程碑 |
| 模块配置 | ✅ | 元数据、路由、权限、事件、生命周期 |
| 扩展点定义 | ✅ | 扩展接口定义 |

### 3.2 质量检查

| 检查项 | 要求 |
|--------|------|
| 文档格式 | Markdown格式正确 |
| 代码示例 | TypeScript语法正确 |
| 图表格式 | ASCII图表清晰 |
| 表格格式 | 列对齐正确 |
| 链接引用 | 无死链 |
| 版本信息 | 有版本号和日期 |
| 命名规范 | 符合命名规范 |

---

## 四、现有文档检查结果

### 4.1 模块设计文档检查

| 文档 | 元数据 | 路由 | 权限 | 事件 | 生命周期 | 扩展点 |
|------|--------|------|------|------|----------|--------|
| 02_ERP_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 03_CRM_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 04_SERVICE_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 05_MES_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 09_FINANCE_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 10_AUTH_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 11_WORKFLOW_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 12_SRM_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |
| 13_BI_MODULE.md | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 | ✅ 已有 |

### 4.2 技术规范文档检查

| 文档 | 状态 | 说明 |
|------|------|------|
| 06_DATABASE_SCHEMA.md | ⚠️ 需补充 | 缺少模块配置规范 |
| 07_API_SPECIFICATION.md | ⚠️ 需补充 | 缺少模块配置规范 |
| 08_COMPONENT_LIBRARY.md | ⚠️ 需补充 | 缺少模块配置规范 |

### 4.3 应用架构文档检查

| 文档 | 状态 | 说明 |
|------|------|------|
| 14_WEBSITE_ARCHITECTURE.md | ⚠️ 需补充 | 缺少模块配置规范 |
| 15_PORTAL_ARCHITECTURE.md | ⚠️ 需补充 | 缺少模块配置规范 |
| 16_HARMONYOS_APP_ARCHITECTURE.md | ⚠️ 需补充 | 缺少模块配置规范 |

---

## 五、待完善文档清单

### 5.1 高优先级 ✅ 已完成

| 文档 | 需补充内容 | 状态 |
|------|------------|------|
| 02_ERP_MODULE.md | 模块配置、热插拔、扩展点 | ✅ 已完成 (2026-03-19) |
| 03_CRM_MODULE.md | 模块配置、热插拔、扩展点 | ✅ 已完成 (2026-03-19) |
| 04_SERVICE_MODULE.md | 模块配置、热插拔、扩展点 | ✅ 已完成 (2026-03-19) |
| 05_MES_MODULE.md | 模块配置、热插拔、扩展点 | ✅ 已完成 (2026-03-19) |

### 5.2 中优先级

| 文档 | 需补充内容 | 状态 |
|------|------------|------|
| 06_DATABASE_SCHEMA.md | 模块化规范说明 | ⏳ 待补充 |
| 07_API_SPECIFICATION.md | 模块化规范说明 | ⏳ 待补充 |
| 08_COMPONENT_LIBRARY.md | 模块化规范说明 | ⏳ 待补充 |

### 5.3 低优先级

| 文档 | 需补充内容 | 状态 |
|------|------------|------|
| 14_WEBSITE_ARCHITECTURE.md | 与后端模块关联说明 | ⏳ 待补充 |
| 15_PORTAL_ARCHITECTURE.md | 与后端模块关联说明 | ⏳ 待补充 |
| 16_HARMONYOS_APP_ARCHITECTURE.md | 与后端模块关联说明 | ⏳ 待补充 |

---

## 六、统一规范执行计划

### 6.1 执行步骤

```
Step 1: 按本文档规范，补充所有模块设计文档的模块配置章节
Step 2: 为技术规范文档添加模块化规范说明
Step 3: 为应用架构文档添加与后端模块的关联说明
Step 4: 生成文档索引文件
Step 5: 创建文档版本控制规范
```

### 6.2 文档版本控制

```yaml
# 文档版本规范

版本号格式: v{major}.{minor}.{patch}

- major: 重大变更，不兼容旧版本
- minor: 新增功能，兼容旧版本
- patch: 修复问题，兼容旧版本

示例:
- v1.0.0: 初始版本
- v1.1.0: 新增功能
- v1.1.1: 修复问题
- v2.0.0: 重大变更

每个文档变更需记录:
- 变更日期
- 变更内容
- 变更人
```

---

> **文档维护**: 渔晓白  
> **最后更新**: 2026-03-19
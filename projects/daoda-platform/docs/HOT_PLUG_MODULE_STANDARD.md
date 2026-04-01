# 热插拔模块开发规范

> 版本：v1.0.0  
> 适用项目：道达智能数字化平台 (daoda-platform)  
> 更新日期：2026-03-30

---

## 一、规范概述

### 1.1 目标

- 统一热插拔模块开发流程
- 确保模块可插拔、可热更新
- 提供标准化扩展点机制
- 支持模块依赖管理

### 1.2 适用范围

- 后端业务模块开发
- 前端页面模块开发
- 第三方系统集成模块

---

## 二、模块目录结构规范

### 2.1 后端模块结构

```
backend/src/modules/{module-name}/
├── {module-name}.module.ts       # 模块主文件（必须）
├── {module-name}.nest.module.ts  # NestJS 包装器（必须）
├── index.ts                      # 模块导出（必须）
├── module.yaml                   # 模块配置（可选）
├── services/                     # 业务服务（可选）
│   ├── {service-name}.service.ts
│   └── ...
├── controllers/                  # 控制器（可选）
│   ├── {controller-name}.controller.ts
│   └── ...
├── entities/                     # 数据实体（可选）
│   ├── {entity-name}.entity.ts
│   └── ...
├── dto/                          # 数据传输对象（可选）
│   ├── {dto-name}.dto.ts
│   └── ...
└── utils/                        # 工具函数（可选）
    └── {util-name}.ts
```

### 2.2 前端模块结构

```
portal/src/pages/{module-name}/
├── {Module-name}.tsx             # 模块入口页面（必须）
├── {Module-name}Dashboard.tsx    # 模块Dashboard（推荐）
├── {SubModule}List.tsx           # 子模块列表页
├── {SubModule}Detail.tsx         # 子模块详情页
├── components/                   # 模块专用组件（可选）
│   ├── {Component-name}.tsx
│   └── ...
├── hooks/                        # 模块专用Hooks（可选）
│   ├── use{Hook-name}.ts
│   └── ...
├── services/                     # 模块API服务（可选）
│   ├── {service-name}.service.ts
│   └── ...
└── types/                        # 模块类型定义（可选）
    ├── {type-name}.types.ts
    └── ...
```

---

## 三、模块清单规范

### 3.1 必填字段

```typescript
interface ModuleManifest {
  // 基本信息（必填）
  id: string;              // 模块唯一ID，格式：@daoda/{module-name}
  name: string;            // 模块显示名称
  version: string;         // 版本号，格式：x.y.z
  description: string;     // 模块描述
  
  // 分类（必填）
  category: ModuleCategory; // core | business | integration | addon
  
  // 依赖（必填，至少声明auth依赖）
  dependencies: ModuleDependency[];
  
  // 热更新配置（必填）
  hotUpdate: HotUpdateConfig;
}
```

### 3.2 可选字段

```typescript
interface ModuleManifest {
  // 可选字段
  tags?: string[];              // 模块标签
  author?: string;              // 作者
  license?: string;             // 许可证
  homepage?: string;            // 项目主页
  repository?: string;          // 代码仓库
  permissions?: string[];       // 权限声明（简化版）
  config?: ModuleConfigSchema;  // 配置项Schema
}
```

### 3.3 分类定义

| 分类 | 说明 | 示例 |
|------|------|------|
| `core` | 核心模块，系统必需 | auth, user, settings |
| `business` | 业务模块，可插拔 | crm, erp, finance, hr |
| `integration` | 集成模块，第三方对接 | dingtalk, wechat, email |
| `addon` | 扩展模块，可选功能 | report, import-export |

### 3.4 热更新策略

```typescript
enum HotUpdateStrategy {
  RESTART = 'restart',      // 重启模块（推荐）
  RELOAD = 'reload',        // 重载配置
  HOT_SWAP = 'hot-swap',    // 热替换代码（高级）
}
```

---

## 四、模块基类规范

### 4.1 继承 BaseModule

```typescript
import { BaseModule } from '../../core/module/base-module';
import { ModuleContext } from '../../core/module/interfaces';

export class MyModule extends BaseModule {
  // 模块清单
  readonly manifest = MY_MODULE_MANIFEST;

  // 生命周期钩子
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context);
    // 安装逻辑：数据表检查、默认配置、初始化数据
  }

  async onStart(): Promise<void> {
    await super.onStart();
    // 启动逻辑：服务注册、事件监听、定时任务
  }

  async onStop(): Promise<void> {
    await super.onStop();
    // 停止逻辑：资源释放、事件清理
  }

  async onUninstall(): Promise<void> {
    // 卸载逻辑：数据清理、配置删除
  }

  // 扩展点实现
  getRoutes(): ModuleRoute[] { return []; }
  getPermissions(): ModulePermission[] { return []; }
  getMenus(): ModuleMenuItem[] { return []; }
  getEvents(): ModuleEvent[] { return []; }
}
```

### 4.2 生命周期钩子规范

| 钩子 | 执行时机 | 用途 |
|------|----------|------|
| `onInstall` | 模块安装 | 数据表验证、默认配置、初始化数据 |
| `onStart` | 模块启动 | 服务注册、事件监听、定时任务启动 |
| `onStop` | 模块停止 | 定时任务停止、资源释放 |
| `onUninstall` | 模块卸载 | 数据清理、配置删除 |
| `onConfigChange` | 配置变更 | 配置热更新响应 |

---

## 五、扩展点规范

### 5.1 路由扩展点

```typescript
interface ModuleRoute {
  path: string;              // 路由路径，格式：/api/v1/{module}/{resource}
  method: HttpMethod;        // HTTP方法：GET | POST | PUT | DELETE | PATCH
  handler: string;           // 处理器标识：{resource}.{action}
  permission?: string;       // 权限标识：{module}:{resource}:{action}
  description?: string;      // 路由描述
  middleware?: string[];     // 中间件列表
  validate?: string;         // 请求验证Schema
}
```

#### 路由命名规范

```
/api/v1/{module}/{resource}          # 资源列表
/api/v1/{module}/{resource}/:id      # 单个资源
/api/v1/{module}/{resource}/:id/{sub-resource}  # 子资源
/api/v1/{module}/{action}            # 自定义操作
```

#### 示例

```typescript
getRoutes(): ModuleRoute[] {
  return [
    // 标准RESTful路由
    { path: '/api/v1/crm/customers', method: HttpMethod.GET, handler: 'customer.findAll', permission: 'crm:customer:view' },
    { path: '/api/v1/crm/customers/:id', method: HttpMethod.GET, handler: 'customer.findOne', permission: 'crm:customer:view' },
    { path: '/api/v1/crm/customers', method: HttpMethod.POST, handler: 'customer.create', permission: 'crm:customer:create' },
    { path: '/api/v1/crm/customers/:id', method: HttpMethod.PUT, handler: 'customer.update', permission: 'crm:customer:update' },
    { path: '/api/v1/crm/customers/:id', method: HttpMethod.DELETE, handler: 'customer.delete', permission: 'crm:customer:delete' },
    
    // 自定义操作路由
    { path: '/api/v1/crm/customers/:id/follow-ups', method: HttpMethod.GET, handler: 'customer.getFollowUps', permission: 'crm:customer:view' },
    { path: '/api/v1/crm/leads/:id/convert', method: HttpMethod.POST, handler: 'lead.convert', permission: 'crm:lead:convert' },
  ];
}
```

### 5.2 权限扩展点

```typescript
interface ModulePermission {
  id: string;                // 权限ID，格式：{module}:{resource}:{action}
  name: string;              // 权限显示名称
  type: PermissionType;      // 权限类型：RESOURCE | OPERATION | ADMIN
  resource?: string;         // 资源名称
  action?: string;           // 操作名称
  description?: string;      // 权限描述
}
```

#### 权限命名规范

```
{module}:{resource}:view     # 查看权限
{module}:{resource}:create   # 创建权限
{module}:{resource}:update   # 编辑权限
{module}:{resource}:delete   # 删除权限
{module}:{resource}:approve  # 审批权限
{module}:{resource}:export   # 导出权限
{module}:{resource}:admin    # 管理权限
```

#### 示例

```typescript
getPermissions(): ModulePermission[] {
  return [
    { id: 'crm:customer:view', name: '查看客户', type: PermissionType.RESOURCE, resource: 'customer', action: 'view' },
    { id: 'crm:customer:create', name: '创建客户', type: PermissionType.RESOURCE, resource: 'customer', action: 'create' },
    { id: 'crm:customer:update', name: '编辑客户', type: PermissionType.RESOURCE, resource: 'customer', action: 'edit' },
    { id: 'crm:customer:delete', name: '删除客户', type: PermissionType.RESOURCE, resource: 'customer', action: 'delete' },
    { id: 'crm:customer:export', name: '导出客户', type: PermissionType.OPERATION, resource: 'customer', action: 'export' },
    { id: 'crm:admin', name: 'CRM管理员', type: PermissionType.ADMIN },
  ];
}
```

### 5.3 菜单扩展点

```typescript
interface ModuleMenuItem {
  id: string;                // 菜单ID，格式：{module}-{menu}
  title: string;             // 菜单标题
  path: string;              // 菜单路由
  icon?: string;             // 菜单图标
  order?: number;            // 排序权重
  permissions?: string[];    // 所需权限
  children?: ModuleMenuItem[]; // 子菜单
  badge?: string | number;   // 菜单徽标
  hidden?: boolean;          // 是否隐藏
}
```

#### 菜单命名规范

```
{module}                  # 模块主菜单
{module}-{resource}       # 资源菜单
{module}-{action}         # 操作菜单
{module}-{dashboard}      # Dashboard菜单
```

#### 示例

```typescript
getMenus(): ModuleMenuItem[] {
  return [
    {
      id: 'crm',
      title: 'CRM客户管理',
      path: '/crm',
      icon: 'team',
      order: 2,
      children: [
        { id: 'crm-dashboard', title: 'CRM概览', path: '/crm/dashboard', icon: 'dashboard', order: 0 },
        { id: 'crm-customer', title: '客户管理', path: '/crm/customers', icon: 'user', permissions: ['crm:customer:view'], order: 1 },
        { id: 'crm-lead', title: '线索管理', path: '/crm/leads', icon: 'phone', permissions: ['crm:lead:view'], order: 2 },
        { id: 'crm-opportunity', title: '商机管理', path: '/crm/opportunities', icon: 'dollar', permissions: ['crm:opportunity:view'], order: 3 },
        { id: 'crm-order', title: '订单管理', path: '/crm/orders', icon: 'shopping', permissions: ['crm:order:view'], order: 4 },
        { id: 'crm-quotation', title: '报价管理', path: '/crm/quotations', icon: 'file-text', permissions: ['crm:quotation:view'], order: 5 },
        { id: 'crm-analysis', title: '销售分析', path: '/crm/analysis', icon: 'bar-chart', permissions: ['crm:analysis:view'], order: 6 },
      ],
    },
  ];
}
```

### 5.4 事件扩展点

```typescript
interface ModuleEvent {
  name: string;              // 事件名称，格式：{module}.{resource}.{action}
  type: EventType;           // 事件类型
  description?: string;      // 事件描述
  payloadSchema?: object;    // 事件Payload Schema
}
```

#### 事件类型定义

```typescript
enum EventType {
  BUSINESS_DATA = 'business_data',   // 业务数据事件（创建/更新/删除）
  USER_BEHAVIOR = 'user_behavior',   // 用户行为事件（登录/操作）
  SYSTEM = 'system',                 // 系统事件（启动/停止/错误）
  EXTERNAL = 'external',             // 外部集成事件（同步/回调）
  MODULE = 'module',                 // 模块事件（安装/启动/卸载）
}
```

#### 事件命名规范

```
{module}.{resource}.created     # 资源创建事件
{module}.{resource}.updated     # 资源更新事件
{module}.{resource}.deleted     # 资源删除事件
{module}.{resource}.{action}    # 自定义操作事件
{module}.module.started         # 模块启动事件
{module}.module.stopped         # 模块停止事件
```

#### 示例

```typescript
getEvents(): ModuleEvent[] {
  return [
    { name: 'crm.customer.created', type: EventType.BUSINESS_DATA, description: '客户创建事件' },
    { name: 'crm.customer.updated', type: EventType.BUSINESS_DATA, description: '客户更新事件' },
    { name: 'crm.customer.deleted', type: EventType.BUSINESS_DATA, description: '客户删除事件' },
    { name: 'crm.lead.created', type: EventType.BUSINESS_DATA, description: '线索创建事件' },
    { name: 'crm.lead.converted', type: EventType.BUSINESS_DATA, description: '线索转化事件' },
    { name: 'crm.opportunity.closed', type: EventType.BUSINESS_DATA, description: '商机关闭事件' },
    { name: 'crm.module.started', type: EventType.MODULE, description: 'CRM模块启动' },
    { name: 'crm.module.stopped', type: EventType.MODULE, description: 'CRM模块停止' },
  ];
}
```

---

## 六、依赖管理规范

### 6.1 依赖声明

```typescript
interface ModuleDependency {
  id: string;                // 依赖模块ID
  version: string;           // 版本要求，格式：>=x.y.z | ^x.y.z | ~x.y.z
  optional?: boolean;        // 是否可选依赖
}
```

### 6.2 版本范围语法

| 语法 | 说明 | 示例 |
|------|------|------|
| `>=1.0.0` | 大于等于指定版本 | `>=1.0.0` |
| `^1.0.0` | 兼容版本（主版本相同） | `^1.2.0` 允许 1.2.x |
| `~1.0.0` | 近似版本（主+次版本相同） | `~1.2.0` 允许 1.2.0-x |
| `1.0.0` | 精确版本 | `1.0.0` |

### 6.3 依赖示例

```typescript
dependencies: [
  // 核心依赖（必须）
  { id: '@daoda/auth', version: '>=1.0.0' },
  { id: '@daoda/user', version: '>=1.0.0' },
  
  // 业务依赖（可选）
  { id: '@daoda/crm', version: '>=1.0.0', optional: true },
  { id: '@daoda/erp', version: '>=1.0.0', optional: true },
  
  // 集成依赖（可选）
  { id: '@daoda/dingtalk', version: '>=1.0.0', optional: true },
],
```

---

## 七、配置管理规范

### 7.1 配置Schema定义

```typescript
interface ModuleConfigSchema {
  [key: string]: ConfigItem;
}

interface ConfigItem {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  title: string;             // 配置项标题
  description?: string;      // 配置项描述
  default?: any;             // 默认值
  required?: boolean;        // 是否必填
  enum?: any[];              // 可选值列表
  minimum?: number;          // 最小值（数字）
  maximum?: number;          // 最大值（数字）
  pattern?: string;          // 正则校验（字符串）
}
```

### 7.2 配置示例

```typescript
config: {
  poolRules: {
    type: 'object',
    title: '公海规则',
    description: '客户公海池回收规则',
    default: { recycleDays: 30 },
    properties: {
      recycleDays: { type: 'number', title: '回收天数', default: 30, minimum: 7, maximum: 90 },
      autoRecycle: { type: 'boolean', title: '自动回收', default: true },
    },
  },
  customerLevels: {
    type: 'array',
    title: '客户等级',
    description: '客户等级分类',
    default: ['VIP', 'A', 'B', 'C', 'D'],
    items: { type: 'string' },
  },
},
```

---

## 八、第三方集成规范

### 8.1 集成模块结构

```typescript
interface IntegrationModule extends BaseModule {
  // 集成配置
  integrationConfig: {
    provider: string;        // 服务提供商名称
    authType: 'oauth2' | 'apikey' | 'basic' | 'signature';
    endpoints: Record<string, string>; // API端点映射
    syncConfig: SyncConfig;  // 同步配置
  };
  
  // 同步配置
  syncConfig: {
    enabled: boolean;        // 是否启用同步
    schedule?: string;       // 同步计划（Cron表达式）
    batchSize?: number;      // 批量大小
    retryPolicy?: RetryPolicy; // 重试策略
  };
}
```

### 8.2 OAuth2 集成示例

```typescript
// 钉钉集成示例
integrationConfig: {
  provider: 'dingtalk',
  authType: 'oauth2',
  endpoints: {
    auth: 'https://login.dingtalk.com/oauth2/auth',
    token: 'https://api.dingtalk.com/v1.0/oauth2/userAccessToken',
    user: 'https://api.dingtalk.com/v1.0/contact/users/me',
    department: 'https://api.dingtalk.com/v1.0/contact/departments',
  },
  syncConfig: {
    enabled: true,
    schedule: '0 0 2 * * ?', // 每天凌晨2点同步
    batchSize: 100,
    retryPolicy: { maxRetries: 3, retryDelay: 5000 },
  },
},
```

---

## 九、代码规范

### 9.1 TypeScript 规范

| 规则 | 说明 |
|------|------|
| 严格模式 | `strict: true` |
| 类型导出 | 所有接口、枚举必须 `export` |
| 类型命名 | PascalCase（接口、枚举、类） |
| 变量命名 | camelCase |
| 常量命名 | UPPER_SNAKE_CASE |
| 文件命名 | 小写kebab-case |

### 9.2 注释规范

```typescript
/**
 * 模块主文件
 * 实现XXX模块核心功能
 * 
 * @version 1.0.0
 * @since 2026-03-30
 * @author 渔晓白
 */

// ============================================
// 区块标题（使用此格式分隔代码区块）
// ============================================

/**
 * 函数说明
 * @param param1 参数说明
 * @returns 返回值说明
 */
function myFunction(param1: string): void {}
```

### 9.3 错误处理规范

```typescript
// 统一错误处理
try {
  await someOperation();
} catch (error) {
  this.logger?.error('操作失败', { error, context: 'operation-name' });
  throw new ModuleError('MODULE_ERROR_CODE', '操作失败，请稍后重试', { originalError: error });
}

// 错误类定义
class ModuleError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

---

## 十、测试规范

### 10.1 单元测试

```typescript
describe('MyModule', () => {
  let module: MyModule;
  let mockContext: ModuleContext;

  beforeEach(() => {
    module = new MyModule();
    mockContext = createMockContext();
  });

  describe('生命周期', () => {
    it('应该正确安装模块', async () => {
      await module.onInstall(mockContext);
      expect(module.isInstalled).toBe(true);
    });
  });

  describe('扩展点', () => {
    it('应该返回正确的路由', () => {
      const routes = module.getRoutes();
      expect(routes.length).toBeGreaterThan(0);
    });
  });
});
```

### 10.2 测试覆盖率要求

| 指标 | 最低要求 |
|------|----------|
| 语句覆盖率 | 70% |
| 分支覆盖率 | 60% |
| 函数覆盖率 | 80% |
| 行覆盖率 | 70% |

---

## 十一、文档规范

### 11.1 模块文档结构

```
docs/modules/{module-name}/
├── README.md                  # 模块概述
├── API.md                     # API文档
├── PERMISSIONS.md             # 权限说明
├── CONFIG.md                  # 配置说明
├── EVENTS.md                  # 事件说明
├── INTEGRATION.md             # 集成说明（可选）
└── CHANGELOG.md               # 更新日志
```

### 11.2 README模板

```markdown
# {模块名称}

## 概述

{模块简介}

## 功能列表

| 功能 | 状态 | 说明 |
|------|------|------|

## 安装

\`\`\`bash
# 安装命令
\`\`\`

## 配置

{配置说明}

## API

{API端点列表}

## 权限

{权限列表}

## 事件

{事件列表}

## 更新日志

见 [CHANGELOG.md](./CHANGELOG.md)
```

---

## 十二、发布规范

### 12.1 版本号规则

遵循 Semantic Versioning：

- `MAJOR.MINOR.PATCH`
- MAJOR：重大变更（不兼容）
- MINOR：功能新增（兼容）
- PATCH：问题修复（兼容）

### 12.2 发布检查清单

| 检查项 | 说明 |
|------|------|
| 编译成功 | 无编译错误 |
| 测试通过 | 单元测试覆盖率达标 |
| 文档完整 | README、API文档齐全 |
| 配置验证 | 默认配置可用 |
| 依赖兼容 | 依赖版本正确 |
| 权限定义 | 权限配置完整 |
| 菜单正常 | 菜单路由可访问 |

---

_热插拔模块开发规范 v1.0.0 - 2026-03-30_
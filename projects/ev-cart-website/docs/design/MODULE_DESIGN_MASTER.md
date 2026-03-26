# 道达智能数字化平台 - 系统模块设计开发文档

> **版本**: v1.0  
> **设计日期**: 2026-03-17  
> **设计理念**: 模块化 · 热插拔 · 标准化 · 可扩展  
> **适用范围**: ERP、CRM、售后服务、生产执行系统

---

## 📋 文档索引

| 文档 | 说明 | 路径 |
|------|------|------|
| 总体架构设计 | 系统架构、技术选型、开发规范 | `MODULE_DESIGN_MASTER.md` (本文档) |
| ERP模块设计 | 采购、库存、生产、质量、设备 | `MODULE_DESIGN_ERP.md` |
| CRM模块设计 | 客户、线索、商机、订单、分析 | `MODULE_DESIGN_CRM.md` |
| 售后服务模块设计 | 工单、合同、配件、反馈、知识库 | `MODULE_DESIGN_SERVICE.md` |
| MES模块设计 | 生产计划、工单、工序、追溯、报表 | `MODULE_DESIGN_MES.md` |
| 数据结构设计 | 数据库表结构、字段定义、索引 | `MODULE_DESIGN_DATABASE.md` |
| API接口设计 | RESTful API、GraphQL、WebSocket | `MODULE_DESIGN_API.md` |
| 组件库设计 | UI组件、业务组件、图表组件 | `MODULE_DESIGN_COMPONENTS.md` |

---

## 一、主流系统对比分析

### 1.1 ERP系统对比

#### 国际主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **SAP S/4HANA** | • 功能最全面，行业解决方案丰富<br>• 实时内存计算，性能卓越<br>• 流程标准化程度高<br>• 全球化支持完善 | • 实施成本极高<br>• 定制开发复杂<br>• 学习曲线陡峭<br>• 对中小企业不友好 | 大型跨国企业 |
| **Oracle Cloud ERP** | • 云原生架构<br>• 财务模块强大<br>• AI/ML集成<br>• 供应链管理优秀 | • 价格昂贵<br>• 本地化支持较弱<br>• 升级迁移复杂 | 大型企业 |
| **Microsoft Dynamics 365** | • 与Office深度集成<br>• 低代码平台<br>• 部署灵活<br>• 性价比高 | • 深度功能不如SAP<br>• 行业模板有限 | 中型企业 |

#### 国内主流

| 系统 | 优势 | 办势 | 适用场景 |
|------|------|------|----------|
| **用友 U8/NC** | • 本地化程度高<br>• 财务模块成熟<br>• 服务网络完善<br>• 政企市场占有率高 | • 技术架构较老<br>• 移动端体验一般<br>• 二次开发成本高 | 国有企业、制造业 |
| **金蝶 K/3 Cloud** | • 云原生架构<br>• 财务起家，专业性强<br>• 中小企业友好<br>• 价格适中 | • 深度制造功能不足<br>• 行业解决方案有限 | 中小企业 |
| **鼎捷 T100** | • 制造业深耕<br>• 生产管理细化<br>• 行业版本丰富 | • 界面陈旧<br>• 移动化不足 | 制造企业 |

#### 最佳实践提炼

```
✅ 采纳要点：

[架构层面]
• SAP: 模块化架构设计，各模块可独立运行
• Oracle: 云原生、微服务架构
• 金蝶: 云原生、前后端分离

[功能层面]
• SAP: 财务业务一体化、多会计准则
• 用友: 本地化财务、税务集成
• 鼎捷: 生产过程精细化管控

[用户体验]
• Microsoft: Office风格、低代码
• 金蝶: 移动端优先

[技术层面]
• Oracle: 内存计算、实时分析
• 金蝶: 云原生、容器化部署
```

---

### 1.2 CRM系统对比

#### 国际主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **Salesforce** | • 功能最强大<br>• 生态系统完善(AppExchange)<br>• AI能力领先(Einstein)<br>• 高度可定制 | • 价格昂贵<br>• 本地化不足<br>• 数据合规风险 | 大型企业、外企 |
| **HubSpot** | • 营销自动化强大<br>• 免费版功能丰富<br>• 用户体验优秀<br>• 内容营销集成 | • 企业级功能不足<br>• 中文支持有限 | 中小企业、SaaS |
| **Microsoft Dynamics 365 Sales** | • 与Outlook/Teams集成<br>• 生态完善<br>• 本地部署可选 | • 配置复杂<br>• 移动端体验一般 | 微软生态企业 |

#### 国内主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **纷享销客** | • 移动端体验好<br>• 本地化服务<br>• 企业微信集成<br>• 价格适中 | • 深度分析能力有限<br>• 行业定制不足 | 中小企业、快消行业 |
| **销售易** | • 销售流程专业<br>• 移动CRM领先<br>• AI能力有亮点 | • 营销自动化较弱<br>• 服务体系待完善 | B2B销售企业 |
| **神州云动 CloudCC** | • PaaS平台灵活<br>• 行业解决方案多 | • 品牌影响力不足<br>• 生态建设待加强 | 中型企业 |

#### 最佳实践提炼

```
✅ 采纳要点：

[客户管理]
• Salesforce: 360°客户视图、客户分层
• 纷享销客: 移动端客户拜访、外勤管理

[销售流程]
• 销售易: 销售阶段标准化、预测分析
• Salesforce: 线索到现金(L2C)全流程

[营销自动化]
• HubSpot: 邮件营销、表单落地页
• Salesforce: 多渠道营销、ROI分析

[数据分析]
• Salesforce Einstein: AI预测、智能推荐
• 销售易: 销售漏斗、转化分析

[协作能力]
• Microsoft: Teams集成、实时协作
• 纷享销客: 企业微信集成
```

---

### 1.3 售后服务系统对比

#### 国际主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **ServiceNow** | • ITSM领域领导者<br>• 工作流引擎强大<br>• 企业级功能完善<br>• 可扩展性强 | • 价格昂贵<br>• 实施复杂<br>• 非IT场景适配有限 | 大型企业IT服务 |
| **Zendesk** | • 多渠道整合<br>• 用户体验优秀<br>• AI机器人成熟<br>• 知识库强大 | • 现场服务功能弱<br>• 中文本地化不足 | 在线客服、SaaS |
| **Freshdesk** | • 免费版功能多<br>• 易用性好<br>• 多渠道支持 | • 企业级功能有限<br>• API限制多 | 中小企业 |

#### 国内主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **七陌云客服** | • 多渠道整合<br>• 呼叫中心集成<br>• 智能质检 | • 现场服务不足 | 电商、教育 |
| **容联七陌** | • 通信能力强<br>• 呼叫中心专业 | • CRM集成有限 | 客服中心 |
| **网易七鱼** | • 智能机器人<br>• 稳定性好 | • 定制能力有限 | 中小企业 |

#### 最佳实践提炼

```
✅ 采纳要点：

[工单管理]
• ServiceNow: 工作流引擎、SLA管理
• Zendesk: 多渠道工单、自动分配

[知识库]
• Zendesk: 知识文章、智能推荐
• ServiceNow: 知识管理、版本控制

[现场服务]
• ServiceNow: 现场工程师调度、移动APP
• 需自研: 针对制造业的现场服务

[多渠道支持]
• Zendesk: 邮件、电话、聊天、社交
• 七陌: 微信、小程序、企业微信

[智能客服]
• Zendesk Answer Bot: AI自动回复
• 网易七鱼: 智能对话、意图识别
```

---

### 1.4 MES生产执行系统对比

#### 国际主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **Siemens Opcenter** | • 功能最全面<br>• 与PLM/ERP集成<br>• 行业模板丰富<br>• 实时监控强 | • 价格极高<br>• 实施周期长<br>• 本地化服务有限 | 大型制造企业 |
| **Rockwell FactoryTalk** | • 自动化集成深<br>• 实时数据采集<br>• OEE分析专业 | • 配置复杂<br>• 非制造功能弱 | 离散制造 |
| **SAP ME/MII** | • 与SAP ERP无缝<br>• 企业级架构 | • 需要SAP生态<br>• 灵活性不足 | SAP用户企业 |

#### 国内主流

| 系统 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **宝信软件** | • 钢铁行业深耕<br>• 本地化服务<br>• 国产化适配 | • 行业局限<br>• 通用性不足 | 流程制造 |
| **中控技术** | • 流程工业专业<br>• DCS集成<br>• 国产化 | • 离散制造弱 | 化工、制药 |
| **华磊迅拓** | • 性价比高<br>• 行业适配 | • 品牌影响力有限 | 中小制造 |

#### 最佳实践提炼

```
✅ 采纳要点：

[生产计划]
• SAP ME: 与ERP集成、排产优化
• Siemens: 高级排产(APS)

[生产执行]
• Siemens: 工单管理、工序执行
• Rockwell: 实时数据采集

[质量管理]
• Siemens: 质量追溯、SPC分析
• 宝信: 质检流程、不合格处理

[设备管理]
• Rockwell: 设备监控、OEE分析
• 中控: 预测性维护

[追溯管理]
• Siemens: 全流程追溯、批次管理
• 华磊: 二维码追溯
```

---

## 二、系统架构设计

### 2.1 总体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           道达智能数字化平台                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      前端展示层 (Frontend)                        │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │  官网   │  │  门户   │  │ 移动APP │  │ 小程序  │          │   │
│  │   │Website  │  │ Portal  │  │ Mobile  │  │ MiniApp │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  │   技术栈: React 18 + TypeScript + Vite + Ant Design 5          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      API网关层 (Gateway)                         │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │  Kong / APISIX / Nginx                                  │  │   │
│  │   │  • 路由转发  • 负载均衡  • 限流熔断  • 认证鉴权         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      业务服务层 (Services)                       │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │   ERP   │  │   CRM   │  │ Service │  │   MES   │          │   │
│  │   │  模块   │  │  模块   │  │  模块   │  │  模块   │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │  Auth   │  │ Workflow│  │ Message │  │ Report  │          │   │
│  │   │  认证   │  │  工作流  │  │  消息   │  │  报表   │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  │   技术栈: NestJS 10 + TypeScript + Prisma ORM                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      数据存储层 (Data)                           │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │ PostgreSQL│  │   Redis   │  │  MinIO    │                 │   │
│  │   │  主数据库  │  │  缓存/队列 │  │  文件存储  │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │ ClickHouse│  │ ElasticSearch│ │   MQ     │                 │   │
│  │   │  分析数据库│  │   搜索引擎  │  │ 消息队列  │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 模块化架构设计

#### 核心原则

```
┌─────────────────────────────────────────────────────────────────┐
│                      模块化设计原则                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 高内聚低耦合                                               │
│     • 每个模块职责单一                                          │
│     • 模块间通过标准接口通信                                    │
│     • 最小化模块间依赖                                          │
│                                                                 │
│  2️⃣ 独立部署                                                   │
│     • 每个模块可独立部署为微服务                                │
│     • 支持容器化 (Docker/Kubernetes)                            │
│     • 模块可水平扩展                                            │
│                                                                 │
│  3️⃣ 热插拔热更新                                                │
│     • 模块动态加载/卸载                                         │
│     • 无停机更新                                                │
│     • 版本回滚支持                                              │
│                                                                 │
│  4️⃣ 统一规范                                                   │
│     • 标准化的模块接口                                          │
│     • 统一的数据格式                                            │
│     • 一致的错误处理                                            │
│                                                                 │
│  5️⃣ 可观测性                                                   │
│     • 统一日志格式                                              │
│     • 标准监控指标                                              │
│     • 链路追踪支持                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 模块结构规范

```
module/
├── src/
│   ├── controllers/          # 控制器 - HTTP接口
│   │   ├── index.ts
│   │   └── *.controller.ts
│   │
│   ├── services/             # 服务 - 业务逻辑
│   │   ├── index.ts
│   │   └── *.service.ts
│   │
│   ├── repositories/         # 仓储 - 数据访问
│   │   ├── index.ts
│   │   └── *.repository.ts
│   │
│   ├── entities/             # 实体 - 数据模型
│   │   ├── index.ts
│   │   └── *.entity.ts
│   │
│   ├── dto/                  # DTO - 数据传输对象
│   │   ├── index.ts
│   │   ├── create-*.dto.ts
│   │   ├── update-*.dto.ts
│   │   └── query-*.dto.ts
│   │
│   ├── events/               # 事件 - 领域事件
│   │   ├── index.ts
│   │   └── *.event.ts
│   │
│   ├── subscribers/          # 订阅者 - 事件处理
│   │   ├── index.ts
│   │   └── *.subscriber.ts
│   │
│   ├── guards/               # 守卫 - 权限控制
│   │   └── *.guard.ts
│   │
│   ├── interceptors/         # 拦截器 - 请求处理
│   │   └── *.interceptor.ts
│   │
│   ├── pipes/                # 管道 - 数据验证
│   │   └── *.pipe.ts
│   │
│   ├── decorators/           # 装饰器 - 自定义装饰
│   │   └── *.decorator.ts
│   │
│   ├── utils/                # 工具函数
│   │   └── *.util.ts
│   │
│   ├── constants/            # 常量定义
│   │   └── *.constant.ts
│   │
│   ├── interfaces/           # 接口定义
│   │   └── *.interface.ts
│   │
│   ├── types/                # 类型定义
│   │   └── *.d.ts
│   │
│   ├── config/               # 模块配置
│   │   └── *.config.ts
│   │
│   └── index.ts              # 模块导出
│
├── test/                     # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                     # 模块文档
│   ├── README.md
│   ├── API.md
│   └── CHANGELOG.md
│
├── migrations/               # 数据库迁移
│   └── *.migration.ts
│
├── module.module.ts          # 模块定义
├── module.plugin.ts          # 插件定义(热插拔)
├── package.json              # 模块依赖
├── tsconfig.json             # TS配置
└── README.md                 # 模块说明
```

#### 模块接口规范

```typescript
// ============================================
// 模块接口规范 - 所有模块必须实现
// ============================================

/**
 * 模块元数据接口
 */
interface IModuleMetadata {
  /** 模块ID - 唯一标识 */
  id: string;
  /** 模块名称 */
  name: string;
  /** 模块版本 - 语义化版本 */
  version: string;
  /** 模块描述 */
  description: string;
  /** 模块作者 */
  author: string;
  /** 模块依赖 */
  dependencies?: IModuleDependency[];
  /** 模块配置Schema */
  configSchema?: object;
  /** 模块标签 */
  tags?: string[];
  /** 模块图标 */
  icon?: string;
  /** 是否启用 */
  enabled: boolean;
  /** 加载顺序 */
  loadOrder?: number;
}

/**
 * 模块依赖接口
 */
interface IModuleDependency {
  /** 依赖模块ID */
  moduleId: string;
  /** 版本范围 */
  versionRange: string;
  /** 是否必需 */
  required: boolean;
}

/**
 * 模块生命周期接口
 */
interface IModuleLifecycle {
  /** 模块安装 - 首次安装时执行 */
  onInstall?(): Promise<void>;
  
  /** 模块初始化 - 每次启动时执行 */
  onInit?(): Promise<void>;
  
  /** 模块启动 - 服务就绪后执行 */
  onStart?(): Promise<void>;
  
  /** 模块停止 - 服务停止前执行 */
  onStop?(): Promise<void>;
  
  /** 模块卸载 - 移除模块时执行 */
  onUninstall?(): Promise<void>;
  
  /** 模块更新 - 版本升级时执行 */
  onUpdate?(fromVersion: string, toVersion: string): Promise<void>;
  
  /** 健康检查 */
  onHealthCheck?(): Promise<IHealthCheckResult>;
}

/**
 * 模块API接口
 */
interface IModuleAPI {
  /** 获取模块信息 */
  getInfo(): IModuleMetadata;
  
  /** 获取模块配置 */
  getConfig(): Record<string, any>;
  
  /** 更新模块配置 */
  updateConfig(config: Record<string, any>): Promise<void>;
  
  /** 获取模块状态 */
  getStatus(): IModuleStatus;
  
  /** 获取模块路由 */
  getRoutes(): IModuleRoute[];
  
  /** 获取模块事件 */
  getEvents(): IModuleEvent[];
  
  /** 获取模块权限 */
  getPermissions(): IModulePermission[];
}

/**
 * 模块完整接口
 */
interface IModule extends IModuleMetadata, IModuleLifecycle, IModuleAPI {
  /** 模块实例 */
  instance?: any;
}

/**
 * 模块状态枚举
 */
enum ModuleStatus {
  UNINSTALLED = 'uninstalled',  // 未安装
  INSTALLED = 'installed',      // 已安装
  LOADING = 'loading',          // 加载中
  ACTIVE = 'active',            // 活跃
  INACTIVE = 'inactive',        // 非活跃
  ERROR = 'error',              // 错误
  UPDATING = 'updating',        // 更新中
}

/**
 * 模块路由接口
 */
interface IModuleRoute {
  /** 路由路径 */
  path: string;
  /** HTTP方法 */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** 路由描述 */
  description: string;
  /** 权限要求 */
  permissions?: string[];
  /** 是否需要认证 */
  auth?: boolean;
}

/**
 * 模块事件接口
 */
interface IModuleEvent {
  /** 事件名称 */
  name: string;
  /** 事件描述 */
  description: string;
  /** 事件数据Schema */
  payloadSchema?: object;
}

/**
 * 模块权限接口
 */
interface IModulePermission {
  /** 权限代码 */
  code: string;
  /** 权限名称 */
  name: string;
  /** 权限描述 */
  description: string;
  /** 权限分组 */
  group?: string;
}

/**
 * 健康检查结果
 */
interface IHealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: Record<string, any>;
}
```

### 2.3 热插拔架构实现

```typescript
// ============================================
// 热插拔管理器 - 核心实现
// ============================================

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PluginManager implements OnModuleInit {
  private readonly logger = new Logger(PluginManager.name);
  private readonly modules: Map<string, IModule> = new Map();
  private readonly loadingOrder: string[] = [];

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.loadEnabledModules();
  }

  /**
   * 注册模块
   */
  async registerModule(module: IModule): Promise<void> {
    // 验证模块元数据
    this.validateModule(module);

    // 检查依赖
    await this.checkDependencies(module);

    // 注册模块
    this.modules.set(module.id, module);
    this.logger.log(`Module registered: ${module.id}@${module.version}`);
  }

  /**
   * 加载模块
   */
  async loadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    if (module.getStatus() === ModuleStatus.ACTIVE) {
      this.logger.warn(`Module already active: ${moduleId}`);
      return;
    }

    try {
      // 更新状态
      this.updateModuleStatus(moduleId, ModuleStatus.LOADING);

      // 执行初始化
      if (module.onInit) {
        await module.onInit();
      }

      // 执行启动
      if (module.onStart) {
        await module.onStart();
      }

      // 更新状态
      this.updateModuleStatus(moduleId, ModuleStatus.ACTIVE);
      this.loadingOrder.push(moduleId);

      // 发送事件
      this.eventEmitter.emit('module.loaded', { moduleId });

      this.logger.log(`Module loaded: ${moduleId}`);
    } catch (error) {
      this.updateModuleStatus(moduleId, ModuleStatus.ERROR);
      this.logger.error(`Failed to load module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * 卸载模块
   */
  async unloadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    // 检查是否有其他模块依赖此模块
    const dependents = this.getDependentModules(moduleId);
    if (dependents.length > 0) {
      throw new Error(
        `Cannot unload module ${moduleId}: other modules depend on it: ${dependents.join(', ')}`
      );
    }

    try {
      // 执行停止
      if (module.onStop) {
        await module.onStop();
      }

      // 更新状态
      this.updateModuleStatus(moduleId, ModuleStatus.INACTIVE);
      
      // 从加载顺序中移除
      const index = this.loadingOrder.indexOf(moduleId);
      if (index > -1) {
        this.loadingOrder.splice(index, 1);
      }

      // 发送事件
      this.eventEmitter.emit('module.unloaded', { moduleId });

      this.logger.log(`Module unloaded: ${moduleId}`);
    } catch (error) {
      this.logger.error(`Failed to unload module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * 更新模块
   */
  async updateModule(moduleId: string, newModule: IModule): Promise<void> {
    const oldModule = this.modules.get(moduleId);
    if (!oldModule) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    const isActive = oldModule.getStatus() === ModuleStatus.ACTIVE;

    try {
      // 更新状态
      this.updateModuleStatus(moduleId, ModuleStatus.UPDATING);

      // 如果模块活跃，先停止
      if (isActive && oldModule.onStop) {
        await oldModule.onStop();
      }

      // 执行更新
      if (newModule.onUpdate) {
        await newModule.onUpdate(oldModule.version, newModule.version);
      }

      // 替换模块
      this.modules.set(moduleId, newModule);

      // 如果之前活跃，重新启动
      if (isActive) {
        if (newModule.onStart) {
          await newModule.onStart();
        }
        this.updateModuleStatus(moduleId, ModuleStatus.ACTIVE);
      }

      // 发送事件
      this.eventEmitter.emit('module.updated', { 
        moduleId, 
        fromVersion: oldModule.version,
        toVersion: newModule.version 
      });

      this.logger.log(
        `Module updated: ${moduleId} ${oldModule.version} -> ${newModule.version}`
      );
    } catch (error) {
      this.updateModuleStatus(moduleId, ModuleStatus.ERROR);
      this.logger.error(`Failed to update module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * 安装模块
   */
  async installModule(module: IModule): Promise<void> {
    // 注册模块
    await this.registerModule(module);

    // 执行安装
    if (module.onInstall) {
      await module.onInstall();
    }

    // 加载模块
    await this.loadModule(module.id);

    this.logger.log(`Module installed: ${module.id}`);
  }

  /**
   * 卸载并移除模块
   */
  async uninstallModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    // 卸载模块
    await this.unloadModule(moduleId);

    // 执行卸载
    if (module.onUninstall) {
      await module.onUninstall();
    }

    // 移除模块
    this.modules.delete(moduleId);

    this.logger.log(`Module uninstalled: ${moduleId}`);
  }

  /**
   * 获取所有模块
   */
  getModules(): IModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * 获取模块
   */
  getModule(moduleId: string): IModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * 获取模块状态
   */
  getModuleStatus(moduleId: string): ModuleStatus {
    const module = this.modules.get(moduleId);
    return module?.getStatus() || ModuleStatus.UNINSTALLED;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<Record<string, IHealthCheckResult>> {
    const results: Record<string, IHealthCheckResult> = {};

    for (const [id, module] of this.modules) {
      if (module.getStatus() === ModuleStatus.ACTIVE && module.onHealthCheck) {
        results[id] = await module.onHealthCheck();
      }
    }

    return results;
  }

  // ========== 私有方法 ==========

  private validateModule(module: IModule): void {
    if (!module.id) throw new Error('Module ID is required');
    if (!module.name) throw new Error('Module name is required');
    if (!module.version) throw new Error('Module version is required');
  }

  private async checkDependencies(module: IModule): Promise<void> {
    if (!module.dependencies) return;

    for (const dep of module.dependencies) {
      const depModule = this.modules.get(dep.moduleId);
      
      if (!depModule && dep.required) {
        throw new Error(`Required dependency not found: ${dep.moduleId}`);
      }

      if (depModule && depModule.getStatus() !== ModuleStatus.ACTIVE && dep.required) {
        throw new Error(`Required dependency not active: ${dep.moduleId}`);
      }
    }
  }

  private getDependentModules(moduleId: string): string[] {
    const dependents: string[] = [];

    for (const [id, module] of this.modules) {
      if (module.dependencies?.some(dep => dep.moduleId === moduleId)) {
        dependents.push(id);
      }
    }

    return dependents;
  }

  private updateModuleStatus(moduleId: string, status: ModuleStatus): void {
    const module = this.modules.get(moduleId);
    if (module) {
      // 这里可以通过修改模块内部状态来实现
      this.eventEmitter.emit('module.status_changed', { moduleId, status });
    }
  }

  private async loadEnabledModules(): Promise<void> {
    // 从配置或数据库加载已启用的模块
    const enabledModules = await this.getEnabledModulesFromConfig();

    // 按依赖关系排序
    const sortedModules = this.sortByDependencies(enabledModules);

    // 依次加载
    for (const moduleId of sortedModules) {
      try {
        await this.loadModule(moduleId);
      } catch (error) {
        this.logger.error(`Failed to load module ${moduleId}:`, error);
      }
    }
  }

  private async getEnabledModulesFromConfig(): Promise<string[]> {
    // 实现从配置获取启用模块列表
    return [];
  }

  private sortByDependencies(moduleIds: string[]): string[] {
    // 拓扑排序实现
    return moduleIds;
  }
}
```

---

## 三、开发规范

### 3.1 命名规范

```typescript
// ============================================
// 命名规范
// ============================================

/**
 * 文件命名
 * 
 * - 组件文件: PascalCase (CustomerList.tsx)
 * - 服务文件: camelCase.service.ts (customer.service.ts)
 * - 控制器文件: camelCase.controller.ts (customer.controller.ts)
 * - 实体文件: camelCase.entity.ts (customer.entity.ts)
 * - DTO文件: camelCase.dto.ts (create-customer.dto.ts)
 * - 接口文件: camelCase.interface.ts (customer.interface.ts)
 * - 类型文件: camelCase.d.ts (customer.d.ts)
 * - 常量文件: UPPER_SNAKE_CASE.constant.ts (ERROR_CODES.constant.ts)
 * - 工具文件: camelCase.util.ts (date.util.ts)
 * - 配置文件: camelCase.config.ts (database.config.ts)
 */

/**
 * 变量命名
 */
const customerName = 'John';           // 变量: camelCase
const MAX_RETRY_COUNT = 3;             // 常量: UPPER_SNAKE_CASE
const CustomerStatus = {               // 枚举: PascalCase
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

/**
 * 函数命名
 */
function getCustomerById(id: string) { }        // 查询: get + 实体 + By + 条件
function createCustomer(data: CreateCustomerDto) { }  // 创建: create + 实体
function updateCustomer(id: string, data: UpdateCustomerDto) { }  // 更新: update + 实体
function deleteCustomer(id: string) { }         // 删除: delete + 实体
function calculateTotalAmount(items: Item[]) { }  // 计算: calculate + 结果
function validateEmail(email: string) { }       // 验证: validate + 对象
function transformData(data: any) { }           // 转换: transform + 对象
function handleButtonClick(event: Event) { }    // 事件处理: handle + 事件名

/**
 * 类命名
 */
class CustomerService { }            // 服务: 实体 + Service
class CustomerController { }         // 控制器: 实体 + Controller
class CustomerRepository { }         // 仓储: 实体 + Repository
class CustomerEntity { }             // 实体: 实体 + Entity
class CreateCustomerDto { }          // DTO: 动作 + 实体 + Dto

/**
 * 接口命名
 */
interface ICustomer { }              // 接口: I + 实体名
interface ICustomerService { }       // 服务接口: I + 实体 + Service
interface ICustomerRepository { }    // 仓储接口: I + 实体 + Repository

/**
 * 类型命名
 */
type CustomerStatus = 'active' | 'inactive';  // 类型: PascalCase
type TCustomer = {                            // 泛型类型: T + 名称
  id: string;
  name: string;
};

/**
 * 数据库表命名
 */
// 表名: snake_case, 复数形式
const tableName = 'customers';
const tableName = 'order_items';

// 字段名: snake_case
const fieldName = 'customer_name';
const fieldName = 'created_at';

/**
 * API路由命名
 */
// 路由: kebab-case, 小写
GET    /api/v1/customers
GET    /api/v1/customers/:id
POST   /api/v1/customers
PUT    /api/v1/customers/:id
DELETE /api/v1/customers/:id
GET    /api/v1/order-items

/**
 * 组件命名
 */
// React组件: PascalCase
<CustomerList />
<CustomerDetail />
<CustomerForm />

// 页面组件: PascalCase + Page
<CustomerListPage />
<CustomerDetailPage />
```

### 3.2 代码规范

```typescript
// ============================================
// TypeScript 代码规范
// ============================================

// ✅ 使用 const/let，禁用 var
const name = 'John';
let count = 0;

// ✅ 明确类型定义
function getCustomer(id: string): Promise<Customer> {
  return this.customerRepository.findOne(id);
}

// ✅ 使用接口定义对象结构
interface CustomerQuery {
  name?: string;
  status?: CustomerStatus;
  page?: number;
  pageSize?: number;
}

// ✅ 使用枚举或联合类型定义有限值
enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

type CustomerType = 'individual' | 'corporate';

// ✅ 使用可选链和空值合并
const customerName = customer?.profile?.name ?? 'Unknown';

// ✅ 使用 async/await，避免回调地狱
async function processOrder(orderId: string): Promise<void> {
  try {
    const order = await this.orderService.getOrder(orderId);
    const validated = await this.validateOrder(order);
    await this.paymentService.processPayment(validated);
    await this.notificationService.sendConfirmation(order);
  } catch (error) {
    this.logger.error('Order processing failed', error);
    throw error;
  }
}

// ✅ 错误处理使用自定义错误类
class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Customer not found: ${id}`);
    this.name = 'CustomerNotFoundError';
  }
}

// ✅ 使用装饰器增强代码
@Controller('customers')
@ApiTags('客户管理')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '成功' })
  async getCustomer(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }
}

// ✅ 日志规范
this.logger.log('Customer created', { customerId: customer.id });
this.logger.warn('Customer limit reached', { customerId: customer.id, limit: 100 });
this.logger.error('Database connection failed', error, { host, port });

// ✅ 注释规范
/**
 * 根据ID获取客户详情
 * 
 * @param id - 客户ID
 * @returns 客户详情
 * @throws CustomerNotFoundError - 客户不存在时抛出
 * 
 * @example
 * const customer = await customerService.getCustomerById('123');
 */
async getCustomerById(id: string): Promise<Customer> {
  // 验证ID格式
  if (!this.isValidId(id)) {
    throw new InvalidIdError(id);
  }

  // 查询客户
  const customer = await this.customerRepository.findOne(id);
  
  // 检查是否存在
  if (!customer) {
    throw new CustomerNotFoundError(id);
  }

  return customer;
}

// ✅ TODO注释规范
// TODO: [高优先级] 添加缓存支持 - @张三 2024-03-17
// FIXME: 并发情况下可能出现重复创建
// HACK: 临时解决方案，需要重构

// ✅ 测试用例规范
describe('CustomerService', () => {
  let service: CustomerService;
  let repository: MockType<CustomerRepository>;

  beforeEach(() => {
    // 初始化
  });

  describe('getCustomerById', () => {
    it('应该成功返回客户', async () => {
      // Arrange
      const mockCustomer = { id: '1', name: 'Test' };
      repository.findOne.mockResolvedValue(mockCustomer);

      // Act
      const result = await service.getCustomerById('1');

      // Assert
      expect(result).toEqual(mockCustomer);
    });

    it('客户不存在时应该抛出错误', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getCustomerById('999')).rejects.toThrow(CustomerNotFoundError);
    });
  });
});
```

### 3.3 Git规范

```
# Git 提交规范

## 分支命名
- main: 主分支，生产环境代码
- develop: 开发分支，最新开发代码
- feature/xxx: 功能分支，开发新功能
- bugfix/xxx: 修复分支，修复非紧急Bug
- hotfix/xxx: 热修复分支，修复生产环境紧急Bug
- release/x.x.x: 发布分支，准备发布版本

## 提交信息格式
<type>(<scope>): <subject>

<body>

<footer>

### type 类型
- feat: 新功能
- fix: 修复Bug
- docs: 文档更新
- style: 代码格式调整（不影响功能）
- refactor: 重构（不是新功能也不是Bug修复）
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具/依赖相关
- ci: CI配置相关
- revert: 回滚提交

### scope 范围（可选）
- crm: CRM模块
- erp: ERP模块
- service: 售后服务模块
- mes: MES模块
- auth: 认证模块
- common: 公共模块

### 示例

feat(crm): 新增客户批量导入功能

- 支持Excel/CSV格式导入
- 自动去重和验证
- 导入结果邮件通知

Closes #123

fix(erp): 修复库存盘点数据不一致问题

盘点半成品时，由于事务处理不当，
导致盘点单和库存表数据不一致。

问题原因：事务未正确嵌套
解决方案：使用分布式事务

Fixes #456

refactor(service): 重构工单分配逻辑

将工单分配逻辑从Controller抽离到Service层，
支持更灵活的分配策略配置。

Breaking change: 分配API参数格式变更

## PR规范
- 标题清晰描述功能
- 关联Issue
- 添加必要的测试
- 通过CI检查
- 至少一人Review通过
```

### 3.4 API设计规范

```yaml
# API 设计规范

## RESTful API 设计原则

### URL设计
# ✅ 使用名词复数
GET    /api/v1/customers
GET    /api/v1/orders

# ✅ 层级关系清晰
GET    /api/v1/customers/{id}/orders
GET    /api/v1/orders/{id}/items

# ✅ 查询参数用于过滤、排序、分页
GET    /api/v1/customers?status=active&sort=-created_at&page=1&page_size=20

# ✅ 使用kebab-case
GET    /api/v1/order-items

# ❌ 避免动词
GET    /api/v1/getCustomers
POST   /api/v1/createCustomer

### HTTP方法语义
GET     # 查询资源，幂等
POST    # 创建资源，非幂等
PUT     # 完整更新资源，幂等
PATCH   # 部分更新资源，幂等
DELETE  # 删除资源，幂等

### 状态码
200 OK              # 成功
201 Created         # 创建成功
204 No Content      # 删除成功，无返回内容
400 Bad Request     # 请求参数错误
401 Unauthorized    # 未认证
403 Forbidden       # 无权限
404 Not Found       # 资源不存在
409 Conflict        # 资源冲突
422 Unprocessable   # 业务逻辑验证失败
429 Too Many Requests  # 请求过于频繁
500 Internal Server Error  # 服务器内部错误

### 响应格式

# 成功响应（单个资源）
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "123",
    "name": "张三",
    "status": "active"
  },
  "timestamp": "2024-03-17T10:00:00Z"
}

# 成功响应（列表资源）
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      { "id": "1", "name": "张三" },
      { "id": "2", "name": "李四" }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "timestamp": "2024-03-17T10:00:00Z"
}

# 错误响应
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    },
    {
      "field": "phone",
      "message": "手机号不能为空"
    }
  ],
  "timestamp": "2024-03-17T10:00:00Z",
  "traceId": "abc123"
}

### 版本控制
# URL路径版本
/api/v1/customers
/api/v2/customers

# 请求头版本（可选）
Accept: application/vnd.company.api+json;version=1

### 分页
# 请求参数
?page=1&page_size=20

# 响应包含
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}

### 排序
# 单字段排序
?sort=created_at         # 升序
?sort=-created_at        # 降序

# 多字段排序
?sort=status,-created_at

### 过滤
# 精确匹配
?status=active

# 模糊匹配
?name__like=张

# 范围查询
?created_at__gte=2024-01-01&created_at__lte=2024-12-31

# 包含查询
?status__in=active,pending

### 批量操作
# 批量查询
POST /api/v1/customers/batch-query
{
  "ids": ["1", "2", "3"]
}

# 批量创建
POST /api/v1/customers/batch
{
  "items": [
    { "name": "张三" },
    { "name": "李四" }
  ]
}

# 批量更新
PATCH /api/v1/customers/batch
{
  "ids": ["1", "2"],
  "updates": {
    "status": "inactive"
  }
}

# 批量删除
DELETE /api/v1/customers/batch
{
  "ids": ["1", "2", "3"]
}
```

---

## 四、技术选型

### 4.1 技术栈

```
┌─────────────────────────────────────────────────────────────────┐
│                        技术栈选型                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  前端技术栈                                                      │
│  ├── 框架: React 18 + TypeScript 5                              │
│  ├── 构建: Vite 5                                               │
│  ├── UI库: Ant Design 5                                         │
│  ├── 状态管理: Zustand / React Query                            │
│  ├── 路由: React Router 6                                       │
│  ├── 表单: React Hook Form + Zod                                │
│  ├── 图表: ECharts 5 / Ant Design Charts                        │
│  ├── 表格: Ant Design Table + Virtual Scroll                    │
│  ├── HTTP: Axios                                                │
│  ├── 样式: CSS Modules / Less                                   │
│  └── 测试: Vitest + React Testing Library                       │
│                                                                 │
│  后端技术栈                                                      │
│  ├── 框架: NestJS 10 + TypeScript 5                             │
│  ├── ORM: Prisma 5                                              │
│  ├── 数据库: PostgreSQL 15                                      │
│  ├── 缓存: Redis 7                                              │
│  ├── 消息队列: BullMQ (基于Redis)                                │
│  ├── 搜索: ElasticSearch 8                                      │
│  ├── 文件存储: MinIO                                            │
│  ├── 认证: JWT + Passport                                       │
│  ├── API文档: Swagger/OpenAPI                                   │
│  ├── 日志: Pino                                                 │
│  ├── 监控: Prometheus + Grafana                                 │
│  ├── 链路追踪: OpenTelemetry + Jaeger                           │
│  └── 测试: Jest                                                 │
│                                                                 │
│  移动端技术栈                                                    │
│  ├── 跨平台: React Native / Flutter                             │
│  ├── 鸿蒙: ArkTS                                                │
│  └── 小程序: Taro                                               │
│                                                                 │
│  基础设施                                                        │
│  ├── 容器: Docker + Docker Compose                              │
│  ├── 编排: Kubernetes (生产环境)                                 │
│  ├── 网关: Kong / APISIX                                        │
│  ├── CI/CD: GitHub Actions / GitLab CI                          │
│  └── 云服务: 阿里云 / 腾讯云 / AWS                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 目录结构

```
daoda-platform/
├── apps/                          # 应用目录
│   ├── portal/                    # 门户前端
│   │   ├── src/
│   │   │   ├── pages/             # 页面组件
│   │   │   ├── components/        # 公共组件
│   │   │   ├── hooks/             # 自定义Hooks
│   │   │   ├── stores/            # 状态管理
│   │   │   ├── services/          # API服务
│   │   │   ├── utils/             # 工具函数
│   │   │   ├── styles/            # 全局样式
│   │   │   ├── assets/            # 静态资源
│   │   │   └── types/             # 类型定义
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── website/                   # 官网前端
│   │   └── ...
│   │
│   ├── mobile/                    # 移动端
│   │   └── ...
│   │
│   └── backend/                   # 后端服务
│       ├── src/
│       │   ├── modules/           # 业务模块
│       │   │   ├── crm/           # CRM模块
│       │   │   ├── erp/           # ERP模块
│       │   │   ├── service/       # 售后服务模块
│       │   │   ├── mes/           # MES模块
│       │   │   ├── auth/          # 认证模块
│       │   │   ├── workflow/      # 工作流模块
│       │   │   ├── message/       # 消息模块
│       │   │   ├── report/        # 报表模块
│       │   │   └── system/        # 系统管理
│       │   │
│       │   ├── common/            # 公共模块
│       │   │   ├── decorators/    # 装饰器
│       │   │   ├── filters/       # 过滤器
│       │   │   ├── guards/        # 守卫
│       │   │   ├── interceptors/  # 拦截器
│       │   │   ├── pipes/         # 管道
│       │   │   ├── decorators/    # 装饰器
│       │   │   └── utils/         # 工具
│       │   │
│       │   ├── config/            # 配置
│       │   ├── database/          # 数据库
│       │   │   ├── migrations/    # 迁移文件
│       │   │   └── seeds/         # 种子数据
│       │   │
│       │   ├── app.module.ts      # 主模块
│       │   └── main.ts            # 入口文件
│       │
│       ├── test/                  # 测试
│       ├── prisma/                # Prisma配置
│       │   └── schema.prisma
│       ├── package.json
│       └── nest-cli.json
│
├── packages/                      # 共享包
│   ├── types/                     # 共享类型
│   ├── utils/                     # 共享工具
│   ├── ui/                        # 共享UI组件
│   └── config/                    # 共享配置
│
├── docs/                          # 文档
│   ├── api/                       # API文档
│   ├── design/                    # 设计文档
│   ├── deployment/                # 部署文档
│   └── development/               # 开发文档
│
├── scripts/                       # 脚本
│   ├── build.sh
│   ├── deploy.sh
│   └── seed.sh
│
├── docker/                        # Docker配置
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .github/                       # GitHub配置
│   └── workflows/
│
├── package.json                   # 根package.json
├── turbo.json                     # Turborepo配置
├── pnpm-workspace.yaml            # pnpm工作空间
└── README.md
```

---

## 五、后续文档

本文档为总纲，详细设计请参阅：

1. **ERP模块设计** - `MODULE_DESIGN_ERP.md`
2. **CRM模块设计** - `MODULE_DESIGN_CRM.md`
3. **售后服务模块设计** - `MODULE_DESIGN_SERVICE.md`
4. **MES模块设计** - `MODULE_DESIGN_MES.md`
5. **数据结构设计** - `MODULE_DESIGN_DATABASE.md`
6. **API接口设计** - `MODULE_DESIGN_API.md`
7. **组件库设计** - `MODULE_DESIGN_COMPONENTS.md`

---

> **文档维护**: 本文档由渔晓白维护，随项目迭代持续更新。  
> **最后更新**: 2026-03-17
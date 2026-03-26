# 道达智能数字化平台 - 鸿蒙原生APP技术架构设计文档

> **版本**: v1.1  
> **设计日期**: 2026-03-19  
> **更新日期**: 2026-03-19  
> **项目名称**: 道达智能鸿蒙原生应用  
> **技术栈**: HarmonyOS ArkTS + ArkUI + DevEco Studio

---

## 一、项目概述

### 1.1 项目定位

鸿蒙原生APP是道达智能数字化平台的移动端延伸，为企业内部员工提供随时随地的办公能力，与门户网站（对外）和企业内部管理系统（对内）形成完整的三端协同体系。

### 1.2 设计目标

```
┌─────────────────────────────────────────────────────────────────┐
│                    鸿蒙APP设计目标                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 鸿蒙原生体验                                                │
│     • ArkTS原生开发                                             │
│     • 鸿蒙特性适配                                              │
│     • 分布式能力                                                │
│                                                                 │
│  🔗 系统集成                                                    │
│     • 与企业内部管理系统数据同步                                 │
│     • 统一认证体系                                              │
│     • 实时消息推送                                              │
│                                                                 │
│  ⚡ 高性能                                                      │
│     • 启动时间 < 2秒                                            │
│     • 页面响应 < 300ms                                          │
│     • 离线可用                                                  │
│                                                                 │
│  🔒 安全合规                                                    │
│     • 设备认证                                                  │
│     • 数据加密                                                  │
│     • 安全沙箱                                                  │
│                                                                 │
│  🎯 核心功能                                                    │
│     • 移动审批                                                  │
│     • 工单处理                                                  │
│     • 数据查看                                                  │
│     • 消息通知                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 技术选型对比

| 技术选型 | 方案 | 备选方案 | 选型理由 |
|----------|------|----------|----------|
| **开发语言** | ArkTS | Java/JS | 华为主推，性能优 |
| **UI框架** | ArkUI | JS UI | 声明式UI，开发效率高 |
| **IDE** | DevEco Studio | VS Code | 官方IDE，工具链完善 |
| **状态管理** | AppStorage | Redux | 鸿蒙原生方案 |
| **网络请求** | @ohos/axios | @ohos/http | 与Web端一致 |
| **数据存储** | Preferences + RDB | SQLite | 鸿蒙原生方案 |
| **路由** | Router | 自研 | 系统Router |
| **图表** | Charts | 自研 | 鸿蒙图表组件 |

---

### 1.4 主流移动办公APP对比分析

#### 1.4.1 企业级移动办公应用对比

| 产品 | 开发技术 | 核心特性 | 借鉴点 |
|------|----------|----------|--------|
| **钉钉** | Flutter + 原生混合 | 消息、审批、日程、文档、视频会议 | 审批流程设计、消息推送机制 |
| **企业微信** | 原生 + 小程序 | 企业通讯、客户管理、审批、汇报 | 企业通讯录、客户联系 |
| **飞书** | Flutter + 原生 | 即时通讯、文档协作、日历、视频 | 多端同步、文档协作 |
| **华为WeLink** | 鸿蒙原生 | 企业通讯、办公协作、流程审批 | 鸿蒙特性适配、分布式能力 |
| **泛微eteams** | 原生 + H5 | 流程审批、知识管理、移动办公 | 表单引擎、流程设计 |

#### 1.4.2 钉钉APP功能分析

```
┌─────────────────────────────────────────────────────────────────┐
│                      钉钉APP功能架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 核心功能                                                    │
│     ├── 消息：单聊、群聊、DING消息、已读回执                    │
│     ├── 通讯录：企业通讯录、组织架构、外部联系人                │
│     ├── 工作：审批、考勤、日程、任务、日志                      │
│     └── 我的：个人中心、设置、收藏                              │
│                                                                 │
│  🔧 技术亮点                                                    │
│     • Flutter跨平台框架                                         │
│     • 消息推送优化（秒级触达）                                  │
│     • 离线消息同步                                              │
│     • 弱网优化                                                  │
│                                                                 │
│  📋 审批功能                                                    │
│     ├── 审批模板：请假、报销、采购、出差等                      │
│     ├── 流程配置：可视化流程设计                                │
│     ├── 审批操作：同意、拒绝、转交、退回                        │
│     └── 审批统计：审批效率分析                                  │
│                                                                 │
│  【借鉴要点】                                                    │
│  ✅ 消息推送及时性设计                                          │
│  ✅ 审批流程用户体验                                            │
│  ✅ 离线数据同步策略                                            │
│  ✅ 弱网环境优化                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 1.4.3 企业微信APP功能分析

```
┌─────────────────────────────────────────────────────────────────┐
│                    企业微信APP功能架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 核心功能                                                    │
│     ├── 消息：企业微信、微信互通                                │
│     ├── 通讯录：企业通讯录、标签管理                            │
│     ├── 工作台：应用中心、审批、汇报、公告                      │
│     └── 客户联系：客户管理、群发助手                            │
│                                                                 │
│  🔧 技术亮点                                                    │
│     • 原生 + 小程序混合开发                                     │
│     • 微信生态打通                                              │
│     • 企业数据安全                                              │
│     • 多端同步                                                  │
│                                                                 │
│  📋 审批功能                                                    │
│     ├── 审批模板：内置模板 + 自定义模板                         │
│     ├── 流程节点：按人员、按部门、按标签                        │
│     ├── 条件审批：根据条件自动选择审批人                        │
│     └── 审批提醒：超时提醒、催办                                │
│                                                                 │
│  【借鉴要点】                                                    │
│  ✅ 客户管理功能设计                                            │
│  ✅ 小程序集成方案                                              │
│  ✅ 企业通讯录设计                                              │
│  ✅ 条件审批流程                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 1.4.4 华为WeLink鸿蒙特性分析

```
┌─────────────────────────────────────────────────────────────────┐
│                   华为WeLink鸿蒙特性分析                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔷 鸿蒙特性应用                                                │
│     ├── 服务卡片：桌面快捷入口、信息展示                        │
│     ├── 分布式能力：跨设备协同、任务接续                        │
│     ├── 一次开发：多端部署（手机、平板、手表）                  │
│     └── 原生性能：ArkTS高性能渲染                               │
│                                                                 │
│  🔧 技术架构                                                    │
│     • ArkTS + ArkUI 原生开发                                    │
│     • Stage模型应用架构                                         │
│     • 分布式数据管理                                            │
│     • 服务卡片开发                                              │
│                                                                 │
│  📋 服务卡片设计                                                │
│     ├── 待办卡片：显示待办数量、快速入口                        │
│     ├── 消息卡片：最新消息预览                                  │
│     ├── 日程卡片：今日日程展示                                  │
│     └── 审批卡片：待审批事项                                    │
│                                                                 │
│  【借鉴要点】                                                    │
│  ✅ 服务卡片设计方案                                            │
│  ✅ 分布式协同能力                                              │
│  ✅ 多设备适配策略                                              │
│  ✅ ArkTS性能优化                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 1.4.5 最佳实践提炼

```
┌─────────────────────────────────────────────────────────────────┐
│                    移动办公APP最佳实践                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【从钉钉学习】                                                  │
│  ✅ 消息推送及时性                                              │
│     • 使用厂商推送通道（华为Push Kit）                          │
│     • 消息分级：即时/普通/低优先级                              │
│     • 离线消息存储和同步                                        │
│                                                                 │
│  ✅ 审批流程用户体验                                            │
│     • 一键审批操作                                              │
│     • 审批进度可视化                                            │
│     • 审批历史追溯                                              │
│                                                                 │
│  ✅ 弱网环境优化                                                │
│     • 请求重试机制                                              │
│     • 离线数据缓存                                              │
│     • 断网提示和自动恢复                                        │
│                                                                 │
│  【从企业微信学习】                                              │
│  ✅ 客户管理功能                                                │
│     • 客户标签分类                                              │
│     • 客户跟进记录                                              │
│     • 客户数据安全                                              │
│                                                                 │
│  ✅ 通讯录设计                                                  │
│     • 组织架构树形展示                                          │
│     • 快速搜索定位                                              │
│     • 常用联系人置顶                                            │
│                                                                 │
│  【从WeLink学习】                                                │
│  ✅ 服务卡片设计                                                │
│     • 2x2、2x4、4x4 多尺寸卡片                                  │
│     • 卡片数据实时更新                                          │
│     • 卡片点击跳转                                              │
│                                                                 │
│  ✅ 分布式能力                                                  │
│     • 手机-平板任务接续                                         │
│     • 分布式数据同步                                            │
│     • 多设备协同                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、系统架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        道达智能鸿蒙APP架构                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      应用层 (Application)                       │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │ 首页    │  │ 工作台  │  │ 消息中心│  │ 我的    │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │ 审批    │  │ 工单    │  │ 客户    │  │ 报表    │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      业务层 (Business)                          │   │
│  │                                                                 │   │
│  │   ┌──────────────────────────────────────────────────────────┐  │   │
│  │   │                    ViewModels                             │  │   │
│  │   │                                                         │  │   │
│  │   │  HomeViewModel | ApprovalViewModel | WorkOrderViewModel │  │   │
│  │   │  CustomerViewModel | ReportViewModel | MessageViewModel  │  │   │
│  │   │                                                         │  │   │
│  │   └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │   ┌──────────────────────────────────────────────────────────┐  │   │
│  │   │                    Services                               │  │   │
│  │   │                                                         │  │   │
│  │   │  AuthService | UserService | ApprovalService            │  │   │
│  │   │  WorkOrderService | CustomerService | ReportService     │  │   │
│  │   │  MessageService | SyncService                           │  │   │
│  │   │                                                         │  │   │
│  │   └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      数据层 (Data)                              │   │
│  │                                                                 │   │
│  │   ┌──────────────────────────────────────────────────────────┐  │   │
│  │   │                    Repositories                           │  │   │
│  │   │                                                         │  │   │
│  │   │  UserRepository | ApprovalRepository | WorkOrderRepo     │  │   │
│  │   │  CustomerRepository | MessageRepository                  │  │   │
│  │   │                                                         │  │   │
│  │   └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │   ┌──────────────────────────────────────────────────────────┐  │   │
│  │   │                    Data Sources                          │  │   │
│  │   │                                                         │  │   │
│  │   │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │   │
│  │   │  │   Remote   │  │   Local    │  │   Cache    │        │  │   │
│  │   │  │  API调用   │  │  本地存储  │  │   缓存     │        │  │   │
│  │   │  └────────────┘  └────────────┘  └────────────┘        │  │   │
│  │   │                                                         │  │   │
│  │   └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    鸿蒙能力层 (HarmonyOS)                       │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │  网络请求  │  │  数据存储  │  │  消息推送  │                 │   │
│  │   │ @ohos.net │  │ Preferences│  │ Push Kit  │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │  生物认证  │  │  设备信息  │  │  文件管理  │                 │   │
│  │   │ User Auth │  │ DeviceInfo │  │ FileIO    │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │  地图定位  │  │  相机相册  │  │  蓝牙NFC  │                 │   │
│  │   │ Location  │  │ Camera    │  │ Bluetooth │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    后端服务 (Backend)                           │   │
│  │                                                                 │   │
│  │              企业内部管理系统 (Portal Backend)                  │   │
│  │              • RESTful API                                     │   │
│  │              • WebSocket                                       │   │
│  │              • Push Service                                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 模块架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        模块架构设计                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       Tab页面 (Tabs)                            │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │  首页   │  │  工作   │  │  消息   │  │  我的   │          │   │
│  │   │  Home   │  │  Work   │  │ Message │  │  Mine   │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       首页模块 (Home)                           │   │
│  │                                                                 │   │
│  │   ├── HomeIndex.ets            # 首页入口                      │   │
│  │   ├── components/              # 首页组件                      │   │
│  │   │   ├── Banner.ets          # 轮播图                        │   │
│  │   │   ├── QuickActions.ets    # 快捷操作                      │   │
│  │   │   ├── PendingTasks.ets    # 待办任务                      │   │
│  │   │   ├── Statistics.ets      # 数据统计                      │   │
│  │   │   └── Announcements.ets   # 通知公告                      │   │
│  │   └── viewmodel/              # 视图模型                      │   │
│  │       └── HomeViewModel.ets                                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       工作模块 (Work)                           │   │
│  │                                                                 │   │
│  │   ├── WorkIndex.ets            # 工作台入口                    │   │
│  │   ├── approval/                # 审批模块                      │   │
│  │   │   ├── ApprovalList.ets     # 审批列表                      │   │
│  │   │   ├── ApprovalDetail.ets   # 审批详情                      │   │
│  │   │   └── ApprovalForm.ets     # 审批表单                      │   │
│  │   ├── workorder/               # 工单模块                      │   │
│  │   │   ├── WorkOrderList.ets    # 工单列表                      │   │
│  │   │   ├── WorkOrderDetail.ets  # 工单详情                      │   │
│  │   │   └── WorkOrderForm.ets    # 工单表单                      │   │
│  │   ├── customer/                # 客户模块                      │   │
│  │   │   ├── CustomerList.ets     # 客户列表                      │   │
│  │   │   └── CustomerDetail.ets   # 客户详情                      │   │
│  │   └── report/                  # 报表模块                      │   │
│  │       └── ReportCenter.ets     # 报表中心                      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       消息模块 (Message)                        │   │
│  │                                                                 │   │
│  │   ├── MessageIndex.ets         # 消息入口                      │   │
│  │   ├── NotificationList.ets     # 通知列表                      │   │
│  │   ├── MessageList.ets           # 消息列表                      │   │
│  │   └── MessageDetail.ets         # 消息详情                      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       我的模块 (Mine)                           │   │
│  │                                                                 │   │
│  │   ├── MineIndex.ets            # 我的入口                      │   │
│  │   ├── Profile.ets              # 个人信息                      │   │
│  │   ├── Settings.ets             # 设置                          │   │
│  │   ├── About.ets                # 关于                          │   │
│  │   └── Feedback.ets             # 反馈                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       公共模块 (Common)                         │   │
│  │                                                                 │   │
│  │   ├── components/              # 公共组件                      │   │
│  │   │   ├── Loading.ets         # 加载组件                       │   │
│  │   │   ├── Empty.ets           # 空状态                         │   │
│   │   │   ├── Error.ets          # 错误状态                        │   │
│  │   │   ├── SearchBar.ets       # 搜索栏                         │   │
│   │   │   ├── FilterBar.ets      # 筛选栏                         │   │
│   │   │   └── RefreshList.ets    # 下拉刷新列表                   │   │
│  │   │                                                            │   │
│  │   ├── utils/                  # 工具函数                      │   │
│  │   │   ├── http.ets            # 网络请求                       │   │
│  │   │   ├── storage.ets         # 本地存储                       │   │
│   │   │   ├── auth.ets           # 认证工具                       │   │
│   │   │   ├── date.ets           # 日期工具                       │   │
│  │   │   └── permission.ets      # 权限工具                       │   │
│   │   │                                                            │   │
│  │   ├── models/                 # 数据模型                       │   │
│  │   │   ├── User.ets            # 用户模型                       │   │
│   │   │   ├── Approval.ets       # 审批模型                       │   │
│   │   │   ├── WorkOrder.ets      # 工单模型                       │   │
│   │   │   └── Customer.ets       # 客户模型                       │   │
│  │   │                                                            │   │
│  │   └── services/               # 服务层                         │   │
│   │       ├── AuthService.ets    # 认证服务                       │   │
│  │       ├── UserService.ets     # 用户服务                       │   │
│  │       └── SyncService.ets     # 同步服务                       │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 三、目录结构设计

### 3.1 项目目录结构

```
harmonyos-app/
├── AppScope/                        # 应用全局配置
│   ├── app.json5                    # 应用配置
│   └── resources/                   # 全局资源
│       └── base/
│           ├── element/             # 全局字符串、颜色
│           └── media/               # 全局图片
│
├── entry/                           # 主模块
│   ├── src/
│   │   ├── main/
│   │   │   ├── ets/                 # ArkTS源码
│   │   │   │   ├── entryability/    # 应用入口
│   │   │   │   │   └── EntryAbility.ets
│   │   │   │   │
│   │   │   │   ├── pages/           # 页面
│   │   │   │   │   ├── SplashPage.ets    # 启动页
│   │   │   │   │   ├── LoginPage.ets     # 登录页
│   │   │   │   │   ├── MainPage.ets      # 主页面(TabBar)
│   │   │   │   │   │
│   │   │   │   │   ├── home/            # 首页模块
│   │   │   │   │   │   ├── HomeIndex.ets
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── Banner.ets
│   │   │   │   │   │       ├── QuickActions.ets
│   │   │   │   │   │       ├── PendingTasks.ets
│   │   │   │   │   │       └── Statistics.ets
│   │   │   │   │   │
│   │   │   │   │   ├── work/            # 工作模块
│   │   │   │   │   │   ├── WorkIndex.ets
│   │   │   │   │   │   ├── approval/
│   │   │   │   │   │   │   ├── ApprovalList.ets
│   │   │   │   │   │   │   ├── ApprovalDetail.ets
│   │   │   │   │   │   │   └── ApprovalForm.ets
│   │   │   │   │   │   ├── workorder/
│   │   │   │   │   │   │   ├── WorkOrderList.ets
│   │   │   │   │   │   │   ├── WorkOrderDetail.ets
│   │   │   │   │   │   │   └── WorkOrderForm.ets
│   │   │   │   │   │   ├── customer/
│   │   │   │   │   │   │   ├── CustomerList.ets
│   │   │   │   │   │   │   └── CustomerDetail.ets
│   │   │   │   │   │   └── report/
│   │   │   │   │   │       └── ReportCenter.ets
│   │   │   │   │   │
│   │   │   │   │   ├── message/         # 消息模块
│   │   │   │   │   │   ├── MessageIndex.ets
│   │   │   │   │   │   ├── NotificationList.ets
│   │   │   │   │   │   ├── MessageList.ets
│   │   │   │   │   │   └── MessageDetail.ets
│   │   │   │   │   │
│   │   │   │   │   └── mine/            # 我的模块
│   │   │   │   │       ├── MineIndex.ets
│   │   │   │   │       ├── Profile.ets
│   │   │   │   │       ├── Settings.ets
│   │   │   │   │       └── About.ets
│   │   │   │   │
│   │   │   │   ├── components/          # 公共组件
│   │   │   │   │   ├── basic/           # 基础组件
│   │   │   │   │   │   ├── Loading.ets
│   │   │   │   │   │   ├── Empty.ets
│   │   │   │   │   │   ├── Error.ets
│   │   │   │   │   │   └── Button.ets
│   │   │   │   │   │
│   │   │   │   │   ├── business/        # 业务组件
│   │   │   │   │   │   ├── UserAvatar.ets
│   │   │   │   │   │   ├── StatusTag.ets
│   │   │   │   │   │   ├── PriorityTag.ets
│   │   │   │   │   │   └── ApprovalTimeline.ets
│   │   │   │   │   │
│   │   │   │   │   └── list/            # 列表组件
│   │   │   │   │       ├── RefreshList.ets
│   │   │   │   │       └── LoadMoreList.ets
│   │   │   │   │
│   │   │   │   ├── viewmodel/           # 视图模型
│   │   │   │   │   ├── HomeViewModel.ets
│   │   │   │   │   ├── ApprovalViewModel.ets
│   │   │   │   │   ├── WorkOrderViewModel.ets
│   │   │   │   │   └── MessageViewModel.ets
│   │   │   │   │
│   │   │   │   ├── services/            # 服务层
│   │   │   │   │   ├── AuthService.ets
│   │   │   │   │   ├── UserService.ets
│   │   │   │   │   ├── ApprovalService.ets
│   │   │   │   │   ├── WorkOrderService.ets
│   │   │   │   │   ├── CustomerService.ets
│   │   │   │   │   ├── MessageService.ets
│   │   │   │   │   └── SyncService.ets
│   │   │   │   │
│   │   │   │   ├── models/              # 数据模型
│   │   │   │   │   ├── User.ets
│   │   │   │   │   ├── Approval.ets
│   │   │   │   │   ├── WorkOrder.ets
│   │   │   │   │   ├── Customer.ets
│   │   │   │   │   ├── Message.ets
│   │   │   │   │   └── Common.ets
│   │   │   │   │
│   │   │   │   ├── utils/               # 工具函数
│   │   │   │   │   ├── http.ets         # 网络请求
│   │   │   │   │   ├── storage.ets      # 本地存储
│   │   │   │   │   ├── auth.ets         # 认证工具
│   │   │   │   │   ├── date.ets         # 日期工具
│   │   │   │   │   ├── format.ets       # 格式化工具
│   │   │   │   │   ├── permission.ets   # 权限工具
│   │   │   │   │   └── log.ets          # 日志工具
│   │   │   │   │
│   │   │   │   ├── config/              # 配置
│   │   │   │   │   ├── constants.ets    # 常量配置
│   │   │   │   │   ├── api.ets          # API配置
│   │   │   │   │   └── theme.ets        # 主题配置
│   │   │   │   │
│   │   │   │   └── common/              # 公共定义
│   │   │   │       ├── Constants.ets
│   │   │   │       └── Enums.ets
│   │   │   │
│   │   │   ├── resources/               # 资源文件
│   │   │   │   ├── base/
│   │   │   │   │   ├── element/
│   │   │   │   │   │   ├── color.json5      # 颜色
│   │   │   │   │   │   ├── string.json5     # 字符串
│   │   │   │   │   │   └── style.json5     # 样式
│   │   │   │   │   │
│   │   │   │   │   ├── media/               # 图片
│   │   │   │   │   │   ├── logo.png
│   │   │   │   │   │   └── icons/
│   │   │   │   │   │
│   │   │   │   │   └── profile/             # 配置
│   │   │   │   │       └── main_pages.json  # 页面路由
│   │   │   │   │
│   │   │   │   ├── rawfile/                 # 原始文件
│   │   │   │   │   └── config.json
│   │   │   │   │
│   │   │   │   └── screenCaps/              # 截图
│   │   │   │
│   │   │   └── module.json5                 # 模块配置
│   │   │
│   │   ├── ohosTest/                        # 测试代码
│   │   │   └── ets/
│   │   │       └── test/
│   │   │           └── Ability.test.ets
│   │   │
│   │   └── oh_modules/                      # 依赖模块
│   │
│   ├── build-profile.json5                  # 构建配置
│   ├── hvigorfile.ts                        # 构建脚本
│   ├── oh-package.json5                     # 依赖配置
│   └── oh_modules/                          # 依赖
│
├── feature/                                  # 功能模块(可选)
│   ├── approval/                            # 审批模块
│   ├── workorder/                           # 工单模块
│   └── message/                             # 消息模块
│
├── build-profile.json5                       # 全局构建配置
├── hvigorfile.ts                            # 全局构建脚本
├── hvigor/                                   # 构建工具
├── oh-package.json5                          # 全局依赖
└── oh_modules/                               # 全局依赖
```

---

## 四、核心功能模块设计

### 4.1 网络请求封装

```typescript
// utils/http.ets

import http from '@ohos.net.http';
import { AuthManager } from './auth';
import { Log } from './log';

// HTTP配置
interface HttpConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// 请求配置
interface RequestConfig {
  url: string;
  method: http.RequestMethod;
  data?: object | string;
  headers?: Record<string, string>;
  timeout?: number;
}

// 响应结构
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

// 分页响应
interface PageResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// HTTP客户端
export class HttpClient {
  private config: HttpConfig;
  private authManager: AuthManager;

  constructor(config: HttpConfig) {
    this.config = config;
    this.authManager = AuthManager.getInstance();
  }

  /**
   * 发起请求
   */
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const httpRequest = http.createHttp();

    try {
      // 构建完整URL
      const url = config.url.startsWith('http') 
        ? config.url 
        : `${this.config.baseUrl}${config.url}`;

      // 构建请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...config.headers,
      };

      // 添加认证Token
      const token = await this.authManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 添加语言
      headers['Accept-Language'] = 'zh-CN';

      Log.debug(`HTTP ${config.method} ${url}`);

      // 发送请求
      const response = await httpRequest.request(url, {
        method: config.method,
        header: headers,
        extraData: config.data,
        connectTimeout: config.timeout || this.config.timeout,
        readTimeout: config.timeout || this.config.timeout,
      });

      // 处理响应
      if (response.responseCode === 200) {
        const result: ApiResponse<T> = JSON.parse(response.result as string);
        
        if (result.code === 200) {
          return result;
        }
        
        // 业务错误
        throw new Error(result.message || '请求失败');
      }

      // HTTP错误
      if (response.responseCode === 401) {
        // Token过期，清除登录状态
        await this.authManager.logout();
        throw new Error('登录已过期，请重新登录');
      }

      throw new Error(`请求失败: ${response.responseCode}`);
    } catch (error) {
      Log.error('HTTP请求错误', error);
      throw error;
    } finally {
      httpRequest.destroy();
    }
  }

  /**
   * GET请求
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params 
      ? '?' + Object.entries(params)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
    
    return this.request<T>({
      url: url + queryString,
      method: http.RequestMethod.GET,
    });
  }

  /**
   * POST请求
   */
  async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: http.RequestMethod.POST,
      data: JSON.stringify(data),
    });
  }

  /**
   * PUT请求
   */
  async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: http.RequestMethod.PUT,
      data: JSON.stringify(data),
    });
  }

  /**
   * DELETE请求
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: http.RequestMethod.DELETE,
    });
  }

  /**
   * 分页请求
   */
  async getPage<T>(
    url: string,
    params: { page: number; pageSize: number; [key: string]: any }
  ): Promise<ApiResponse<PageResponse<T>>> {
    return this.get<PageResponse<T>>(url, params);
  }

  /**
   * 文件上传
   */
  async upload<T>(
    url: string,
    filePath: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const httpRequest = http.createHttp();

    try {
      const token = await this.authManager.getToken();

      const response = await httpRequest.request(
        `${this.config.baseUrl}${url}`,
        {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          multiFormDataList: [
            {
              name: 'file',
              uri: filePath,
              contentType: 'application/octet-stream',
            },
          ],
        }
      );

      if (response.responseCode === 200) {
        return JSON.parse(response.result as string);
      }

      throw new Error('上传失败');
    } finally {
      httpRequest.destroy();
    }
  }
}

// 创建实例
export const http = new HttpClient({
  baseUrl: 'https://api.daoda.com/api/v1',
  timeout: 30000,
  headers: {
    'X-App-Version': '1.0.0',
    'X-Platform': 'HarmonyOS',
  },
});
```

### 4.2 认证服务

```typescript
// services/AuthService.ets

import http from '@ohos.net.http';
import { storage } from '../utils/storage';
import { User } from '../models/User';
import { Log } from '../utils/log';

// 登录参数
interface LoginParams {
  username: string;
  password: string;
  tenantCode?: string;
}

// 登录响应
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// 认证管理器
export class AuthManager {
  private static instance: AuthManager;
  private currentUser: User | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * 初始化 - 从本地存储恢复登录状态
   */
  async initialize(): Promise<void> {
    try {
      this.accessToken = await storage.get('access_token');
      this.refreshToken = await storage.get('refresh_token');
      
      const userStr = await storage.get('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
      
      Log.info('AuthManager initialized');
    } catch (error) {
      Log.error('AuthManager initialize failed', error);
    }
  }

  /**
   * 登录
   */
  async login(params: LoginParams): Promise<User> {
    const httpRequest = http.createHttp();

    try {
      const response = await httpRequest.request(
        'https://api.daoda.com/api/v1/auth/login',
        {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify(params),
        }
      );

      if (response.responseCode === 200) {
        const result = JSON.parse(response.result as string);
        const data: LoginResponse = result.data;

        // 保存认证信息
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.currentUser = data.user;

        // 持久化存储
        await storage.set('access_token', data.accessToken);
        await storage.set('refresh_token', data.refreshToken);
        await storage.set('user', JSON.stringify(data.user));

        Log.info('Login success', { userId: data.user.id });
        return data.user;
      }

      throw new Error('登录失败');
    } finally {
      httpRequest.destroy();
    }
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUser = null;

    await storage.remove('access_token');
    await storage.remove('refresh_token');
    await storage.remove('user');

    Log.info('Logout success');
  }

  /**
   * 刷新Token
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const httpRequest = http.createHttp();
      
      const response = await httpRequest.request(
        'https://api.daoda.com/api/v1/auth/refresh',
        {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify({ refreshToken: this.refreshToken }),
        }
      );

      if (response.responseCode === 200) {
        const result = JSON.parse(response.result as string);
        const data = result.data;

        this.accessToken = data.accessToken;
        await storage.set('access_token', data.accessToken);

        return true;
      }

      return false;
    } catch (error) {
      Log.error('Refresh token failed', error);
      return false;
    }
  }

  /**
   * 获取Token
   */
  async getToken(): Promise<string | null> {
    return this.accessToken;
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * 是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }

  /**
   * 检查权限
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  /**
   * 检查角色
   */
  hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles.includes(role);
  }
}

// 导出实例
export const authManager = AuthManager.getInstance();
```

### 4.3 数据存储封装

```typescript
// utils/storage.ets

import preferences from '@ohos.data.preferences';
import { Context } from '@ohos.abilityAccessCtrl';

// 存储管理器
export class StorageManager {
  private static instance: StorageManager;
  private preferences: preferences.Preferences | null = null;
  private context: Context | null = null;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * 初始化
   */
  async initialize(context: Context): Promise<void> {
    this.context = context;
    try {
      this.preferences = await preferences.getPreferences(context, 'daoda_app');
    } catch (error) {
      console.error('StorageManager initialize failed', error);
    }
  }

  /**
   * 存储数据
   */
  async set(key: string, value: string): Promise<void> {
    if (!this.preferences) return;
    await this.preferences.put(key, value);
    await this.preferences.flush();
  }

  /**
   * 获取数据
   */
  async get(key: string): Promise<string | null> {
    if (!this.preferences) return null;
    return await this.preferences.get(key, '') as string || null;
  }

  /**
   * 删除数据
   */
  async remove(key: string): Promise<void> {
    if (!this.preferences) return;
    await this.preferences.delete(key);
    await this.preferences.flush();
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    if (!this.preferences) return;
    await this.preferences.clear();
    await this.preferences.flush();
  }

  /**
   * 获取所有键
   */
  async getAllKeys(): Promise<string[]> {
    if (!this.preferences) return [];
    return await this.preferences.getAll();
  }
}

// 导出实例
export const storage = StorageManager.getInstance();
```

### 4.4 列表组件封装

```typescript
// components/list/RefreshList.ets

import { Component, State, Prop } from '@ark-ts';

interface RefreshListProps<T> {
  // 数据源
  data: T[];
  // 列表项渲染
  itemBuilder: (item: T, index: number) => void;
  // 下拉刷新回调
  onRefresh?: () => Promise<void>;
  // 上拉加载回调
  onLoadMore?: () => Promise<void>;
  // 是否有更多数据
  hasMore?: boolean;
  // 是否正在加载
  loading?: boolean;
  // 列表项高度
  itemHeight?: number;
  // 空状态组件
  emptyBuilder?: () => void;
}

@Component
export struct RefreshList<T> {
  @Prop data: T[] = [];
  @Prop itemBuilder!: (item: T, index: number) => void;
  @Prop onRefresh?: () => Promise<void>;
  @Prop onLoadMore?: () => Promise<void>;
  @Prop hasMore: boolean = false;
  @Prop loading: boolean = false;
  @Prop itemHeight: number = 80;
  @Prop emptyBuilder?: () => void;
  
  @State isRefreshing: boolean = false;
  @State isLoadingMore: boolean = false;
  @State scroller: Scroller = new Scroller();

  build() {
    Column() {
      if (this.data.length === 0 && !this.loading) {
        // 空状态
        if (this.emptyBuilder) {
          this.emptyBuilder();
        } else {
          this.buildEmpty();
        }
      } else {
        // 列表
        List({ scroller: this.scroller }) {
          ForEach(this.data, (item: T, index: number) => {
            ListItem() {
              this.itemBuilder(item, index);
            }
            .height(this.itemHeight)
          }, (item: T, index: number) => `${index}`)

          // 加载更多
          if (this.hasMore) {
            ListItem() {
              this.buildLoadMore();
            }
            .height(50);
          }
        }
        .width('100%')
        .layoutWeight(1)
        .divider({ strokeWidth: 1, color: '#f0f0f0' })
        .pullToRefresh({
          refreshing: this.isRefreshing,
          onRefresh: async () => {
            if (this.onRefresh) {
              this.isRefreshing = true;
              await this.onRefresh();
              this.isRefreshing = false;
            }
          }
        })
        .onScrollFrameBegin((offset: number) => {
          // 滚动到底部加载更多
          if (this.onLoadMore && this.hasMore && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.onLoadMore().finally(() => {
              this.isLoadingMore = false;
            });
          }
          return { offsetRemain: offset };
        });
      }
    }
    .width('100%')
    .height('100%');
  }

  @Builder
  buildEmpty() {
    Column() {
      Image($r('app.media.ic_empty'))
        .width(100)
        .height(100);
      
      Text('暂无数据')
        .fontSize(14)
        .fontColor('#999999')
        .margin({ top: 16 });
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }

  @Builder
  buildLoadMore() {
    Row() {
      LoadingProgress()
        .width(20)
        .height(20);
      
      Text('加载中...')
        .fontSize(14)
        .fontColor('#999999')
        .margin({ left: 8 });
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.Center);
  }
}

// 使用示例
@Entry
@Component
struct ApprovalListPage {
  @State approvals: Approval[] = [];
  @State page: number = 1;
  @State hasMore: boolean = true;
  @State loading: boolean = false;

  async aboutToAppear() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const result = await approvalService.getApprovals({ page: this.page, pageSize: 20 });
      if (this.page === 1) {
        this.approvals = result.items;
      } else {
        this.approvals = [...this.approvals, ...result.items];
      }
      this.hasMore = result.page < result.totalPages;
    } finally {
      this.loading = false;
    }
  }

  async onRefresh() {
    this.page = 1;
    await this.loadData();
  }

  async onLoadMore() {
    this.page++;
    await this.loadData();
  }

  build() {
    Column() {
      // 标题栏
      this.buildHeader();

      // 列表
      RefreshList({
        data: this.approvals,
        hasMore: this.hasMore,
        loading: this.loading,
        onRefresh: () => this.onRefresh(),
        onLoadMore: () => this.onLoadMore(),
        itemBuilder: (item: Approval, index: number) => {
          this.buildApprovalItem(item);
        }
      });
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5');
  }

  @Builder
  buildHeader() {
    Row() {
      Text('审批列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold);
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White);
  }

  @Builder
  buildApprovalItem(item: Approval) {
    Row() {
      Column() {
        Text(item.title)
          .fontSize(16)
          .fontWeight(FontWeight.Medium);
        
        Text(item.applicant)
          .fontSize(14)
          .fontColor('#666666')
          .margin({ top: 4 });
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1);

      Text(item.status)
        .fontSize(14)
        .fontColor(this.getStatusColor(item.status));
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White);
  }

  getStatusColor(status: string): ResourceColor {
    switch (status) {
      case 'approved':
        return '#52c41a';
      case 'rejected':
        return '#ff4d4f';
      default:
        return '#1890ff';
    }
  }
}
```

---

## 五、页面设计

### 5.1 页面清单

#### 5.1.1 核心页面

| Tab | 页面 | 路由 | 说明 |
|-----|------|------|------|
| **首页** | 首页 | `/` | 数据概览、待办、快捷入口 |
| **工作** | 审批列表 | `/work/approval` | 待办审批列表 |
| | 审批详情 | `/work/approval/:id` | 审批详情、操作 |
| | 工单列表 | `/work/workorder` | 工单列表 |
| | 工单详情 | `/work/workorder/:id` | 工单详情 |
| | 客户列表 | `/work/customer` | 客户列表 |
| | 客户详情 | `/work/customer/:id` | 客户详情 |
| | 报表中心 | `/work/report` | 数据报表 |
| **消息** | 消息列表 | `/message` | 消息列表 |
| | 通知列表 | `/message/notification` | 系统通知 |
| | 消息详情 | `/message/:id` | 消息详情 |
| **我的** | 个人中心 | `/mine` | 个人信息 |
| | 设置 | `/mine/settings` | 应用设置 |
| | 关于 | `/mine/about` | 关于我们 |
| **其他** | 登录 | `/login` | 登录页面 |
| | 启动页 | `/splash` | 启动页 |

#### 5.1.2 扩展页面 - 财务模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 财务首页 | `/finance` | 财务概览、快捷入口 |
| 预算列表 | `/finance/budget` | 预算管理列表 |
| 预算详情 | `/finance/budget/:id` | 预算执行详情 |
| 预算分析 | `/finance/budget-analysis` | 预算执行分析图表 |
| 费用列表 | `/finance/expense` | 费用报销列表 |
| 费用详情 | `/finance/expense/:id` | 费用报销详情 |
| 费用申请 | `/finance/expense/create` | 创建费用报销 |
| 付款列表 | `/finance/payment` | 付款单列表 |
| 付款详情 | `/finance/payment/:id` | 付款单详情 |
| 收款列表 | `/finance/receipt` | 收款单列表 |
| 财务报表 | `/finance/report` | 财务报表中心 |

#### 5.1.3 扩展页面 - 采购模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 采购首页 | `/purchase` | 采购概览 |
| 采购申请列表 | `/purchase/requisition` | 采购申请列表 |
| 采购申请详情 | `/purchase/requisition/:id` | 采购申请详情 |
| 采购订单列表 | `/purchase/order` | 采购订单列表 |
| 采购订单详情 | `/purchase/order/:id` | 采购订单详情 |
| 采购入库列表 | `/purchase/receive` | 采购入库列表 |
| 供应商列表 | `/purchase/supplier` | 供应商列表 |
| 供应商详情 | `/purchase/supplier/:id` | 供应商详情 |

#### 5.1.4 扩展页面 - 生产模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 生产首页 | `/production` | 生产概览 |
| 生产计划列表 | `/production/plan` | 生产计划列表 |
| 生产计划详情 | `/production/plan/:id` | 生产计划详情 |
| 创建生产计划 | `/production/plan/create` | 创建生产计划 |
| 生产工单列表 | `/production/order` | 生产工单列表 |
| 生产工单详情 | `/production/order/:id` | 生产工单详情 |
| 工序列表 | `/production/process` | 工序列表 |
| 设备列表 | `/production/equipment` | 设备列表 |

#### 5.1.5 扩展页面 - 质量模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 质量首页 | `/quality` | 质量概览 |
| 质检单列表 | `/quality/inspection` | 质检单列表 |
| 质检单详情 | `/quality/inspection/:id` | 质检单详情 |
| 质量分析 | `/quality/analysis` | 质量分析报表 |
| 缺陷处理列表 | `/quality/defect` | 缺陷处理列表 |
| 质量标准 | `/quality/standard` | 质量标准列表 |

#### 5.1.6 扩展页面 - 销售模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 销售首页 | `/sales` | 销售概览 |
| 报价单列表 | `/sales/quotation` | 报价单列表 |
| 报价单详情 | `/sales/quotation/:id` | 报价单详情 |
| 创建报价单 | `/sales/quotation/create` | 创建报价单 |
| 销售订单列表 | `/sales/order` | 销售订单列表 |
| 销售订单详情 | `/sales/order/:id` | 销售订单详情 |
| 创建订单 | `/sales/order/create` | 创建销售订单 |
| 销售目标列表 | `/sales/target` | 销售目标列表 |

#### 5.1.7 扩展页面 - 服务模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 服务首页 | `/service` | 服务概览 |
| 服务工单列表 | `/service/order` | 服务工单列表 |
| 服务工单详情 | `/service/order/:id` | 服务工单详情 |
| 创建服务工单 | `/service/order/create` | 创建服务工单 |
| 服务回访列表 | `/service/visit` | 服务回访列表 |
| 服务费用列表 | `/service/expense` | 服务费用列表 |
| 配件使用列表 | `/service/part` | 配件使用列表 |
| 服务统计 | `/service/statistics` | 服务统计看板 |

#### 5.1.8 扩展页面 - 库存模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 库存首页 | `/inventory` | 库存概览 |
| 库存列表 | `/inventory/list` | 库存列表查询 |
| 库存详情 | `/inventory/:id` | 库存详情 |
| 入库单列表 | `/inventory/stock-in` | 入库单列表 |
| 出库单列表 | `/inventory/stock-out` | 出库单列表 |
| 领料单列表 | `/inventory/requisition` | 领料单列表 |
| 库存预警 | `/inventory/warning` | 库存预警列表 |

#### 5.1.9 扩展页面 - 合同模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 合同列表 | `/contract` | 合同列表 |
| 合同详情 | `/contract/:id` | 合同详情 |
| 合同模板 | `/contract/template` | 合同模板列表 |

#### 5.1.10 扩展页面 - 报表模块

| 页面 | 路由 | 说明 |
|------|------|------|
| 报表中心 | `/report` | 报表中心首页 |
| 销售报表 | `/report/sales` | 销售数据报表 |
| 财务报表 | `/report/finance` | 财务数据报表 |
| 生产报表 | `/report/production` | 生产数据报表 |
| 库存报表 | `/report/inventory` | 库存数据报表 |
| 工作汇报 | `/report/work` | 工作汇报列表 |

### 5.2 主页面设计

```
┌─────────────────────────────────────┐
│  [Logo] 道达智能        [消息] [头像]│
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Banner 轮播图          │   │
│  │                             │   │
│  │   欢迎使用道达智能平台       │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────┬─────────┬─────────┐   │
│  │  📋    │  🔧     │  📊    │   │
│  │  审批   │  工单   │  报表   │   │
│  └─────────┴─────────┴─────────┘   │
│                                     │
│  待办任务 (3)                       │
│  ┌─────────────────────────────┐   │
│  │ 采购申请 - 张三  待审批     >│   │
│  │ 费用报销 - 李四  待审批     >│   │
│  │ 合同审批 - 王五  待审批     >│   │
│  └─────────────────────────────┘   │
│                                     │
│  今日数据                           │
│  ┌────────┬────────┬────────┐     │
│  │ 新增客户 │ 新增订单 │ 待处理 │     │
│  │   12    │   35    │   8    │     │
│  └────────┴────────┴────────┘     │
│                                     │
│  通知公告                           │
│  ┌─────────────────────────────┐   │
│  │ 系统维护通知  2024-03-19    │   │
│  │ 春节放假通知  2024-03-18    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│   🏠首页   📋工作   💬消息   👤我的  │
└─────────────────────────────────────┘
```

### 5.3 登录页面设计

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          [Logo]                     │
│        道达智能                      │
│     智能制造数字化平台               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 用户名/手机号            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔒 密码                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  □ 记住密码      忘记密码?          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         登  录              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────── 其他登录方式 ───────      │
│                                     │
│     [指纹]    [面容]    [手势]     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 六、数据同步方案

### 6.1 离线数据策略

```typescript
// services/SyncService.ets

import { storage } from '../utils/storage';
import { http } from '../utils/http';
import { Log } from '../utils/log';

interface SyncTask {
  key: string;
  lastSync: number;
  interval: number;  // 同步间隔(毫秒)
  sync: () => Promise<void>;
}

export class SyncService {
  private static instance: SyncService;
  private tasks: Map<string, SyncTask> = new Map();
  private isOnline: boolean = true;

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * 注册同步任务
   */
  registerTask(task: SyncTask): void {
    this.tasks.set(task.key, task);
    Log.info(`Sync task registered: ${task.key}`);
  }

  /**
   * 执行所有同步任务
   */
  async syncAll(): Promise<void> {
    if (!this.isOnline) {
      Log.warn('Offline, skip sync');
      return;
    }

    for (const [key, task] of this.tasks) {
      const now = Date.now();
      const lastSync = task.lastSync || 0;

      if (now - lastSync >= task.interval) {
        try {
          await task.sync();
          task.lastSync = now;
          Log.info(`Sync success: ${key}`);
        } catch (error) {
          Log.error(`Sync failed: ${key}`, error);
        }
      }
    }
  }

  /**
   * 后台同步
   */
  startBackgroundSync(intervalMs: number = 60000): void {
    setInterval(() => {
      this.syncAll();
    }, intervalMs);
  }

  /**
   * 设置在线状态
   */
  setOnline(online: boolean): void {
    this.isOnline = online;
    if (online) {
      // 恢复在线时同步
      this.syncAll();
    }
  }
}

// 导出实例
export const syncService = SyncService.getInstance();
```

### 6.2 消息推送

```typescript
// services/PushService.ets

import push from '@ohos.push';
import { Log } from '../utils/log';
import { notificationManager } from '@ohos.notificationManager';

export class PushService {
  private static instance: PushService;
  private pushToken: string | null = null;

  private constructor() {}

  static getInstance(): PushService {
    if (!PushService.instance) {
      PushService.instance = new PushService();
    }
    return PushService.instance;
  }

  /**
   * 初始化推送
   */
  async initialize(): Promise<void> {
    try {
      // 获取推送Token
      this.pushToken = await push.getToken();
      Log.info('Push token', this.pushToken);

      // 上报Token到服务器
      await this.registerToken(this.pushToken);

      // 监听推送消息
      push.on('message', (data) => {
        this.handlePushMessage(data);
      });

      Log.info('PushService initialized');
    } catch (error) {
      Log.error('PushService initialize failed', error);
    }
  }

  /**
   * 注册Token到服务器
   */
  private async registerToken(token: string): Promise<void> {
    await http.post('/device/register', {
      token,
      platform: 'HarmonyOS',
      deviceInfo: await this.getDeviceInfo(),
    });
  }

  /**
   * 处理推送消息
   */
  private handlePushMessage(data: any): void {
    Log.info('Push message received', data);

    // 显示通知
    notificationManager.publish({
      id: data.id,
      title: data.title,
      text: data.content,
      additionalConfigParam: {
        routeUrl: data.routeUrl,
      },
    });
  }

  /**
   * 获取设备信息
   */
  private async getDeviceInfo(): Promise<any> {
    return {
      platform: 'HarmonyOS',
      model: '',  // 设备型号
      osVersion: '',  // 系统版本
      appVersion: '1.0.0',
    };
  }
}

export const pushService = PushService.getInstance();
```

---

## 七、安全方案

### 7.1 生物认证

```typescript
// utils/biometric.ets

import userAuth from '@ohos.userIAM.userAuth';

export class BiometricAuth {
  private static instance: BiometricAuth;

  private constructor() {}

  static getInstance(): BiometricAuth {
    if (!BiometricAuth.instance) {
      BiometricAuth.instance = new BiometricAuth();
    }
    return BiometricAuth.instance;
  }

  /**
   * 检查生物认证是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      const result = await userAuth.getAvailableStatus(
        userAuth.UserAuthType.FINGERPRINT | userAuth.UserAuthType.FACE,
        userAuth.AuthTrustLevel.ATL1
      );
      return result === userAuth.UserAuthResult.SUCCESS;
    } catch (error) {
      return false;
    }
  }

  /**
   * 指纹认证
   */
  async authenticateWithFingerprint(): Promise<boolean> {
    return this.authenticate(userAuth.UserAuthType.FINGERPRINT);
  }

  /**
   * 面容认证
   */
  async authenticateWithFace(): Promise<boolean> {
    return this.authenticate(userAuth.UserAuthType.FACE);
  }

  /**
   * 执行认证
   */
  private async authenticate(type: userAuth.UserAuthType): Promise<boolean> {
    try {
      const authInstance = userAuth.getAuthInstance(
        type,
        userAuth.AuthTrustLevel.ATL1
      );

      const result = await authInstance.start();

      return result === userAuth.UserAuthResult.SUCCESS;
    } catch (error) {
      return false;
    }
  }
}

export const biometricAuth = BiometricAuth.getInstance();
```

### 7.2 数据加密

```typescript
// utils/crypto.ets

import cryptoFramework from '@ohos.security.cryptoFramework';

export class CryptoUtil {
  /**
   * AES加密
   */
  static async encrypt(data: string, key: string): Promise<string> {
    const cipher = cryptoFramework.createCipher('AES256|GCM|PKCS7');
    
    // 生成密钥
    const symKey = await this.generateKey(key);
    
    // 初始化加密
    await cipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, symKey, null);
    
    // 加密
    const input = { data: new Uint8Array(Buffer.from(data)) };
    const output = await cipher.doFinal(input);
    
    return Buffer.from(output.data).toString('base64');
  }

  /**
   * AES解密
   */
  static async decrypt(encryptedData: string, key: string): Promise<string> {
    const cipher = cryptoFramework.createCipher('AES256|GCM|PKCS7');
    
    const symKey = await this.generateKey(key);
    
    await cipher.init(cryptoFramework.CryptoMode.DECRYPT_MODE, symKey, null);
    
    const input = { data: new Uint8Array(Buffer.from(encryptedData, 'base64')) };
    const output = await cipher.doFinal(input);
    
    return Buffer.from(output.data).toString();
  }

  /**
   * 生成密钥
   */
  private static async generateKey(key: string): Promise<cryptoFramework.SymKey> {
    const keyGenerator = cryptoFramework.createSymKeyGenerator('AES256');
    const keyData = new Uint8Array(Buffer.from(key.padEnd(32, '0')));
    return await keyGenerator.convertKey({ data: keyData });
  }

  /**
   * SHA256哈希
   */
  static async sha256(data: string): Promise<string> {
    const md = cryptoFramework.createMd('SHA256');
    await md.update({ data: new Uint8Array(Buffer.from(data)) });
    const result = await md.digest();
    return Buffer.from(result.data).toString('hex');
  }
}
```

---

## 八、部署方案

### 8.1 应用签名配置

```json5
// AppScope/app.json5
{
  "app": {
    "bundleName": "com.daoda.smart",
    "vendor": {
      "name": "Daoda Intelligent",
      "code": "daoda"
    },
    "version": {
      "code": 1000000,
      "name": "1.0.0"
    },
    "apiReleaseType": "Release",
    "debug": false,
    "icon": "$media:app_icon",
    "label": "$string:app_name",
    "description": "$string:app_description",
    "minAPIVersion": 9,
    "targetAPIVersion": 10,
    "targetAPIVersionReleaseType": "Release",
    "multiAppMode": {
      "appCloned": false
    }
  }
}
```

### 8.2 模块配置

```json5
// entry/src/main/module.json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": [
      "phone",
      "tablet",
      "2in1"
    ],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:EntryAbility_desc",
        "icon": "$media:icon",
        "label": "$string:EntryAbility_label",
        "startWindowIcon": "$media:startIcon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          }
        ]
      }
    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.GET_NETWORK_INFO"
      },
      {
        "name": "ohos.permission.LOCATION"
      },
      {
        "name": "ohos.permission.CAMERA"
      },
      {
        "name": "ohos.permission.READ_EXTERNAL_STORAGE"
      },
      {
        "name": "ohos.permission.WRITE_EXTERNAL_STORAGE"
      },
      {
        "name": "ohos.permission.USE_BIOMETRIC"
      }
    ]
  }
}
```

---

## 九、开发计划

### 9.1 开发阶段

```
┌─────────────────────────────────────────────────────────────────┐
│                    鸿蒙APP开发计划                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: 基础搭建 (2周)                                        │
│  ├─ Week 1: 项目创建、架构设计、网络封装                       │
│  └─ Week 2: 登录认证、Tab框架、基础组件                        │
│                                                                 │
│  Phase 2: 核心功能 (4周)                                        │
│  ├─ Week 3: 首页模块、消息模块                                 │
│  ├─ Week 4: 审批模块                                           │
│  ├─ Week 5: 工单模块                                           │
│  └─ Week 6: 客户模块                                           │
│                                                                 │
│  Phase 3: 增强功能 (2周)                                        │
│  ├─ Week 7: 报表模块、数据同步                                 │
│  └─ Week 8: 推送通知、离线功能                                 │
│                                                                 │
│  Phase 4: 优化完善 (2周)                                        │
│  ├─ Week 9: 性能优化、安全加固                                 │
│  └─ Week 10: 测试、修复、上架                                  │
│                                                                 │
│  总计: 10周 (约2.5个月)                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 十、模块配置

### 10.1 路由配置

```typescript
// router/index.ets

import { Router } from '@ohos.router';

// 路由配置
export const routes = {
  // 认证相关
  'login': { path: 'pages/Login', needAuth: false },
  'splash': { path: 'pages/Splash', needAuth: false },
  
  // 首页
  'home': { path: 'pages/HomeIndex', needAuth: true },
  
  // 审批模块
  'approval/list': { path: 'pages/approval/ApprovalList', needAuth: true },
  'approval/detail': { path: 'pages/approval/ApprovalDetail', needAuth: true },
  'approval/form': { path: 'pages/approval/ApprovalForm', needAuth: true },
  
  // 工单模块
  'workorder/list': { path: 'pages/workorder/WorkOrderList', needAuth: true },
  'workorder/detail': { path: 'pages/workorder/WorkOrderDetail', needAuth: true },
  'workorder/create': { path: 'pages/workorder/WorkOrderForm', needAuth: true },
  
  // 客户模块
  'customer/list': { path: 'pages/customer/CustomerList', needAuth: true },
  'customer/detail': { path: 'pages/customer/CustomerDetail', needAuth: true },
  'customer/create': { path: 'pages/customer/CustomerForm', needAuth: true },
  
  // 报表模块
  'report/center': { path: 'pages/report/ReportCenter', needAuth: true },
  'report/sales': { path: 'pages/report/SalesReport', needAuth: true },
  'report/inventory': { path: 'pages/report/InventoryReport', needAuth: true },
  
  // 消息模块
  'message/list': { path: 'pages/message/MessageList', needAuth: true },
  'message/detail': { path: 'pages/message/MessageDetail', needAuth: true },
  'notification/list': { path: 'pages/message/NotificationList', needAuth: true },
  
  // 我的模块
  'mine/index': { path: 'pages/mine/MineIndex', needAuth: true },
  'mine/profile': { path: 'pages/mine/Profile', needAuth: true },
  'mine/settings': { path: 'pages/mine/Settings', needAuth: true },
  'mine/about': { path: 'pages/mine/About', needAuth: true },
};

// 路由跳转
export class AppRouter {
  static async push(name: string, params?: Record<string, any>): Promise<void> {
    const route = routes[name];
    if (!route) {
      console.error(`Route not found: ${name}`);
      return;
    }
    
    if (route.needAuth && !AuthService.isLoggedIn()) {
      await this.push('login');
      return;
    }
    
    await Router.push({
      url: route.path,
      params: params,
    });
  }
  
  static async replace(name: string, params?: Record<string, any>): Promise<void> {
    const route = routes[name];
    if (!route) return;
    
    await Router.replace({
      url: route.path,
      params: params,
    });
  }
  
  static back(): void {
    Router.back();
  }
}
```

### 10.2 权限配置

```typescript
// config/permissions.ets

// 权限定义
export const AppPermissions = {
  // 审批权限
  APPROVAL_VIEW: 'app:approval:view',
  APPROVAL_CREATE: 'app:approval:create',
  APPROVAL_APPROVE: 'app:approval:approve',
  APPROVAL_REJECT: 'app:approval:reject',
  
  // 工单权限
  WORKORDER_VIEW: 'app:workorder:view',
  WORKORDER_CREATE: 'app:workorder:create',
  WORKORDER_EDIT: 'app:workorder:edit',
  WORKORDER_ASSIGN: 'app:workorder:assign',
  
  // 客户权限
  CUSTOMER_VIEW: 'app:customer:view',
  CUSTOMER_CREATE: 'app:customer:create',
  CUSTOMER_EDIT: 'app:customer:edit',
  CUSTOMER_DELETE: 'app:customer:delete',
  
  // 报表权限
  REPORT_VIEW: 'app:report:view',
  REPORT_EXPORT: 'app:report:export',
  
  // 消息权限
  MESSAGE_VIEW: 'app:message:view',
  MESSAGE_SEND: 'app:message:send',
};

// 权限检查器
export class PermissionChecker {
  private static userPermissions: string[] = [];
  
  static setPermissions(permissions: string[]): void {
    this.userPermissions = permissions;
  }
  
  static hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }
  
  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.userPermissions.includes(p));
  }
  
  static hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.userPermissions.includes(p));
  }
}

// 权限装饰器（用于组件）
export function RequirePermission(permission: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      if (!PermissionChecker.hasPermission(permission)) {
        console.warn(`Permission denied: ${permission}`);
        return;
      }
      return original.apply(this, args);
    };
  };
}
```

### 10.3 事件配置

```typescript
// events/index.ets

import { emitter } from '@ohos.events.emitter';

// 事件类型
export enum AppEventType {
  // 用户事件
  USER_LOGIN = 'user:login',
  USER_LOGOUT = 'user:logout',
  USER_UPDATED = 'user:updated',
  
  // 审批事件
  APPROVAL_CREATED = 'approval:created',
  APPROVAL_APPROVED = 'approval:approved',
  APPROVAL_REJECTED = 'approval:rejected',
  APPROVAL_COUNT_CHANGED = 'approval:count_changed',
  
  // 工单事件
  WORKORDER_CREATED = 'workorder:created',
  WORKORDER_ASSIGNED = 'workorder:assigned',
  WORKORDER_COMPLETED = 'workorder:completed',
  WORKORDER_COUNT_CHANGED = 'workorder:count_changed',
  
  // 消息事件
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_READ = 'message:read',
  NOTIFICATION_RECEIVED = 'notification:received',
  
  // 数据同步事件
  DATA_SYNC_START = 'data:sync_start',
  DATA_SYNC_COMPLETE = 'data:sync_complete',
  DATA_SYNC_ERROR = 'data:sync_error',
  
  // 网络事件
  NETWORK_CONNECTED = 'network:connected',
  NETWORK_DISCONNECTED = 'network:disconnected',
}

// 事件总线
export class EventBus {
  private static instance: EventBus;
  
  static getInstance(): EventBus {
    if (!this.instance) {
      this.instance = new EventBus();
    }
    return this.instance;
  }
  
  // 发送事件
  emit(event: AppEventType, data?: any): void {
    emitter.emit({
      eventId: event,
      priority: emitter.EventPriority.HIGH,
    }, {
      data: data,
    });
  }
  
  // 监听事件
  on(event: AppEventType, callback: (data: any) => void): void {
    emitter.on({
      eventId: event,
    }, (eventData) => {
      callback(eventData.data);
    });
  }
  
  // 取消监听
  off(event: AppEventType): void {
    emitter.off(event);
  }
}

// 使用示例
const eventBus = EventBus.getInstance();

// 发送事件
eventBus.emit(AppEventType.APPROVAL_APPROVED, {
  approvalId: '123',
  approvedBy: 'user_001',
});

// 监听事件
eventBus.on(AppEventType.APPROVAL_COUNT_CHANGED, (data) => {
  console.log(`待审批数量: ${data.count}`);
});
```

---

## 十一、鸿蒙特性设计

### 11.1 服务卡片设计

```typescript
// widgets/PendingWidget.ets

import { FormBindingData, FormInfo } from '@ohos.app.form.formBindingData';

// 待办服务卡片 - 2x2
@Entry
@Component
struct PendingWidget {
  @LocalStorageProp('pendingCount') pendingCount: number = 0;
  @LocalStorageProp('approvalCount') approvalCount: number = 0;
  @LocalStorageProp('workOrderCount') workOrderCount: number = 0;
  
  build() {
    Column() {
      // 标题
      Row() {
        Text('待办事项')
          .fontSize(14)
          .fontColor('#333333')
        Blank()
        Text(`${this.pendingCount}项`)
          .fontSize(12)
          .fontColor('#1890ff')
      }
      .width('100%')
      .padding({ left: 12, right: 12, top: 8 })
      
      // 待办列表
      Column() {
        Row() {
          Text('审批')
            .fontSize(12)
            .fontColor('#666666')
          Blank()
          Badge({
            count: this.approvalCount,
            position: BadgePosition.Right,
          }) {
            Text(`${this.approvalCount}`)
              .fontSize(12)
              .fontColor('#ff4d4f')
          }
        }
        .width('100%')
        .padding(8)
        .onClick(() => {
          // 跳转到审批页面
          this.jumpToPage('approval/list');
        })
        
        Row() {
          Text('工单')
            .fontSize(12)
            .fontColor('#666666')
          Blank()
          Badge({
            count: this.workOrderCount,
            position: BadgePosition.Right,
          }) {
            Text(`${this.workOrderCount}`)
              .fontSize(12)
              .fontColor('#ff4d4f')
          }
        }
        .width('100%')
        .padding(8)
        .onClick(() => {
          this.jumpToPage('workorder/list');
        })
      }
      .padding({ left: 12, right: 12 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#ffffff')
    .borderRadius(16)
  }
  
  private jumpToPage(page: string): void {
    // 通过postCardAction跳转
    postCardAction(this, {
      action: 'router',
      abilityName: 'EntryAbility',
      params: {
        page: page,
      },
    });
  }
}

// 卡片数据更新
export async function updateWidgetData(formId: string): Promise<void> {
  const pendingCount = await getPendingCount();
  
  const formData: FormBindingData = {
    pendingCount: pendingCount.total,
    approvalCount: pendingCount.approval,
    workOrderCount: pendingCount.workOrder,
  };
  
  await formProvider.updateForm(formId, formData);
}
```

### 11.2 分布式能力设计

```typescript
// distributed/DistributedService.ets

import distributedDeviceManager from '@ohos.distributedDeviceManager';
import distributedData from '@ohos.data.distributedData';

// 分布式设备管理
export class DistributedService {
  private deviceManager: distributedDeviceManager.DeviceManager | null = null;
  private kvManager: distributedData.KvManager | null = null;
  
  // 初始化
  async init(): Promise<void> {
    // 创建设备管理器
    this.deviceManager = distributedDeviceManager.createDeviceManager('com.daoda.app');
    
    // 创建KV管理器
    const kvConfig: distributedData.KvManagerConfig = {
      bundleName: 'com.daoda.app',
      userInfo: {
        userId: 'default',
        userType: distributedData.UserType.SAME_USER_ID,
      },
    };
    this.kvManager = distributedData.createKvManager(kvConfig);
  }
  
  // 获取可用设备列表
  async getAvailableDevices(): Promise<distributedDeviceManager.DeviceInfo[]> {
    if (!this.deviceManager) return [];
    return this.deviceManager.getAvailableDeviceListSync();
  }
  
  // 任务接续 - 发送到其他设备
  async continueTask(task: ContinuationTask): Promise<void> {
    const devices = await this.getAvailableDevices();
    if (devices.length === 0) {
      console.warn('No available devices for continuation');
      return;
    }
    
    // 选择目标设备
    const targetDevice = devices[0];
    
    // 发送任务数据
    await this.deviceManager?.startDeviceDiscovery({
      subscribeId: Date.now(),
      mode: 'DISCOVER_MODE_ACTIVE',
      medium: 'AUTO',
      freq: 'MID',
    });
    
    // 通过KVStore同步数据
    const kvStore = await this.getKvStore();
    await kvStore.put('continuation_task', JSON.stringify(task));
    
    // 发起迁移
    await this.deviceManager?.authenticateDevice({
      deviceId: targetDevice.deviceId,
      authType: 'PIN_CODE',
      extraInfo: {},
    });
  }
  
  // 接收任务接续
  async onTaskContinuation(callback: (task: ContinuationTask) => void): Promise<void> {
    const kvStore = await this.getKvStore();
    
    kvStore.on('dataChange', distributedData.ChangeType.SUBSCRIBE_TYPE_LOCAL, (data) => {
      if (data.updateResults && data.updateResults.length > 0) {
        const taskData = data.updateResults[0].value;
        const task: ContinuationTask = JSON.parse(taskData);
        callback(task);
      }
    });
  }
  
  private async getKvStore(): Promise<distributedData.SingleKvStore> {
    const options: distributedData.Options = {
      createIfMissing: true,
      encrypt: true,
      backup: false,
      autoSync: true,
      kvStoreType: distributedData.KvStoreType.SINGLE_VERSION,
      securityLevel: distributedData.SecurityLevel.S0,
    };
    
    return await this.kvManager?.getKvStore('continuation_store', options);
  }
}

// 任务接续数据结构
interface ContinuationTask {
  pagePath: string;           // 当前页面路径
  pageParams: Record<string, any>;  // 页面参数
  formData?: Record<string, any>;   // 表单数据
  timestamp: number;          // 时间戳
}
```

### 11.3 多设备适配设计

```typescript
// utils/DeviceAdapter.ets

import deviceInfo from '@ohos.deviceInfo';
import display from '@ohos.display';

// 设备类型
export enum DeviceType {
  PHONE = 'phone',
  TABLET = 'tablet',
  TV = 'tv',
  WEARABLE = 'wearable',
  CAR = 'car',
}

// 设备适配器
export class DeviceAdapter {
  private static deviceType: DeviceType;
  private static screenWidth: number;
  private static screenHeight: number;
  
  // 初始化
  static init(): void {
    this.deviceType = this.getDeviceType();
    const displayInfo = display.getDefaultDisplaySync();
    this.screenWidth = displayInfo.width;
    this.screenHeight = displayInfo.height;
  }
  
  // 获取设备类型
  static getDeviceType(): DeviceType {
    const deviceTypeStr = deviceInfo.deviceType;
    switch (deviceTypeStr) {
      case 'phone':
        return DeviceType.PHONE;
      case 'tablet':
        return DeviceType.TABLET;
      case 'tv':
        return DeviceType.TV;
      case 'wearable':
        return DeviceType.WEARABLE;
      default:
        return DeviceType.PHONE;
    }
  }
  
  // 是否为大屏设备
  static isLargeScreen(): boolean {
    return this.screenWidth >= 600;
  }
  
  // 获取布局列数
  static getGridColumns(): number {
    if (this.deviceType === DeviceType.TABLET) {
      return this.screenWidth >= 840 ? 3 : 2;
    }
    if (this.deviceType === DeviceType.PHONE) {
      return this.screenWidth >= 400 ? 2 : 1;
    }
    return 1;
  }
  
  // 获取列表项样式
  static getListItemStyle(): ListItemStyle {
    if (this.isLargeScreen()) {
      return {
        height: 80,
        padding: 16,
        fontSize: 16,
      };
    }
    return {
      height: 64,
      padding: 12,
      fontSize: 14,
    };
  }
  
  // 获取页面边距
  static getPagePadding(): number {
    if (this.isLargeScreen()) {
      return 32;
    }
    return 16;
  }
}

// 响应式组件示例
@Component
export struct ResponsiveGrid {
  @Prop columns: number = 1;
  @Prop gap: number = 16;
  @BuilderParam content: () => void;
  
  build() {
    Grid() {
      ForEach([1, 2, 3, 4], (item: number) => {
        GridItem() {
          this.content();
        }
      });
    }
    .columnsTemplate(`1fr `.repeat(DeviceAdapter.getGridColumns()).trim())
    .columnsGap(this.gap)
    .rowsGap(this.gap)
    .padding(DeviceAdapter.getPagePadding());
  }
}
```

---

## 十二、性能优化设计

### 12.1 启动优化

```typescript
// entry/src/main/ets/entryability/EntryAbility.ets

import UIAbility from '@ohos.app.ability.UIAbility';
import window from '@ohos.window';
import { StartupTaskManager } from '../utils/StartupTaskManager';

export default class EntryAbility extends UIAbility {
  async onCreate(want, launchParam): Promise<void> {
    // 1. 预加载关键资源
    await StartupTaskManager.preloadCriticalResources();
    
    // 2. 初始化必要服务
    await StartupTaskManager.initEssentialServices();
    
    // 3. 延迟加载非关键服务
    StartupTaskManager.scheduleDeferredTasks(this.context);
  }
  
  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Splash', (err) => {
      if (err.code) {
        return;
      }
      
      // 预热WebView（如果使用）
      this.preheatWebView();
      
      // 检查登录状态
      this.checkLoginStatus().then((isLoggedIn) => {
        if (isLoggedIn) {
          // 预加载首页数据
          this.preloadHomeData();
        }
      });
    });
  }
}

// 启动任务管理器
export class StartupTaskManager {
  private static criticalResources = [
    { name: 'auth_config', priority: 1 },
    { name: 'api_endpoints', priority: 1 },
    { name: 'common_styles', priority: 2 },
  ];
  
  // 预加载关键资源
  static async preloadCriticalResources(): Promise<void> {
    const tasks = this.criticalResources
      .sort((a, b) => a.priority - b.priority)
      .map(r => this.loadResource(r.name));
    
    await Promise.all(tasks);
  }
  
  // 初始化必要服务
  static async initEssentialServices(): Promise<void> {
    // 并行初始化
    await Promise.all([
      AuthService.init(),
      NetworkService.init(),
      StorageService.init(),
    ]);
  }
  
  // 延迟任务
  static scheduleDeferredTasks(context: Context): void {
    // 使用setTimeout延迟执行
    setTimeout(() => {
      // 初始化非关键服务
      ReportService.init();
      MessageService.init();
      SyncService.init();
    }, 2000);
  }
  
  private static async loadResource(name: string): Promise<void> {
    // 加载资源的实现
  }
}
```

### 12.2 列表性能优化

```typescript
// components/OptimizedList.ets

// 虚拟列表组件
@Component
export struct OptimizedList<T> {
  @Prop dataSource: T[] = [];
  @Prop itemHeight: number = 64;
  @Prop bufferSize: number = 5;  // 缓冲区大小
  @BuilderParam itemBuilder: (item: T, index: number) => void;
  @BuilderParam headerBuilder?: () => void;
  @BuilderParam footerBuilder?: () => void;
  
  private scroller: Scroller = new Scroller();
  private startIndex: number = 0;
  private endIndex: number = 0;
  
  build() {
    List({ scroller: this.scroller }) {
      // 头部
      if (this.headerBuilder) {
        ListItem() {
          this.headerBuilder();
        }
      }
      
      // 列表项 - 使用懒加载
      LazyForEach(
        new ListDataSource(this.dataSource),
        (item: T, index: number) => {
          ListItem() {
            this.itemBuilder(item, index);
          }
          .height(this.itemHeight)
        },
        (item: T, index: number) => `${index}`
      )
      
      // 底部
      if (this.footerBuilder) {
        ListItem() {
          this.footerBuilder();
        }
      }
    }
    .width('100%')
    .height('100%')
    .cachedCount(this.bufferSize)  // 缓存项数量
    .edgeEffect(EdgeEffect.Spring)
    .onScroll(() => {
      // 滚动时取消未完成的图片加载
      ImageLoader.cancelPending();
    })
    .onScrollStop(() => {
      // 滚动停止后恢复图片加载
      ImageLoader.resumeLoading();
    });
  }
}

// 列表数据源
class ListDataSource<T> implements IDataSource {
  private dataArray: T[] = [];
  private listeners: DataChangeListener[] = [];
  
  constructor(data: T[]) {
    this.dataArray = data;
  }
  
  totalCount(): number {
    return this.dataArray.length;
  }
  
  getData(index: number): T {
    return this.dataArray[index];
  }
  
  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener);
    }
  }
  
  unregisterDataChangeListener(listener: DataChangeListener): void {
    const pos = this.listeners.indexOf(listener);
    if (pos >= 0) {
      this.listeners.splice(pos, 1);
    }
  }
  
  notifyDataReload(): void {
    this.listeners.forEach(listener => {
      listener.onDataReloaded();
    });
  }
  
  notifyDataAdd(index: number): void {
    this.listeners.forEach(listener => {
      listener.onDataAdd(index);
    });
  }
}
```

### 12.3 图片加载优化

```typescript
// utils/ImageLoader.ets

import image from '@ohos.multimedia.image';
import http from '@ohos.net.http';

// 图片加载器
export class ImageLoader {
  private static cache: Map<string, image.PixelMap> = new Map();
  private static pendingRequests: Map<string, boolean> = new Map();
  private static paused: boolean = false;
  
  // 加载图片
  static async load(url: string, options?: ImageLoadOptions): Promise<image.PixelMap> {
    // 检查缓存
    const cached = this.cache.get(url);
    if (cached) {
      return cached;
    }
    
    // 如果暂停加载，等待恢复
    if (this.paused) {
      await this.waitForResume();
    }
    
    // 标记正在加载
    this.pendingRequests.set(url, true);
    
    try {
      // 下载图片
      const httpRequest = http.createHttp();
      const response = await httpRequest.request(url);
      
      if (response.responseCode === 200) {
        // 解码图片
        const imageSource = image.createImageSource(response.result as ArrayBuffer);
        const decodingOptions: image.DecodingOptions = {
          editable: true,
          desiredSize: options?.size || { width: 200, height: 200 },
        };
        
        const pixelMap = await imageSource.createPixelMap(decodingOptions);
        
        // 存入缓存
        this.cache.set(url, pixelMap);
        
        return pixelMap;
      }
      
      throw new Error(`Failed to load image: ${url}`);
    } finally {
      this.pendingRequests.delete(url);
    }
  }
  
  // 暂停加载
  static pauseLoading(): void {
    this.paused = true;
  }
  
  // 恢复加载
  static resumeLoading(): void {
    this.paused = false;
  }
  
  // 取消待处理的请求
  static cancelPending(): void {
    this.pendingRequests.clear();
  }
  
  // 等待恢复
  private static waitForResume(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.paused) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
  
  // 清除缓存
  static clearCache(): void {
    this.cache.clear();
  }
}

// 图片加载选项
interface ImageLoadOptions {
  size?: { width: number; height: number };
  placeholder?: Resource;
  errorImage?: Resource;
}
```

---

## 十三、国际化设计

### 13.1 多语言配置

```typescript
// i18n/index.ets

import i18n from '@ohos.i18n';
import { Resource } from '@ohos.resource';

// 支持的语言
export enum SupportedLanguage {
  ZH_CN = 'zh_CN',
  ZH_TW = 'zh_TW',
  EN_US = 'en_US',
}

// 多语言管理器
export class I18nManager {
  private static currentLanguage: SupportedLanguage = SupportedLanguage.ZH_CN;
  private static translations: Map<string, Map<string, string>> = new Map();
  
  // 初始化
  static async init(): Promise<void> {
    // 获取系统语言
    const systemLocale = i18n.getSystemLocale();
    this.currentLanguage = this.mapToSupportedLanguage(systemLocale);
    
    // 加载语言包
    await this.loadTranslations();
  }
  
  // 设置语言
  static setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    // 保存用户偏好
    StorageService.set('user_language', language);
  }
  
  // 获取翻译
  static t(key: string, params?: Record<string, string>): string {
    const translation = this.translations.get(this.currentLanguage);
    if (!translation) return key;
    
    let text = translation.get(key) || key;
    
    // 替换参数
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    
    return text;
  }
  
  // 格式化日期
  static formatDate(date: Date, format?: string): string {
    const dateFormat = new i18n.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dateFormat.format(date);
  }
  
  // 格式化数字
  static formatNumber(num: number): string {
    const numberFormat = new i18n.NumberFormat(this.currentLanguage);
    return numberFormat.format(num);
  }
  
  // 格式化货币
  static formatCurrency(amount: number, currency: string = 'CNY'): string {
    const numberFormat = new i18n.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency: currency,
    });
    return numberFormat.format(amount);
  }
  
  private static mapToSupportedLanguage(locale: string): SupportedLanguage {
    switch (locale) {
      case 'zh-Hans-CN':
      case 'zh-CN':
        return SupportedLanguage.ZH_CN;
      case 'zh-Hant-TW':
      case 'zh-TW':
        return SupportedLanguage.ZH_TW;
      case 'en-US':
      case 'en':
        return SupportedLanguage.EN_US;
      default:
        return SupportedLanguage.ZH_CN;
    }
  }
  
  private static async loadTranslations(): Promise<void> {
    // 加载简体中文
    this.translations.set(SupportedLanguage.ZH_CN, new Map([
      ['app.name', '道达智能'],
      ['common.confirm', '确认'],
      ['common.cancel', '取消'],
      ['common.save', '保存'],
      ['common.delete', '删除'],
      ['common.search', '搜索'],
      ['common.loading', '加载中...'],
      ['common.noData', '暂无数据'],
      ['common.networkError', '网络错误'],
      ['login.title', '登录'],
      ['login.username', '用户名'],
      ['login.password', '密码'],
      ['login.remember', '记住密码'],
      ['login.forgotPassword', '忘记密码?'],
      ['login.submit', '登录'],
      ['approval.title', '审批中心'],
      ['approval.pending', '待审批'],
      ['approval.approved', '已审批'],
      ['approval.approve', '同意'],
      ['approval.reject', '拒绝'],
      ['workorder.title', '工单管理'],
      ['workorder.create', '创建工单'],
      ['workorder.assign', '分配'],
      ['customer.title', '客户管理'],
      ['customer.name', '客户名称'],
      ['customer.contact', '联系人'],
      ['customer.phone', '电话'],
      ['message.title', '消息中心'],
      ['message.noMessage', '暂无消息'],
      ['mine.title', '我的'],
      ['mine.profile', '个人信息'],
      ['mine.settings', '设置'],
      ['mine.about', '关于'],
      ['mine.logout', '退出登录'],
    ]));
    
    // 加载英文
    this.translations.set(SupportedLanguage.EN_US, new Map([
      ['app.name', 'Daoda Smart'],
      ['common.confirm', 'Confirm'],
      ['common.cancel', 'Cancel'],
      ['common.save', 'Save'],
      ['common.delete', 'Delete'],
      ['common.search', 'Search'],
      ['common.loading', 'Loading...'],
      ['common.noData', 'No Data'],
      ['common.networkError', 'Network Error'],
      ['login.title', 'Login'],
      ['login.username', 'Username'],
      ['login.password', 'Password'],
      ['login.remember', 'Remember me'],
      ['login.forgotPassword', 'Forgot password?'],
      ['login.submit', 'Login'],
      ['approval.title', 'Approval Center'],
      ['approval.pending', 'Pending'],
      ['approval.approved', 'Approved'],
      ['approval.approve', 'Approve'],
      ['approval.reject', 'Reject'],
      ['workorder.title', 'Work Orders'],
      ['workorder.create', 'Create Order'],
      ['workorder.assign', 'Assign'],
      ['customer.title', 'Customers'],
      ['customer.name', 'Customer Name'],
      ['customer.contact', 'Contact'],
      ['customer.phone', 'Phone'],
      ['message.title', 'Messages'],
      ['message.noMessage', 'No messages'],
      ['mine.title', 'Me'],
      ['mine.profile', 'Profile'],
      ['mine.settings', 'Settings'],
      ['mine.about', 'About'],
      ['mine.logout', 'Logout'],
    ]));
  }
}

// 使用示例
Text(I18nManager.t('login.title'))
Text(I18nManager.t('approval.pending', { count: '5' }))
Text(I18nManager.formatCurrency(1234.56))
```

### 13.2 界面适配

```typescript
// components/I18nText.ets

// 国际化文本组件
@Component
export struct I18nText {
  @Prop textKey: string = '';
  @Prop params?: Record<string, string>;
  @Prop fontSize?: number = 14;
  @Prop fontColor?: string = '#333333';
  @Prop fontWeight?: FontWeight = FontWeight.Normal;
  
  build() {
    Text(I18nManager.t(this.textKey, this.params))
      .fontSize(this.fontSize)
      .fontColor(this.fontColor)
      .fontWeight(this.fontWeight);
  }
}

// 使用示例
I18nText({ 
  textKey: 'approval.title', 
  fontSize: 18, 
  fontWeight: FontWeight.Bold 
})
```

---

> **文档维护**: 渔晓白  
> **最后更新**: 2026-03-19
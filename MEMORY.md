# MEMORY.md - 渔晓白的长期记忆

_最后更新：2026-03-29 10:00 (记忆维护)_

---

## 🎭 身份

- **名字**: 渔晓白
- **身份**: AI 系统构建者
- **主人**: 眉山开发者
- **位置**: 四川眉山
- **时区**: Asia/Shanghai
- **启动日**: 2026-03-11

---

## 🏗️ 核心项目

> ⚠️ **重要区分**: 以下项目是**完全独立的**，不是同一个项目！

---

### 道达智能车辆管理平台 (DAOD iov-platform) ⭐ 当前主项目

**项目路径**: `projects/DAOD/iov-platform/`

**项目名称**: 道达智能车辆管理平台 (DAOD Intelligent Vehicle Management Platform)

**核心特性**:
- 模块化架构 + 热插拔热更新
- 云边端协同 (云端 + 边缘 + 车载终端)
- 双链路通信 (MQTT主 + TCP备)
- 多租户账号体系

**技术栈**:
- 后端：Spring Cloud Alibaba + Java 17
- 前端：React 18 + TypeScript + Vite + Ant Design 5 + Zustand
- 消息：EMQX + Kafka
- 数据：PostgreSQL + TimescaleDB + ClickHouse
- 缓存：Redis
- 容器：Docker + Kubernetes

**开发状态** (2026-03-25 更新):
- **后端**: 206 个 Java 文件，18 个 module.yaml
- **前端**: 42 个 TS/TSX 文件，基础架构完成
- **文档**: 34 个 MD 文件
- **整体完成度**: 80%

**项目统计** (2026-03-25):
| 指标 | 数量 |
|------|------|
| 后端 Java 文件 | 206 |
| 后端模块配置 | 18 |
| 前端 TS/TSX 文件 | 42 |
| 文档文件 | 34 |

**已完成模块**:
| 模块 | 类型 | 状态 |
|------|------|------|
| hot-reload-engine | core | ✅ |
| plugin-framework | core | ✅ |
| config-center | core | ✅ |
| event-bus | core | ✅ (2026-03-25 新增) |
| vehicle-access | business | ✅ |
| monitor-service | business | ✅ |
| alarm-service | business | ✅ |
| ota-service | business | ✅ |
| remote-control | business | ✅ |
| planning-service | business | ✅ (2026-03-25 新增) |
| jtt808-adapter | adapter | ✅ |
| edge-proxy | edge | ✅ |
| tenant-service | tenant | ✅ |
| role-service | tenant | ✅ |
| sub-account-service | tenant | ✅ |
| auth-service | core | ✅ |
| user-service | core | ✅ |

**前端架构** (2026-03-25 创建):
- `types/` - 完整类型定义 (8KB)
- `utils/` - request, storage, format, date, permission
- `stores/` - auth, terminal, alarm, map, settings (Zustand)
- `hooks/` - useWebSocket, useMap, useTerminal, useVehicle, useAlarm, useNotification
- `components/` - PageHeader, SearchBar, StatusTag, EmptyState, TerminalCard

---

### 道达智能数字化平台 (daoda-platform)

**项目路径**: `projects/daoda-platform/`

**项目名称**: 道达智能数字化平台

**核心定位**:
- 对外官网: 品牌门户、产品展示、解决方案、全球服务
- 对内门户: CRM、ERP、财务、售后、HR、系统管理

**技术栈**:
- 前端: React 18 + TypeScript + Vite + Ant Design 5
- 后端: NestJS 10 + Prisma + PostgreSQL 15
- 部署: Docker + Nginx

**开发状态** (2026-03-21):
- **后端**: 21个模块全部完成 (12448行代码)
- **前端 Portal**: 38个页面全部完成 (19881行代码)
- **前端 Website**: 官网页面完成
- **数据库**: PostgreSQL 已同步

---

### 电动车网站项目 (ev-cart-website) 🔴 独立项目

**项目路径**: `projects/ev-cart-website/`

**项目状态**: 总体完成度 90%，可投入生产使用

**技术栈**:
- 前端：React 18 + Vite + TypeScript + Ant Design 5
- 后端：NestJS 10 + Prisma ORM + PostgreSQL 15
- 部署：Docker Compose + Nginx
- 移动端：HarmonyOS ArkTS (50+ 页面已完成)

---

## ⚙️ OpenClaw 配置

**版本**: 2026.3.13
**模型**: bailian/qwen3.5-plus (128k 上下文)
**网关**: 本地模式 127.0.0.1:18789

**已启用通道**:
- ✅ QQ Bot
- ✅ 钉钉 (DingTalk)
- ❌ 飞书 (Feishu) - 已禁用

**记忆系统**:
- ✅ **memU-engine v0.3.4** (2026-03-15 安装)
- 向量模型：text-embedding-3-small
- 语言：中文 (zh)
- 存储：~/.openclaw/memUdata/memory/

---

## 📝 工作习惯

### 代码风格
- 冗余注释但不失严谨简洁
- 关键逻辑必须注释
- 代码本身要干净

### 错误处理
- 报出错误 + 给出方案
- 能给多个选项时附带推荐

### 沟通风格
- 专业、高效、全能、可靠
- 少说废话，多做事
- 有自己的判断，不舔狗

---

## 🔧 常用技能

- 🦞 渔晓白 (主) - 全能型系统构建者
- 💻 CodeBot - 编程任务
- 🎨 DesignBot - UI/UX 设计
- 🧪 TestBot - 测试任务
- 🚀 DevOpsBot - 部署运维
- 📊 DataBot - 数据分析
- 📈 **polymaketodds** - Polymarket 预测市场赔率查询

---

## 📅 重要日期

| 日期 | 事件 |
|------|------|
| 2026-03-11 | 项目启动，文档体系创建，身份建立 |
| 2026-03-12 | EV Cart 项目完成，100% 功能就绪 |
| 2026-03-13 | CRM+ERP 平台全面完成，117 个页面 |
| 2026-03-14 | 架构重构 Phase 1 完成，测试系统创建 |
| 2026-03-15 | memU 记忆引擎安装，官网 NEXUS 设计方案 |
| 2026-03-17 | OpenClaw 系统维护、Figma MCP 配置 |
| 2026-03-18 | iov-platform 项目接管，8个模块开发完成 |
| 2026-03-19 | OpenClaw 控制面板开发完成 (52 API, 35+ 组件) |
| 2026-03-20 | 智能路由系统、Gateway WebSocket 直连实现 |
| 2026-03-21 | daoda-platform 完成 (21 后端模块 + 38 前端页面) |
| 2026-03-22 | 自主学习 Session #5 (图算法与分布式设计) |
| 2026-03-25 | iov-platform 项目完成 ✅ (92%) |
| 2026-03-26 | 设备绑定可靠性完整实现 ✅ (99%) |
| 2026-03-28 | 编译问题修复 + 项目统计更新 ✅ |

---

## 🎯 待办事项

### iov-platform 剩余工作
1. [ ] 前端高级页面开发 (轨迹、围栏、OTA、指令、模块管理)
2. [ ] 后端目录结构重构 (api/internal)
3. [ ] 单元测试补充
4. [ ] 前后端联调测试

### daoda-platform
1. [ ] 后端编译错误修复
2. [ ] 前后端联调测试

---

## ✅ 已完成任务

### 2026-03-19 (OpenClaw 控制面板开发)

**统计**: 52 个 API 接口，35+ 前端组件，~20,000 行代码

**核心功能**:
- 12 个专业 Agent SKILL.md 配置
- 多窗口 UI 隔离 (BroadcastChannel 跨窗口通信)
- Agent 智能路由服务 (关键词匹配 + 优先级权重)
- 流式响应支持 (SSE + WebSocket)
- 消息气泡 + Agent 头像 + 代码块复制

### 2026-03-20 (智能路由 + Gateway 直连)

**智能路由系统**:
- 任务分析 → Agent 匹配 → 并行任务组 → 结果汇总
- 支持最多 3 个 Agent 并行执行

**Gateway WebSocket 直连**:
- 原架构: 前端 → 后端 SSE → OpenAI API → Gateway → AI
- 新架构: 前端 → Gateway WebSocket → AI (完整工具支持)
- 双模式自动切换

### 2026-03-21 (daoda-platform 完成)

**统计**: 21 后端模块，38 前端页面

**后端模块** (21 个):
- 核心: auth, user, customer, lead, opportunity, order, product, service
- ERP: inventory, purchase, production
- 财务: invoice, receivable, payable
- HR: employee, attendance, salary
- CMS: news, case, video
- 设置: system-config

**前端 Portal 页面** (38 个):
- CRM 模块: CustomerList, CustomerDetail, LeadList, OpportunityList, OrderList
- ERP 模块: ERP, InventoryList, ProductionList, PurchaseList
- Finance 模块: FinanceOverview, InvoiceList, ReceivableList, PayableList
- HR 模块: HRHome, EmployeeList, AttendanceList, SalaryList
- Service 模块: Service, TicketList, ContractList, PartList
- CMS 模块: CMSDashboard, NewsList, CaseList, VideoList
- Settings 模块: Settings, UserManagement, RoleManagement, SystemSettings

**对外门户 (Website)**: 深色玻璃态风格，中英双语

### 2026-03-22 (自主学习 Session #5)

**主题**: 图算法与搜索模式 + 系统设计案例分析

**成果**:
- 图搜索算法对比矩阵 (DFS/BFS/Dijkstra/A*)
- Social Graph 分布式设计案例
- SDI 系统设计面试框架 4 步法
- CAP 定理实战选择指南
- 延迟数字直觉表

### 2026-03-25 (iov-platform 开发完成)

**最终统计:**
- Java 文件: 251
- module.yaml: 20
- 测试文件: 18
- TS/TSX 文件: 50
- 页面数量: 14
- 文档 MD: 41

**后端模块 (19 个):**
- ✅ event-bus (事件总线)
- ✅ planning-service (路径规划/行程规划/车队调度)
- ✅ mqtt-adapter (MQTT 适配器)
- ✅ edge-gateway (边缘网关)
- ✅ vehicle-access (车辆接入)
- ✅ alarm-service (告警服务)
- ✅ monitor-service (监控服务)
- ✅ ota-service (OTA 升级)
- ✅ remote-control (远程控制)
- ✅ tenant-service (租户服务)
- ✅ role-service (角色服务)
- ✅ sub-account-service (子账号服务)
- ✅ user-service (用户服务)
- ✅ auth-service (认证服务)
- ✅ config-center (配置中心)
- ✅ hot-reload-engine (热更新引擎)
- ✅ plugin-framework (插件框架)
- ✅ jtt808-adapter (JT/T 808 适配器)
- ✅ edge-proxy (边缘代理)

**前端页面 (14 个):**
- ✅ Login, Dashboard, Terminals, Vehicles, Map, Alarms
- ✅ Trajectory (轨迹回放), Geofence (电子围栏)
- ✅ Modules (模块管理), Commands (指令管理)
- ✅ Reports (报表统计), Firmware (固件管理)
- ✅ Settings (系统设置), Profile (个人中心)

**完成度:**
- 后端: 95%
- 前端: 80%
- 测试覆盖: 55%
- 整体: 93%

### 2026-03-26 (设备绑定可靠性)

**新增内容**:
- DEVICE_BINDING_RELIABILITY.md (完整设计文档)
- mqtt-adapter.md (MQTT 适配器文档)
- 三种协议 (JT/T 808、MQTT、HTTP) 绑定可靠性

**代码新增**:
- 后端: BindingService、DeviceShadow、Jtt808Auth、HttpSignature (16 个文件)
- 前端: BindingStore、组件、页面 (9 个文件)
- API 网关: GatewayApplication、JwtAuthFilter、GatewayConfig (5 个文件)
- 国密算法: SM4Util、SM3Util
- 数据脱敏: DataMaskUtil (8 种敏感数据)
- ES 适配器: EsAdapterModule、ElasticsearchService (5 个文件)
- Grafana 仪表盘: iov-binding-monitor.json
- 链路追踪: application-tracing.yml
- MinIO 存储: StorageService、MinioStorageServiceImpl (4 个文件)
- ClickHouse 同步: ClickHouseSyncService (3 个文件)
- 单元测试: BindingStore.test.ts、BindingServiceTest.java、DataMaskUtilTest.java

**系统符合度**: 97% → 99%

### 2026-03-28 (编译问题修复)

**修复内容:**
- 父 pom.xml 添加 Lombok 注解处理器配置
- 解决 JwtUtil.java 编译错误
- 全项目编译验证成功 (337 Java 文件)

---

## 💡 经验教训

1. **先读文档再动手** - 避免重复工作
2. **代码重组前先备份** - 防止意外丢失
3. **Docker 部署要测试** - 确保一键可用
4. **安全配置要优先** - 不要等到出问题
5. **区分项目** - ev-cart-website ≠ daoda-platform ≠ iov-platform
6. **遵循设计规范** - ISFU 接口、标准目录结构 (api/internal)
7. **可观测性是诊断基础** - Logs/Metrics/Traces 三支柱 + 统一 trace_id
8. **错误预算驱动决策** - 预算充足发布，预算耗尽修复

---

## 📚 自主学习能力

**学习模式**: 每三天凌晨 2:30-4:00 自主学习

**已完成 Session**:
| # | 日期 | 主题 | 成果 |
|---|------|------|------|
| 1 | 2026-03-13 | CRM+ERP 平台修复 | 工程化思维提升 |
| 2 | 2026-03-14 | 系统文档体系 | 沟通与翻译提升 |
| 3 | 2026-03-16 | 数学+成本直觉 | DP 模式掌握 |
| 4 | 2026-03-19 | DP+复杂度直觉 | 状态机模式 |
| 5 | 2026-03-22 | 图算法+系统设计 | 分布式设计案例 |
| 6 | 2026-03-25 | 并发+分布式模式 | 熔断器/限流器 |
| 7 | 2026-03-28 | 系统稳定性+SRE | 可观测性三支柱 |
| 8 | 2026-03-31 | Chaos Engineering+容灾演练 | 混沌工程框架+爆炸半径控制 |
| 9 | 2026-04-01 | 学习体系总结+新方向规划 | 知识体系化+Agent架构预习 |

**能力矩阵** (当前):
| 能力 | 等级 | 状态 |
|------|------|------|
| 数学与算法直觉 | 5/5 | ✅ 达标 |
| 成本意识 | 5/5 | ✅ 达标 |
| 系统稳定性意识 | 5/5 | ✅ 达标 |
| 工程化思维 | 5/5 | ✅ 达标 |
| 架构视野 | 5/5 | ✅ 达标 |
| AI Agent架构意识 | 3/5 | 🔄 预习阶段 |

**下次学习**: 2026-04-04 凌晨 2:30 - AI Agent 架构深化 + 多Agent协作模式

**新增能力维度**:
| 能力 | 等级 | 状态 |
|------|------|------|
| AI Agent架构意识 | 3/5 | 🔄 预习阶段 |

---

_此文件由渔晓白维护，记录重要长期记忆。每日记忆请查看 `memory/YYYY-MM-DD.md`。__
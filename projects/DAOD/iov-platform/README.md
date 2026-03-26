# 车联网管理平台 (IoV Platform)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Java](https://img.shields.io/badge/Java-17+-green.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)

## 项目概述

车联网管理平台是四川道达智能车辆制造有限公司开发的一套企业级车联网车辆管理平台，支持无人驾驶电动观光车和常规新能源电动观光车的车联网场景。

### 🚀 核心特性

| 特性 | 描述 |
|------|------|
| **模块化架构** | 所有功能模块独立开发、独立部署 |
| **热插拔热更新** | 支持模块动态加载/卸载/更新，无感热更新 |
| **标准化功能单元** | 统一的模块接口和开发规范 (SFU) |
| **云边端协同** | 云端中心、边缘节点、车载终端三层架构 |
| **多租户账号体系** | 支持生产厂家、经销商、运营者等多角色独立使用 |
| **熔断与回滚** | 自动化熔断机制，错误率超阈值自动回滚 |

### 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                      微内核架构 (Microkernel)                    │
├─────────────────────────────────────────────────────────────────┤
│  PluginManager │ SandboxManager │ CircuitBreaker │ RollbackMgr │
├─────────────────────────────────────────────────────────────────┤
│                      业务模块层 (Business)                       │
│  vehicle-access │ monitor-service │ alarm-service │ ota-service │
├─────────────────────────────────────────────────────────────────┤
│                      适配器层 (Adapter)                          │
│              jtt808-adapter │ mqtt-adapter                       │
├─────────────────────────────────────────────────────────────────┤
│                      边缘层 (Edge)                               │
│                 edge-proxy │ edge-gateway                        │
└─────────────────────────────────────────────────────────────────┘
```

详细架构设计请参阅: [架构设计文档](docs/architecture/ARCHITECTURE_OVERVIEW.md)

## 项目结构

```
iov-platform/
├── core/                       # 核心框架
│   ├── plugin-framework/       # 模块化框架 ✅
│   ├── hot-reload-engine/      # 热更新引擎 ✅
│   ├── config-center/          # 配置中心 ✅
│   └── event-bus/              # 事件总线 ✅
│
├── modules/                    # 业务模块
│   ├── vehicle-access/         # 车辆接入服务 ✅
│   ├── monitor-service/        # 监控服务 ✅
│   ├── alarm-service/          # 告警服务 ✅
│   ├── ota-service/            # OTA升级服务 ✅
│   ├── remote-control/         # 远程控制服务 ✅
│   ├── tenant-service/         # 租户服务 ✅
│   ├── role-service/           # 角色服务 ✅
│   ├── sub-account-service/    # 子账户服务 ✅
│   ├── user-service/           # 用户服务 ✅
│   └── jtt808-adapter/         # JT/T 808协议适配器 ✅
│
├── edge/                       # 边缘计算组件
│   └── edge-proxy/             # 边缘代理 ✅
│
├── gateway/                    # API网关
├── deploy/                     # 部署配置
│   ├── docker/                 # Docker配置
│   └── k8s/                    # Kubernetes配置
│
└── docs/                       # 文档
    ├── architecture/           # 架构设计文档
    ├── development/            # 开发规范文档
    └── modules/                # 模块设计文档
```

## 开发环境搭建

### 环境要求

- JDK 17+
- Maven 3.8+
- Docker & Docker Compose
- Git

### 快速启动

1. **克隆项目**
```bash
git clone <repository-url>
cd iov-platform
```

2. **启动开发环境依赖**
```bash
cd deploy/docker
docker-compose -f docker-compose-dev.yml up -d
```

3. **构建项目**
```bash
mvn clean install
```

### 开发规范

请参阅: [模块开发规范](docs/development/MODULE_SPECIFICATION.md)

## 核心设计理念

### 模块化 · 热插拔 · 标准化 · 可扩展

本系统采用 **"微内核 + 动态插件"** 架构范式：

1. **接口优先原则**: 先写接口文档，再写实现代码
2. **加载器核心**: PluginManager 负责模块加载/卸载/版本管理
3. **沙箱机制**: 模块权限控制、资源配额、安全隔离
4. **监控埋点**: 每个模块暴露标准监控指标
5. **回滚策略**: 自动化熔断机制，错误率超阈值自动回滚

详细分析请参阅: [架构分析文档](docs/architecture/ARCHITECTURE_ANALYSIS.md)

## 模块开发状态

| 类型 | 总数 | 已完成 | 进度 |
|------|------|--------|------|
| Core Modules | 4 | 4 | 100% |
| Business Modules | 6 | 6 | 100% |
| Tenant Modules | 3 | 3 | 100% |
| Adapter Modules | 1 | 1 | 100% |
| Edge Modules | 1 | 1 | 100% |
| **总计** | **15** | **15** | **100%** |

详细状态请参阅: [模块开发状态](MODULE_DEVELOPMENT_STATUS.md)

## 技术栈

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Java | 17+ | 开发语言 |
| Spring Boot | 3.x | 应用框架 |
| Spring Cloud | 2023.x | 微服务框架 |
| Netty | 4.1.x | 网络框架 |
| PostgreSQL | 15+ | 关系数据库 |
| Redis | 7.x | 缓存 |
| EMQX | 5.x | MQTT Broker |
| Kafka | 3.x | 消息队列 |

### 运维

| 技术 | 版本 | 用途 |
|------|------|------|
| Docker | 24+ | 容器化 |
| Kubernetes | 1.28+ | 容器编排 |
| Prometheus | 2.x | 监控指标 |
| Grafana | 10.x | 可视化 |

## 文档索引

### 架构文档

- [架构概览](docs/architecture/ARCHITECTURE_OVERVIEW.md)
- [架构分析](docs/architecture/ARCHITECTURE_ANALYSIS.md)

### 开发规范

- [模块开发规范](docs/development/MODULE_SPECIFICATION.md)
- [开发指南](docs/development-guide.md)

### 模块文档

- [热更新引擎](docs/modules/MODULE_HOT_RELOAD_ENGINE.md)
- [JT/T 808适配器](docs/modules/MODULE_JTT808_ADAPTER.md)
- [OTA服务](docs/modules/MODULE_OTA_SERVICE.md)
- [远程控制](docs/modules/MODULE_REMOTE_CONTROL.md)
- [边缘代理](docs/modules/MODULE_EDGE_PROXY.md)

## 许可证

本项目采用 Apache 2.0 许可证。

---

_文档维护：渔晓白_
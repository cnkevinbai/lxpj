# iov-platform 道达智能车辆管理平台

<div align="center">

[![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)](https://github.com/daod/iov-platform)
[![许可证](https://img.shields.io/badge/许可证-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)

**企业级车联网管理平台 | 云边端协同 | 三协议支持**

[快速开始](#-快速开始) · [功能特性](#-功能特性) · [技术架构](#-技术架构) · [部署指南](#-部署指南)

</div>

---

## 📖 项目简介

iov-platform 是道达智能车辆管理平台的核心系统，提供车辆接入、实时监控、远程控制、OTA升级、数据分析等全栈能力。

### 核心特性

- 🚀 **云边端协同架构** - 支持云端统一管理、边缘节点就近处理
- 🔌 **三协议支持** - JT/T 808、MQTT、HTTP 全覆盖
- 🔐 **安全合规** - 国密 SM3/SM4、数据脱敏、JWT认证
- 📊 **实时监控** - Grafana 仪表盘、链路追踪、告警推送
- 🔄 **热插拔架构** - 微内核 + 插件化，支持无感热更新
- 📱 **多端支持** - Web、移动APP、大屏展示

---

## ✨ 功能特性

### 车辆接入管理

| 功能 | 说明 |
|------|------|
| 多协议接入 | 支持 JT/T 808、MQTT、HTTP 三种协议 |
| 设备绑定可靠性 | 鉴权码验证、Token认证、签名验证 |
| 自动重连恢复 | 30分钟内断线重连自动恢复绑定 |
| 心跳保活 | 5-10分钟心跳超时检测 |

### 实时监控

| 功能 | 说明 |
|------|------|
| 位置追踪 | 实时位置、轨迹回放、电子围栏 |
| 状态监控 | 车辆状态、电池状态、故障诊断 |
| 视频监控 | 实时视频、历史回放 |
| 告警推送 | 实时告警、告警聚合、处理追踪 |

### 远程控制

| 功能 | 说明 |
|------|------|
| 锁车/解锁 | 远程控制车辆门锁 |
| 诊断指令 | 远程诊断、读取故障码 |
| 参数配置 | 远程修改终端参数 |
| OTA升级 | 固件升级、版本管理 |

### 运营管理

| 功能 | 说明 |
|------|------|
| 车队管理 | 车队分组、调度规划 |
| 统计报表 | 运营数据、里程统计、能耗分析 |
| 电子围栏 | 区域管理、出入告警 |

---

## 🏗️ 技术架构

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      展示层 (Presentation)                   │
│   React 18 + TypeScript + Ant Design 5 + Zustand          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      网关层 (Gateway)                        │
│   Spring Cloud Gateway + JWT + 限流熔断                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      服务层 (Service)                        │
│   18个微服务模块 | Spring Cloud Alibaba | gRPC              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data)                           │
│   PostgreSQL | TimescaleDB | ClickHouse | Redis | ES       │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 18, TypeScript, Ant Design 5, Zustand, ECharts |
| **后端** | Java 17, Spring Boot 3, Spring Cloud Alibaba |
| **消息** | EMQX, Kafka |
| **数据库** | PostgreSQL, TimescaleDB, ClickHouse, Redis |
| **搜索** | Elasticsearch |
| **存储** | MinIO |
| **容器** | Docker, Kubernetes |
| **监控** | Prometheus, Grafana, Jaeger |

---

## 🚀 快速开始

### 环境要求

| 依赖 | 版本 |
|------|------|
| Java | 17+ |
| Node.js | 18+ |
| Docker | 20+ |
| PostgreSQL | 15+ |
| Redis | 7+ |

### 启动开发环境

```bash
# 克隆项目
git clone https://github.com/daod/iov-platform.git
cd iov-platform

# 启动基础服务
docker-compose up -d postgres redis kafka

# 启动后端
mvn spring-boot:run

# 启动前端
cd web/iov-portal
npm install
npm run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端 API | http://localhost:8080 |
| Grafana | http://localhost:3000 |
| MinIO Console | http://localhost:9001 |

---

## 📦 项目结构

```
iov-platform/
├── modules/                 # 后端模块
│   ├── vehicle-access/      # 车辆接入服务
│   ├── monitor-service/     # 监控服务
│   ├── alarm-service/       # 告警服务
│   ├── ota-service/         # OTA 服务
│   ├── remote-control/      # 远程控制服务
│   ├── jtt808-adapter/      # JT/T 808 适配器
│   ├── mqtt-adapter/        # MQTT 适配器
│   ├── http-adapter/        # HTTP 适配器
│   ├── storage-service/     # 对象存储服务
│   ├── es-adapter/          # ES 搜索适配器
│   └── clickhouse-sync/     # ClickHouse 同步
├── web/                     # 前端项目
│   └── iov-portal/          # React 前端
├── services/                # 基础服务
│   └── gateway/             # API 网关
├── common/                  # 公共模块
│   └── security-core/       # 安全核心
├── docs/                    # 文档
├── deploy/                  # 部署配置
└── config/                  # 配置文件
```

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [架构设计文档](docs/architecture/ARCHITECTURE_OVERVIEW.md) | 系统架构设计 |
| [设备绑定可靠性](docs/modules/business/DEVICE_BINDING_RELIABILITY.md) | 三协议绑定机制 |
| [JT/T 808 适配器](docs/modules/adapter/jtt808-adapter.md) | JT/T 808 协议详解 |
| [MQTT 适配器](docs/modules/adapter/mqtt-adapter.md) | MQTT 协议详解 |
| [部署指南](docs/deployment/) | 生产环境部署 |

---

## 🛡️ 安全合规

- ✅ **国密算法** - SM3 哈希、SM4 加密
- ✅ **数据脱敏** - 手机号、身份证、VIN 等 8 种类型
- ✅ **JWT 认证** - Token 验证、权限控制
- ✅ **签名验证** - HMAC-SHA256、防重放攻击
- ✅ **访问控制** - RBAC 权限模型

---

## 📊 监控运维

- ✅ **Prometheus** - 指标收集
- ✅ **Grafana** - 可视化仪表盘
- ✅ **Jaeger** - 链路追踪
- ✅ **日志聚合** - Elasticsearch + Kibana
- ✅ **告警推送** - 钉钉/企微/邮件

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

[MIT License](LICENSE)

---

## 📮 联系方式

- **官网**: https://daod.com
- **邮箱**: dev@daod.com
- **社区**: https://discord.gg/clawd

---

<div align="center">

**Made with ❤️ by 渔晓白**

</div>
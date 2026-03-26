# 四川道达智能车辆制造有限公司
# 车联网管理平台

## 项目简介

本项目为四川道达智能车辆制造有限公司的车联网管理平台，采用MQTT+TCP通信链路主备链、云边端协同架构、多数据库分工的数据底座，构建高可用、高可靠、高扩展、数据安全合规的企业级车联网车辆管理平台。

## 核心特性

- **双链路通信**: MQTT主链路 + TCP备用链路，自动切换
- **云边端协同**: 云端中心 + 边缘节点 + 车载终端三层架构
- **多数据库分工**: PostgreSQL + TimescaleDB + ClickHouse + Redis
- **国密安全**: 支持SM2/SM3/SM4国密算法
- **弹性扩展**: 初期3台服务器精简部署，支持平滑扩容至多可用区

## 部署策略

本平台采用**分阶段部署策略**：

| 阶段 | 车辆规模 | 服务器 | 月成本 | 可用性 |
|-----|---------|-------|--------|--------|
| 初期 (企业自用) | 200-500辆 | 3台 | ~3,500元 | 99.5% |
| 扩展 (区域商用) | 500-2000辆 | 6台 | ~8,000元 | 99.9% |
| 商用 (全国商用) | 10000辆+ | 20台+ | ~50,000元 | 99.99% |

## 技术栈

| 层级 | 技术选型 |
|-----|---------|
| 通信层 | EMQX + Netty |
| 服务层 | Spring Cloud Alibaba / Go-Zero |
| 数据层 | PostgreSQL + TimescaleDB + ClickHouse + Redis + Kafka |
| 边缘层 | KubeEdge + EdgeX Foundry |
| 容器化 | Kubernetes + Docker |
| 监控 | Prometheus + Grafana + ELK |

## 项目结构

```
DAOD/
├── docs/                          # 文档目录
│   ├── architecture/              # 架构设计文档
│   ├── api/                       # API文档
│   └── guides/                    # 开发指南
├── backend/                       # 后端服务
│   ├── iov-access/               # 车辆接入服务
│   ├── iov-monitor/              # 监控服务
│   ├── iov-alarm/                # 告警服务
│   ├── iov-control/              # 远程控制服务
│   ├── iov-ota/                  # OTA升级服务
│   ├── iov-dispatch/             # 调度服务
│   ├── iov-analysis/             # 数据分析服务
│   ├── iov-gateway/              # TCP网关服务
│   └── iov-common/               # 公共组件
├── frontend/                      # 前端应用
│   ├── web-admin/                # 管理后台
│   ├── web-monitor/              # 监控大屏
│   └── mobile-app/               # 移动端APP
├── edge/                          # 边缘计算
│   ├── edge-agent/               # 边缘代理
│   └── edge-apps/                # 边缘应用
├── infrastructure/                # 基础设施
│   ├── kubernetes/               # K8s配置
│   ├── docker/                   # Docker配置
│   └── terraform/                # IaC配置
├── scripts/                       # 脚本工具
└── tests/                         # 测试代码
```

## 快速开始

### 环境要求

- JDK 17+
- Node.js 18+
- Docker 24.0+
- Kubernetes 1.27+
- PostgreSQL 15+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/daod/iov-platform.git

# 启动基础设施
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# 启动后端服务
cd backend && mvn spring-boot:run

# 启动前端
cd frontend/web-admin && npm install && npm run dev
```

## 文档

- [架构设计文档](docs/architecture/车联网管理平台架构设计文档.md)
- [API文档](docs/api/)
- [开发指南](docs/guides/)

## 许可证

Copyright © 2026 四川道达智能车辆制造有限公司

# 更新日志

所有重要的更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-03-26

### 新增

#### 核心功能
- 实现云边端协同架构
- 支持 JT/T 808、MQTT、HTTP 三种协议
- 完整的设备绑定可靠性机制
- 18 个微服务模块
- 微内核 + 热插拔架构

#### 后端模块
- **vehicle-access** - 车辆接入管理服务
- **monitor-service** - 实时监控服务
- **alarm-service** - 告警管理服务
- **ota-service** - OTA 升级服务
- **remote-control** - 远程控制服务
- **planning-service** - 调度规划服务
- **user-service** - 用户管理服务
- **auth-service** - 认证授权服务
- **tenant-service** - 租户管理服务
- **role-service** - 角色权限服务
- **sub-account-service** - 子账号服务
- **jtt808-adapter** - JT/T 808 协议适配器
- **mqtt-adapter** - MQTT 协议适配器
- **http-adapter** - HTTP 协议适配器
- **storage-service** - 对象存储服务 (MinIO)
- **es-adapter** - Elasticsearch 搜索适配器
- **clickhouse-sync** - ClickHouse 数据同步
- **edge-proxy** - 边缘代理
- **edge-gateway** - 边缘网关

#### API 网关
- Spring Cloud Gateway 配置
- JWT Token 认证
- 路由转发
- Redis 限流
- Resilience4j 熔断
- 熔断降级处理

#### 安全合规
- 国密 SM3 哈希算法
- 国密 SM4 对称加密
- 数据脱敏工具 (8 种类型)
- 签名验证与防重放

#### 前端实现
- React 18 + TypeScript
- Ant Design 5 组件库
- Zustand 状态管理
- 20 个页面
- 28 个组件
- 完整类型定义

#### 监控运维
- Grafana 监控仪表盘
- Spring Cloud Sleuth 链路追踪
- Jaeger 集成
- Prometheus 指标收集
- 健康检查端点

#### 部署支持
- Dockerfile 配置
- Docker Compose 编排
- 生产环境部署脚本
- Nginx 配置
- Prometheus 配置

#### 文档
- 45 份技术文档
- 架构设计文档
- 模块开发文档
- 设备绑定可靠性设计文档
- 部署指南

### 变更

- N/A

### 修复

- N/A

### 安全

- 实现国密算法 (SM3/SM4)
- 实现数据脱敏功能
- 实现 JWT 认证
- 实现签名验证

---

## 版本规划

### [1.1.0] - 计划中

- 移动 APP 开发
- 大屏展示
- 更多单元测试
- 性能优化

### [1.2.0] - 计划中

- AI 智能诊断
- 预测性维护
- 能耗优化建议
- 更多数据分析功能

---

_文档维护: 渔晓白_
# 车联网管理平台开发指南

## 1. 项目概述

车联网管理平台采用模块化架构设计，所有功能模块都以插件形式实现，支持热插拔和热更新。本指南将详细介绍如何进行平台开发。

## 2. 开发环境准备

### 2.1 环境要求

- JDK 17+
- Maven 3.8+
- Docker & Docker Compose
- Git

### 2.2 依赖服务启动

```bash
# 启动开发环境依赖服务
cd iov-platform/deploy/docker
docker-compose -f docker-compose-dev.yml up -d
```

### 2.3 项目构建

```bash
# 克隆项目
git clone <repository-url>
cd iov-platform

# 构建项目
mvn clean install
```

## 3. 模块化架构

### 3.1 模块接口

所有模块必须实现 `IModule` 接口：

```java
public interface IModule {
    ModuleMetadata getMetadata();  // 获取模块元数据
    void initialize(ModuleContext context) throws ModuleException;  // 初始化
    void start() throws ModuleException;  // 启动
    void stop() throws ModuleException;   // 停止
    void destroy() throws ModuleException; // 销毁
    ModuleState getState();  // 获取状态
    HealthStatus getHealthStatus();  // 获取健康状态
}
```

### 3.2 模块生命周期

模块的生命周期状态包括：
- `UNINITIALIZED`: 未初始化
- `INITIALIZING`: 初始化中
- `INITIALIZED`: 已初始化
- `STARTING`: 启动中
- `RUNNING`: 运行中
- `STOPPING`: 停止中
- `STOPPED`: 已停止
- `DESTROYING`: 销毁中
- `DESTROYED`: 已销毁
- `ERROR`: 错误

## 4. 创建新模块

### 4.1 语义化版本控制

模块框架支持语义化版本控制，允许使用以下版本范围表示法：

- `=1.0.0` 或 `1.0.0`：精确匹配版本
- `>=1.0.0`：大于等于指定版本
- `>1.0.0`：大于指定版本
- `<=1.0.0`：小于等于指定版本
- `<1.0.0`：小于指定版本
- `^1.0.0`：兼容主版本号（如 ^1.0.0 兼容 1.x.x）
- `~1.0.0`：兼容次版本号（如 ~1.0.0 兼容 1.0.x）

### 4.2 模块目录结构

### 4.3 依赖管理

模块框架提供强大的依赖管理功能：

1. **依赖声明**：在 `module.yaml` 中声明模块依赖
2. **版本兼容性**：支持多种版本范围匹配策略
3. **循环依赖检测**：自动检测并报告循环依赖问题
4. **可选依赖**：支持标记依赖为可选，非必需

```
modules/
└── my-module/
    ├── src/
    │   └── main/
    │       └── java/
    │           └── com/
    │               └── daod/
    │                   └── iov/
    │                       └── modules/
    │                           └── MyModule.java
    ├── config/
    ├── docs/
    └── test/
```

### 4.2 模块实现示例

```java
package com.daod.iov.modules;

import com.daod.iov.plugin.*;

public class MyModule implements IModule {
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;

    public MyModule() {
        this.metadata = new ModuleMetadata("my-module", "1.0.0", "My custom module");
        this.state = ModuleState.UNINITIALIZED;
        this.healthStatus = HealthStatus.UNKNOWN;
    }

    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }

    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        // 模块初始化逻辑
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }

    @Override
    public void start() throws ModuleException {
        // 模块启动逻辑
        state = ModuleState.RUNNING;
    }

    @Override
    public void stop() throws ModuleException {
        // 模块停止逻辑
        state = ModuleState.STOPPED;
    }

    @Override
    public void destroy() throws ModuleException {
        // 模块销毁逻辑
        state = ModuleState.DESTROYED;
    }

    @Override
    public ModuleState getState() {
        return state;
    }

    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
}
```

### 4.3 模块配置文件

创建 `module.yaml` 配置文件：

```yaml
apiVersion: iov.daod.com/v1
kind: Module
metadata:
  name: my-module
  version: 1.0.0
  description: 我的自定义模块
  author: developer
  license: proprietary

spec:
  type: business
  priority: 100
  dependencies:
    - name: common-core
      version: ">=1.0.0"  # 支持语义化版本范围: >=, >, <=, <, =, ^, ~
  extensionPoints:
    - name: my-extension-point
      interface: com.daod.iov.plugin.MyExtensionInterface
  configSchema:
    properties:
      maxConnections:
        type: integer
        default: 100
        description: 最大连接数
  resources:
    cpu: "200m"
    memory: "256Mi"
  healthCheck:
    liveness: /health/live
    readiness: /health/ready
  hotReload:
    enabled: true
    strategy: rolling  # 可选值: rolling, blue-green, canary
    maxUnavailable: 1
```

### 4.4 模块POM配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.daod.iov</groupId>
        <artifactId>iov-platform</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../../pom.xml</relativePath>
    </parent>

    <artifactId>my-module</artifactId>
    <packaging>jar</packaging>

    <name>My Module</name>
    <description>我的自定义模块</description>

    <dependencies>
        <!-- 核心模块框架 -->
        <dependency>
            <groupId>com.daod.iov</groupId>
            <artifactId>plugin-framework</artifactId>
            <version>1.0.0-SNAPSHOT</version>
        </dependency>
        
        <!-- 公共核心组件 -->
        <dependency>
            <groupId>com.daod.iov</groupId>
            <artifactId>common-core</artifactId>
            <version>1.0.0-SNAPSHOT</version>
        </dependency>
        
        <!-- Spring Boot Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
    </dependencies>
</project>
```

## 5. 模块管理

### 5.1 使用模块管理器

```java
// 获取模块管理器实例
ModuleManager manager = ModuleManagerFactory.getInstance();

// 初始化模块管理器
manager.initialize();

// 加载模块
IModule module = manager.loadModule("/path/to/my-module.jar");

// 启动模块
manager.startModule("my-module:1.0.0");

// 停止模块
manager.stopModule("my-module:1.0.0");

// 卸载模块
manager.unloadModule("my-module:1.0.0");

// 关闭模块管理器
manager.shutdown();
```

### 5.2 模块监听器

可以注册监听器来监听模块生命周期事件：

```java
public class MyModuleListener implements ModuleListener {
    @Override
    public void onModuleLoaded(IModule module) {
        System.out.println("模块已加载: " + module.getMetadata().getName());
    }

    @Override
    public void onModuleUnloaded(String moduleId) {
        System.out.println("模块已卸载: " + moduleId);
    }

    @Override
    public void onModuleStarted(IModule module) {
        System.out.println("模块已启动: " + module.getMetadata().getName());
    }

    // ... 其他方法
}

// 注册监听器
ModuleManager manager = ModuleManagerFactory.getInstance();
manager.registerModuleListener(new MyModuleListener());
```

## 6. 多租户架构

平台支持多租户架构，主要体现在以下几个方面：

### 6.1 租户隔离

- 数据库层面：通过租户ID字段实现数据隔离
- 应用层面：请求上下文中携带租户信息
- 缓存层面：按租户划分缓存空间

### 6.2 账号体系

- 主账号：生产厂家账号，具有最高权限
- 子账号：经销商、运营者、景区管理员等
- 角色权限：基于RBAC模型的细粒度权限控制

## 7. 通信协议

### 7.1 MQTT协议

平台使用EMQX作为MQTT Broker，支持：

- 设备连接认证
- 消息路由
- 规则引擎
- 国密算法加密

### 7.2 其他协议

- JT/T 808：适用于道路运输车辆卫星定位系统
- GB/T 32960：适用于电动汽车远程服务与管理系统

## 8. 数据存储

### 8.1 数据库选择

- PostgreSQL：业务数据存储
- TimescaleDB：时序数据存储（车辆轨迹、传感器数据等）
- ClickHouse：大数据分析
- Redis：缓存和会话存储

### 8.2 数据模型

车辆数据模型示例：

```sql
-- 车辆基本信息表
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) UNIQUE NOT NULL,
    plate_number VARCHAR(20),
    brand VARCHAR(50),
    model VARCHAR(100),
    owner_id BIGINT,
    tenant_id BIGINT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 车辆位置轨迹表（TimescaleDB）
CREATE TABLE vehicle_locations (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    speed DECIMAL(5, 2),
    direction INTEGER,
    timestamp TIMESTAMP NOT NULL,
    tenant_id BIGINT
);
SELECT create_hypertable('vehicle_locations', 'timestamp');
```

## 9. 安全合规

### 9.1 数据安全

- 传输加密：使用TLS/SSL加密通信
- 存储加密：敏感数据使用国密算法加密
- 访问控制：基于角色的权限控制

### 9.2 合规要求

- 符合《网络安全法》
- 符合《数据安全法》
- 符合《个人信息保护法》

## 10. 部署架构

### 10.1 开发环境

使用Docker Compose进行本地开发环境部署。

### 10.2 生产环境

使用Kubernetes进行生产环境部署，支持：

- 自动扩缩容
- 滚动更新
- 健康检查
- 服务发现

## 11. 监控运维

### 11.1 监控指标

- 系统资源：CPU、内存、磁盘、网络
- 业务指标：车辆在线数、消息处理量、响应时间
- 模块状态：各模块运行状态、健康状况

### 11.2 日志管理

- 结构化日志输出
- 日志级别控制
- 日志轮转策略

## 12. 开发最佳实践

### 12.1 代码规范

- 遵循阿里巴巴Java开发手册
- 统一的命名规范
- 适当的注释和文档

### 12.2 测试策略

- 单元测试：覆盖核心业务逻辑
- 集成测试：验证模块间协作
- 性能测试：确保系统性能达标

### 12.3 版本管理

- 使用Git进行版本控制
- 遵循Git Flow工作流
- 语义化版本号管理

## 13. 故障排查

### 13.1 常见问题

- 模块加载失败：检查依赖和权限
- 通信异常：检查网络和协议配置
- 性能问题：分析瓶颈和优化

### 13.2 调试技巧

- 日志分析：通过日志定位问题
- 链路追踪：使用Jaeger进行分布式追踪
- 性能分析：使用JProfiler等工具

---

本开发指南将持续更新，以反映最新的开发实践和架构变化。
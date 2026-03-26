# 模块开发模板

本文档提供了一个标准的模块开发模板，帮助开发者快速创建符合平台规范的新模块。

## 1. 模块目录结构

```
modules/
└── new-module/
    ├── pom.xml                 # Maven配置文件
    ├── module.yaml             # 模块描述文件
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── daod/
    │       │           └── iov/
    │       │               └── modules/
    │       │                   └── newmodule/
    │       │                       ├── NewModule.java      # 模块主类
    │       │                       ├── controller/         # 控制器
    │       │                       ├── service/            # 服务层
    │       │                       ├── repository/         # 数据访问层
    │       │                       └── dto/                # 数据传输对象
    │       └── resources/
    │           ├── application.yml     # 模块配置
    │           └── banner.txt          # 启动横幅
    ├── config/                 # 配置文件
    │   └── module-config.json
    ├── docs/                 # 文档
    │   └── README.md
    └── test/                 # 测试代码
        └── java/
            └── com/
                └── daod/
                    └── iov/
                        └── modules/
                            └── newmodule/
                                └── NewModuleTest.java
```

## 2. 模块主类实现

```java
package com.daod.iov.modules.newmodule;

import com.daod.iov.plugin.*;

/**
 * 新模块实现类
 */
public class NewModule implements IModule {
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;
    private ModuleContext context;

    public NewModule() {
        // 初始化模块元数据
        this.metadata = new ModuleMetadata(
            "new-module",           // 模块名称
            "1.0.0",               // 模块版本
            "新功能模块"             // 模块描述
        );
        
        // 设置模块类型和其他属性
        this.metadata.setType("business");  // core|business|extension|adapter
        this.metadata.setPriority(100);
        
        // 设置初始状态
        this.state = ModuleState.UNINITIALIZED;
        this.healthStatus = HealthStatus.UNKNOWN;
    }

    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }

    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        System.out.println("新模块初始化: " + metadata.getName());
        
        // 模块初始化逻辑
        // 例如：初始化配置、连接数据库、注册服务等
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }

    @Override
    public void start() throws ModuleException {
        System.out.println("新模块启动: " + metadata.getName());
        
        // 模块启动逻辑
        // 例如：启动定时任务、开启监听端口、订阅消息等
        
        state = ModuleState.RUNNING;
        healthStatus = HealthStatus.HEALTHY;
    }

    @Override
    public void stop() throws ModuleException {
        System.out.println("新模块停止: " + metadata.getName());
        
        // 模块停止逻辑
        // 例如：停止定时任务、关闭连接、清理资源等
        
        state = ModuleState.STOPPED;
        healthStatus = HealthStatus.OFFLINE;
    }

    @Override
    public void destroy() throws ModuleException {
        System.out.println("新模块销毁: " + metadata.getName());
        
        // 模块销毁逻辑
        // 例如：释放资源、清理临时文件等
        
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

## 3. 模块描述文件 (module.yaml)

```yaml
apiVersion: iov.daod.com/v1
kind: Module
metadata:
  name: new-module
  version: 1.0.0
  description: 新功能模块
  author: developer
  license: proprietary

spec:
  # 模块类型
  type: business
  
  # 模块优先级 (数字越小优先级越高)
  priority: 100
  
  # 依赖模块
  dependencies:
    - name: common-core
      version: ">=1.0.0"  # 支持语义化版本范围: >=, >, <=, <, =, ^, ~
    - name: plugin-framework
      version: "^1.0.0"   # 使用caret语法兼容主版本
    # 添加其他依赖...
  
  # 提供的扩展点
  extensionPoints:
    - name: new-feature-handler
      interface: com.daod.iov.plugin.NewFeatureHandler
      description: 新功能处理器
  
  # 使用的扩展点
  uses:
    - extensionPoint: event-bus
      handler: newModuleEventHandler
    - extensionPoint: database-access
      handler: newModuleDatabaseHandler
  
  # 配置项定义
  configSchema:
    properties:
      enabled:
        type: boolean
        default: true
        description: 模块是否启用
      maxConnections:
        type: integer
        default: 100
        description: 最大连接数
      threadPoolSize:
        type: integer
        default: 10
        description: 线程池大小
      cacheSize:
        type: integer
        default: 1000
        description: 缓存大小
      
  # 资源需求
  resources:
    cpu: "200m"
    memory: "256Mi"
    
  # 健康检查
  healthCheck:
    liveness: /health/live
    readiness: /health/ready
    
  # 热更新策略
  hotReload:
    enabled: true
    strategy: rolling            # 可选值: rolling, blue-green, canary
    maxUnavailable: 1
```

## 4. Maven配置文件 (pom.xml)

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

    <artifactId>new-module</artifactId>
    <packaging>jar</packaging>

    <name>New Module</name>
    <description>新功能模块</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

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
        
        <!-- Spring Boot Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- 数据库访问 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- PostgreSQL驱动 -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        
        <!-- MyBatis-Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
        </dependency>
        
        <!-- Hutool工具包 -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
        </dependency>
        
        <!-- JWT支持 -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- 测试依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            
            <!-- 打包插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <archive>
                        <manifestEntries>
                            <Module-Class>com.daod.iov.modules.newmodule.NewModule</Module-Class>
                            <Module-Name>new-module</Module-Name>
                            <Module-Version>1.0.0</Module-Version>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 5. 模块配置文件 (src/main/resources/application.yml)

```yaml
# 模块配置
new-module:
  enabled: true
  max-connections: 100
  thread-pool-size: 10
  cache-size: 1000
  # 其他模块特定配置...

# 日志配置
logging:
  level:
    com.daod.iov.modules.newmodule: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# 服务器配置
server:
  port: 8081  # 模块专用端口，避免冲突
```

## 6. 模块控制器示例

```java
package com.daod.iov.modules.newmodule.controller;

import org.springframework.web.bind.annotation.*;

/**
 * 新模块控制器
 */
@RestController
@RequestMapping("/api/new-module")
public class NewModuleController {
    
    @GetMapping("/status")
    public String getStatus() {
        return "New Module is running";
    }
    
    @PostMapping("/process")
    public String processData(@RequestBody String data) {
        // 处理数据逻辑
        return "Processed: " + data;
    }
}
```

## 7. 模块服务层示例

```java
package com.daod.iov.modules.newmodule.service;

import org.springframework.stereotype.Service;

/**
 * 新模块服务层
 */
@Service
public class NewModuleService {
    
    public String processBusinessLogic(String input) {
        // 业务逻辑处理
        return "Processed: " + input;
    }
}
```

## 8. 模块测试类

```java
package com.daod.iov.modules.newmodule;

import com.daod.iov.plugin.ModuleManagerFactory;
import com.daod.iov.plugin.ModuleManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 新模块测试类
 */
class NewModuleTest {
    
    private ModuleManager moduleManager;
    
    @BeforeEach
    void setUp() throws Exception {
        moduleManager = ModuleManagerFactory.getInstance();
        moduleManager.initialize();
    }
    
    @Test
    void testModuleLoadAndStart() throws Exception {
        // 测试模块加载
        // 注意：实际测试时需要提供正确的模块路径
        // IModule module = moduleManager.loadModule("path/to/new-module.jar");
        
        // 测试模块启动
        // moduleManager.startModule("new-module:1.0.0");
        
        // 验证模块状态
        // assertEquals(ModuleState.RUNNING, moduleManager.getModuleState("new-module:1.0.0"));
        
        assertTrue(true); // 替换为实际测试逻辑
    }
}
```

## 9. 模块开发步骤

1. **创建模块目录结构**
   - 按照上述目录结构创建模块文件夹

2. **实现模块主类**
   - 实现IModule接口
   - 定义模块元数据
   - 实现生命周期方法

3. **配置模块描述文件**
   - 编写module.yaml文件
   - 定义模块依赖和扩展点

4. **配置Maven项目**
   - 编写pom.xml文件
   - 添加必要的依赖

5. **实现业务逻辑**
   - 创建控制器、服务、数据访问层
   - 实现具体功能

6. **编写测试代码**
   - 编写单元测试
   - 编写集成测试

7. **打包和部署**
   - 使用Maven打包
   - 部署到模块管理器

## 10. 模块开发最佳实践

1. **遵循单一职责原则**
   - 每个模块只负责一个特定功能

2. **保持松耦合**
   - 通过接口和扩展点进行交互
   - 避免直接依赖其他模块的具体实现

3. **实现健壮的错误处理**
   - 在模块生命周期方法中处理异常
   - 提供有意义的错误信息

4. **提供健康检查**
   - 实现准确的健康状态报告
   - 提供健康检查端点

5. **考虑热更新**
   - 设计可热更新的模块
   - 实现优雅的启动和停止逻辑

6. **编写充分的文档**
   - 为模块功能编写文档
   - 为API编写使用说明

7. **合理使用依赖管理**
   - 使用语义化版本范围指定依赖版本
   - 避免循环依赖
   - 区分必需依赖和可选依赖

通过遵循此模板，您可以快速创建符合平台规范的新模块。
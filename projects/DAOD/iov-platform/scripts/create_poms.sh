#!/bin/bash
# 批量创建业务模块 pom.xml

cd /home/3844778_wy/.openclaw/workspace/projects/DAOD/iov-platform

# 业务模块模板
create_module_pom() {
    local module_name=$1
    local module_desc=$2
    local module_path="modules/$module_name"
    
    cat > "$module_path/pom.xml" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.daod.iov</groupId>
        <artifactId>iov-platform</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../../pom.xml</relativePath>
    </parent>
    
    <artifactId>$module_name</artifactId>
    <name>$module_desc</name>
    <description>$module_desc</description>
    
    <dependencies>
        <!-- Common -->
        <dependency>
            <groupId>com.daod.iov</groupId>
            <artifactId>common-core</artifactId>
            <version>\${project.version}</version>
        </dependency>
        
        <!-- Plugin Framework -->
        <dependency>
            <groupId>com.daod.iov</groupId>
            <artifactId>plugin-framework</artifactId>
            <version>\${project.version}</version>
        </dependency>
        
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
EOF
    echo "✅ $module_name/pom.xml"
}

# 创建各模块 pom.xml
create_module_pom "vehicle-access" "车辆接入服务"
create_module_pom "monitor-service" "监控服务"
create_module_pom "alarm-service" "告警服务"
create_module_pom "auth-service" "认证服务"
create_module_pom "user-service" "用户服务"
create_module_pom "tenant-service" "租户服务"
create_module_pom "role-service" "角色服务"
create_module_pom "sub-account-service" "子账户服务"
create_module_pom "ota-service" "OTA升级服务"
create_module_pom "jtt808-adapter" "JT/T 808协议适配器"
create_module_pom "edge-proxy" "边缘代理"
create_module_pom "vehicle-monitor-service" "车辆监控服务"

echo ""
echo "完成!"
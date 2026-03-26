package com.daod.iov.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * API 网关启动类
 * 
 * 功能:
 * 1. 路由转发 - 将请求转发到对应的后端服务
 * 2. 负载均衡 - 对后端服务进行负载均衡
 * 3. 限流熔断 - 保护后端服务不被过载
 * 4. 认证鉴权 - 统一的认证和权限校验
 * 5. 日志追踪 - 请求链路追踪和日志记录
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        System.out.println("==========================================");
        System.out.println("   API Gateway Started Successfully!");
        System.out.println("   Port: 8080");
        System.out.println("==========================================");
    }
}
package com.daod.iov.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

/**
 * 网关配置类
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Configuration
public class GatewayConfig {
    
    /**
     * IP 限流 Key 解析器
     * 
     * 基于客户端 IP 地址进行限流
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String ip = exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() 
                : "unknown";
            return Mono.just(ip);
        };
    }
    
    /**
     * 用户 ID 限流 Key 解析器
     * 
     * 基于用户 ID 进行限流
     */
    @Bean
    public KeyResolver userIdKeyResolver() {
        return exchange -> {
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            return Mono.just(userId != null ? userId : "anonymous");
        };
    }
    
    /**
     * API 路径限流 Key 解析器
     * 
     * 基于 API 路径进行限流
     */
    @Bean
    public KeyResolver apiKeyResolver() {
        return exchange -> Mono.just(exchange.getRequest().getURI().getPath());
    }
}
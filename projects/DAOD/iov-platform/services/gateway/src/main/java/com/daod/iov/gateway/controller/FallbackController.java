package com.daod.iov.gateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 熔断降级控制器
 * 
 * 当后端服务不可用时，返回友好的降级响应
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * 车辆接入服务降级
     */
    @GetMapping(value = "/vehicle-access", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> vehicleAccessFallback() {
        return createFallbackResponse("车辆接入服务暂时不可用，请稍后重试");
    }
    
    /**
     * 监控服务降级
     */
    @GetMapping(value = "/monitor-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> monitorFallback() {
        return createFallbackResponse("监控服务暂时不可用，请稍后重试");
    }
    
    /**
     * 告警服务降级
     */
    @GetMapping(value = "/alarm-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> alarmFallback() {
        return createFallbackResponse("告警服务暂时不可用，请稍后重试");
    }
    
    /**
     * OTA 服务降级
     */
    @GetMapping(value = "/ota-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> otaFallback() {
        return createFallbackResponse("OTA服务暂时不可用，请稍后重试");
    }
    
    /**
     * 远程控制服务降级
     */
    @GetMapping(value = "/remote-control", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> remoteControlFallback() {
        return createFallbackResponse("远程控制服务暂时不可用，请稍后重试");
    }
    
    /**
     * 用户服务降级
     */
    @GetMapping(value = "/user-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> userFallback() {
        return createFallbackResponse("用户服务暂时不可用，请稍后重试");
    }
    
    /**
     * 认证服务降级
     */
    @GetMapping(value = "/auth-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> authFallback() {
        return createFallbackResponse("认证服务暂时不可用，请稍后重试");
    }
    
    /**
     * 租户服务降级
     */
    @GetMapping(value = "/tenant-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> tenantFallback() {
        return createFallbackResponse("租户服务暂时不可用，请稍后重试");
    }
    
    /**
     * 通用降级响应
     */
    private Mono<String> createFallbackResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 503);
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now().format(formatter));
        response.put("error", "SERVICE_UNAVAILABLE");
        
        try {
            return Mono.just(objectMapper.writeValueAsString(response));
        } catch (Exception e) {
            return Mono.just("{\"code\":503,\"success\":false,\"message\":\"服务暂时不可用\"}");
        }
    }
}
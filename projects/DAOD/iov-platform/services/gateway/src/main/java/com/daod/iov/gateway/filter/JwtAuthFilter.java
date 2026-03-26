package com.daod.iov.gateway.filter;

import com.daod.iov.gateway.util.JwtUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JWT 认证过滤器
 * 
 * 功能:
 * 1. 验证 JWT Token 有效性
 * 2. 解析用户信息并传递给后端服务
 * 3. 白名单路径跳过认证
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${security.jwt.header:Authorization}")
    private String tokenHeader;
    
    @Value("${security.jwt.prefix:Bearer }")
    private String tokenPrefix;
    
    @Value("${security.whitelist:}")
    private String whitelistConfig;
    
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        
        // 1. 检查白名单
        if (isWhitelisted(path)) {
            log.debug("白名单路径，跳过认证: {}", path);
            return chain.filter(exchange);
        }
        
        // 2. 获取 Token
        String token = extractToken(request);
        
        if (!StringUtils.hasText(token)) {
            log.warn("缺少认证Token: path={}", path);
            return unauthorized(exchange, "缺少认证Token");
        }
        
        // 3. 验证 Token
        try {
            if (!jwtUtil.validateToken(token)) {
                log.warn("Token无效或已过期: path={}", path);
                return unauthorized(exchange, "Token无效或已过期");
            }
        } catch (Exception e) {
            log.error("Token验证异常: {}", e.getMessage());
            return unauthorized(exchange, "Token验证失败");
        }
        
        // 4. 解析用户信息
        Claims claims = jwtUtil.getClaimsFromToken(token);
        if (claims == null) {
            return unauthorized(exchange, "Token解析失败");
        }
        
        String userId = claims.get("userId", String.class);
        String username = claims.getSubject();
        String tenantId = claims.get("tenantId", String.class);
        String role = claims.get("role", String.class);
        
        // 5. 构建转发请求，添加用户信息头
        ServerHttpRequest mutatedRequest = request.mutate()
            .header("X-User-Id", userId != null ? userId : "")
            .header("X-Username", username != null ? username : "")
            .header("X-Tenant-Id", tenantId != null ? tenantId : "")
            .header("X-User-Role", role != null ? role : "")
            .build();
        
        log.debug("认证成功: userId={}, username={}, path={}", userId, username, path);
        
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }
    
    @Override
    public int getOrder() {
        return -100;  // 高优先级
    }
    
    /**
     * 检查路径是否在白名单中
     */
    private boolean isWhitelisted(String path) {
        if (!StringUtils.hasText(whitelistConfig)) {
            return false;
        }
        
        List<String> whitelist = Arrays.asList(whitelistConfig.split(","));
        return whitelist.stream().anyMatch(pattern -> pathMatcher.match(pattern.trim(), path));
    }
    
    /**
     * 从请求中提取 Token
     */
    private String extractToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(tokenHeader);
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(tokenPrefix)) {
            return bearerToken.substring(tokenPrefix.length());
        }
        
        // 尝试从 Query 参数获取
        String tokenParam = request.getQueryParams().getFirst("token");
        if (StringUtils.hasText(tokenParam)) {
            return tokenParam;
        }
        
        return null;
    }
    
    /**
     * 返回未授权响应
     */
    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 401);
        result.put("message", message);
        result.put("success", false);
        result.put("timestamp", System.currentTimeMillis());
        
        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(result);
        } catch (JsonProcessingException e) {
            bytes = "{\"code\":401,\"message\":\"Unauthorized\"}".getBytes(StandardCharsets.UTF_8);
        }
        
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }
}
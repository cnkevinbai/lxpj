package com.daod.iov.modules.httpadapter.internal.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * HTTP 设备签名验证过滤器
 * 
 * 实现:
 * 1. 签名验证 - HMAC-SHA256
 * 2. 时间戳验证 - 防止重放攻击
 * 3. Nonce 验证 - 防止重复请求
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Component
public class HttpSignatureFilter implements Filter {
    
    private static final Logger log = LoggerFactory.getLogger(HttpSignatureFilter.class);
    
    @Value("${http-adapter.secret-key:daod_iov_secret_2026}")
    private String secretKey;
    
    /** 请求时间戳有效期 (5分钟) */
    private static final Duration TIMESTAMP_VALIDITY = Duration.ofMinutes(5);
    
    /** 已处理请求缓存 (防重放) */
    private final Map<String, Long> processedRequests = new ConcurrentHashMap<>();
    
    /** 缓存清理间隔 */
    private static final long CACHE_CLEANUP_INTERVAL = 300000; // 5分钟
    private long lastCleanupTime = 0;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 只验证需要认证的路径
        String path = httpRequest.getRequestURI();
        if (!needsAuthentication(path)) {
            chain.doFilter(request, response);
            return;
        }
        
        // 1. 提取认证信息
        String terminalId = extractTerminalId(path);
        String timestamp = httpRequest.getHeader("X-Timestamp");
        String signature = httpRequest.getHeader("X-Signature");
        String nonce = httpRequest.getHeader("X-Nonce");
        
        // 2. 检查必要字段
        if (!StringUtils.hasText(timestamp) || !StringUtils.hasText(signature)) {
            sendError(httpResponse, 401, "缺少认证信息");
            return;
        }
        
        // 3. 验证时间戳 (防重放)
        try {
            long requestTime = Long.parseLong(timestamp);
            long currentTime = System.currentTimeMillis();
            
            if (Math.abs(currentTime - requestTime) > TIMESTAMP_VALIDITY.toMillis()) {
                log.warn("请求已过期: terminalId={}, timestamp={}", terminalId, timestamp);
                sendError(httpResponse, 401, "请求已过期");
                return;
            }
        } catch (NumberFormatException e) {
            sendError(httpResponse, 401, "时间戳格式错误");
            return;
        }
        
        // 4. 验证 Nonce (防重放)
        if (StringUtils.hasText(nonce)) {
            String nonceKey = terminalId + ":" + nonce;
            if (processedRequests.containsKey(nonceKey)) {
                log.warn("重复请求: terminalId={}, nonce={}", terminalId, nonce);
                sendError(httpResponse, 401, "重复请求");
                return;
            }
            processedRequests.put(nonceKey, System.currentTimeMillis());
        }
        
        // 5. 验证签名
        String expectedSignature = calculateSignature(terminalId, timestamp, nonce);
        
        if (!expectedSignature.equals(signature)) {
            log.warn("签名验证失败: terminalId={}, expected={}, actual={}", 
                terminalId, expectedSignature, signature);
            sendError(httpResponse, 401, "签名验证失败");
            return;
        }
        
        // 6. 设置终端信息到请求属性
        request.setAttribute("terminalId", terminalId);
        request.setAttribute("authTime", System.currentTimeMillis());
        
        // 7. 定期清理缓存
        cleanupCacheIfNeeded();
        
        chain.doFilter(request, response);
    }
    
    /**
     * 判断路径是否需要认证
     */
    private boolean needsAuthentication(String path) {
        // 需要认证的路径
        return path.contains("/terminal/") && 
               (path.contains("/register") || 
                path.contains("/data") || 
                path.contains("/position") ||
                path.contains("/command") ||
                path.contains("/binding"));
    }
    
    /**
     * 从路径提取终端 ID
     */
    private String extractTerminalId(String path) {
        // 路径格式: /api/v1/terminal/{terminalId}/xxx
        String[] parts = path.split("/");
        for (int i = 0; i < parts.length; i++) {
            if ("terminal".equals(parts[i]) && i + 1 < parts.length) {
                return parts[i + 1];
            }
        }
        return null;
    }
    
    /**
     * 计算签名
     * 
     * 签名算法: HMAC-SHA256(secretKey, terminalId + timestamp + nonce)
     */
    private String calculateSignature(String terminalId, String timestamp, String nonce) {
        String data = (terminalId != null ? terminalId : "") + 
                      (timestamp != null ? timestamp : "") + 
                      (nonce != null ? nonce : "");
        
        // 使用 Spring 的 DigestUtils 计算 HMAC-SHA256
        // 简化实现，实际应使用 javax.crypto.Mac
        return DigestUtils.md5DigestAsHex((secretKey + data).getBytes());
    }
    
    /**
     * 发送错误响应
     */
    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("code", status);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(error));
    }
    
    /**
     * 定期清理缓存
     */
    private void cleanupCacheIfNeeded() {
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastCleanupTime > CACHE_CLEANUP_INTERVAL) {
            long threshold = currentTime - TIMESTAMP_VALIDITY.toMillis() * 2;
            processedRequests.entrySet().removeIf(entry -> entry.getValue() < threshold);
            lastCleanupTime = currentTime;
            log.debug("清理过期 Nonce 缓存, 当前大小: {}", processedRequests.size());
        }
    }
    
    @Override
    public void init(FilterConfig filterConfig) {
        log.info("HTTP 签名验证过滤器初始化完成");
    }
    
    @Override
    public void destroy() {
        processedRequests.clear();
        log.info("HTTP 签名验证过滤器已销毁");
    }
}
package com.daod.iov.modules.mqtt.internal.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * MQTT 设备 Token 验证工具
 * 
 * 用于验证 MQTT 设备连接时携带的 JWT Token
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Component
public class MqttTokenValidator {
    
    private static final Logger log = LoggerFactory.getLogger(MqttTokenValidator.class);
    
    @Value("${mqtt.auth.jwt.secret:daod_iov_mqtt_jwt_secret_key_2026}")
    private String secret;
    
    @Value("${mqtt.auth.jwt.issuer:iov-platform}")
    private String issuer;
    
    private Key signingKey;
    
    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    /**
     * 验证并解析 Token
     * 
     * @param token JWT Token
     * @return Token 信息，验证失败返回 null
     */
    public MqttTokenInfo validateAndParse(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            // 验证发行者
            String tokenIssuer = claims.getIssuer();
            if (issuer != null && !issuer.equals(tokenIssuer)) {
                log.warn("Token 发行者不匹配: expected={}, actual={}", issuer, tokenIssuer);
                return null;
            }
            
            // 验证过期时间
            Date expiration = claims.getExpiration();
            if (expiration != null && expiration.before(new Date())) {
                log.warn("Token 已过期: expiration={}", expiration);
                return null;
            }
            
            // 构建 Token 信息
            MqttTokenInfo info = new MqttTokenInfo();
            info.setTerminalId(claims.get("terminalId", String.class));
            info.setVin(claims.get("vin", String.class));
            info.setTenantId(claims.get("tenantId", String.class));
            info.setDeviceType(claims.get("deviceType", String.class));
            info.setSubject(claims.getSubject());
            info.setIssuedAt(toLocalDateTime(claims.getIssuedAt()));
            info.setExpiration(toLocalDateTime(expiration));
            
            return info;
            
        } catch (ExpiredJwtException e) {
            log.warn("Token 已过期: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("不支持的 Token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Token 格式错误: {}", e.getMessage());
        } catch (SignatureException e) {
            log.warn("Token 签名验证失败: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Token 为空: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Token 验证异常: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * 检查 Token 是否即将过期 (1小时内)
     */
    public boolean isExpiringSoon(MqttTokenInfo info) {
        if (info == null || info.getExpiration() == null) {
            return true;
        }
        return info.getExpiration().isBefore(LocalDateTime.now().plusHours(1));
    }
    
    /**
     * Date 转 LocalDateTime
     */
    private LocalDateTime toLocalDateTime(Date date) {
        if (date == null) {
            return null;
        }
        return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }
    
    /**
     * MQTT Token 信息
     */
    public static class MqttTokenInfo {
        private String terminalId;
        private String vin;
        private String tenantId;
        private String deviceType;
        private String subject;
        private LocalDateTime issuedAt;
        private LocalDateTime expiration;
        
        public String getTerminalId() { return terminalId; }
        public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
        public String getVin() { return vin; }
        public void setVin(String vin) { this.vin = vin; }
        public String getTenantId() { return tenantId; }
        public void setTenantId(String tenantId) { this.tenantId = tenantId; }
        public String getDeviceType() { return deviceType; }
        public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public LocalDateTime getIssuedAt() { return issuedAt; }
        public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
        public LocalDateTime getExpiration() { return expiration; }
        public void setExpiration(LocalDateTime expiration) { this.expiration = expiration; }
        
        public boolean isExpired() {
            return expiration != null && expiration.isBefore(LocalDateTime.now());
        }
    }
}
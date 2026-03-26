package com.daod.iov.gateway.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 * 
 * 功能:
 * 1. 生成 JWT Token
 * 2. 验证 Token 有效性
 * 3. 解析 Token 获取声明信息
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
@Component
public class JwtUtil {
    
    @Value("${security.jwt.secret:daod_iov_jwt_secret_key_2026}")
    private String secret;
    
    @Value("${security.jwt.expiration:86400000}")
    private Long expiration;
    
    private Key key;
    
    @PostConstruct
    public void init() {
        // 使用密钥生成签名密钥
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    /**
     * 生成 Token
     */
    public String generateToken(String username, String userId, String tenantId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("tenantId", tenantId);
        claims.put("role", role);
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }
    
    /**
     * 验证 Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Token已过期: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("不支持的Token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Token格式错误: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Token为空: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Token验证异常: {}", e.getMessage());
        }
        return false;
    }
    
    /**
     * 从 Token 获取声明
     */
    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            log.error("解析Token失败: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 获取用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.getSubject() : null;
    }
    
    /**
     * 获取过期时间
     */
    public Date getExpirationFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims != null ? claims.getExpiration() : null;
    }
    
    /**
     * 判断 Token 是否过期
     */
    public boolean isTokenExpired(String token) {
        Date expiration = getExpirationFromToken(token);
        return expiration != null && expiration.before(new Date());
    }
    
    /**
     * 刷新 Token
     */
    public String refreshToken(String token) {
        Claims claims = getClaimsFromToken(token);
        if (claims == null) {
            return null;
        }
        
        String username = claims.getSubject();
        String userId = claims.get("userId", String.class);
        String tenantId = claims.get("tenantId", String.class);
        String role = claims.get("role", String.class);
        
        return generateToken(username, userId, tenantId, role);
    }
}
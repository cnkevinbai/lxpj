package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.VehicleAuthService;
import com.daod.iov.modules.vehicleaccess.api.dto.AuthRequest;
import com.daod.iov.modules.vehicleaccess.api.dto.AuthResult;
import com.daod.iov.modules.vehicleaccess.api.dto.AuthSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 车辆认证服务实现
 */
public class VehicleAuthServiceImpl implements VehicleAuthService {
    
    private static final Logger log = LoggerFactory.getLogger(VehicleAuthServiceImpl.class);
    
    /** Token 存储 */
    private final Map<String, AuthSession> tokenStore = new ConcurrentHashMap<>();
    
    /** 会话存储 */
    private final Map<String, AuthSession> sessionStore = new ConcurrentHashMap<>();
    
    /** Token 过期时间 (24小时) */
    private long tokenExpireMs = 24 * 60 * 60 * 1000;
    
    @Override
    public AuthResult authenticate(AuthRequest request) {
        log.info("车辆认证请求: vin={}, deviceId={}, type={}", 
            request.getVin(), request.getDeviceId(), request.getAuthType());
        
        AuthResult result = new AuthResult();
        
        try {
            switch (request.getAuthType()) {
                case VIN:
                    result = authenticateByVin(request.getVin(), request.getDeviceKey());
                    break;
                case DEVICE:
                    result = authenticateByDevice(request.getDeviceId(), request.getDeviceKey());
                    break;
                case TOKEN:
                    boolean valid = validateToken(request.getDeviceKey());
                    result.setSuccess(valid);
                    if (!valid) {
                        result.setErrorCode("INVALID_TOKEN");
                        result.setErrorMessage("Token 无效或已过期");
                    }
                    break;
                default:
                    result.setSuccess(false);
                    result.setErrorCode("UNKNOWN_AUTH_TYPE");
                    result.setErrorMessage("未知的认证类型");
            }
        } catch (Exception e) {
            log.error("认证失败: {}", e.getMessage(), e);
            result.setSuccess(false);
            result.setErrorCode("AUTH_ERROR");
            result.setErrorMessage(e.getMessage());
        }
        
        return result;
    }
    
    @Override
    public AuthResult authenticateByVin(String vin, String deviceKey) {
        AuthResult result = new AuthResult();
        
        // 验证 VIN 和设备密钥
        if (vin == null || vin.isEmpty()) {
            result.setSuccess(false);
            result.setErrorCode("VIN_REQUIRED");
            result.setErrorMessage("VIN 不能为空");
            return result;
        }
        
        if (deviceKey == null || deviceKey.isEmpty()) {
            result.setSuccess(false);
            result.setErrorCode("DEVICE_KEY_REQUIRED");
            result.setErrorMessage("设备密钥不能为空");
            return result;
        }
        
        // 生成 Token
        String accessToken = generateToken();
        String refreshToken = generateToken();
        
        // 创建会话
        AuthSession session = new AuthSession();
        session.setSessionId(UUID.randomUUID().toString());
        session.setVin(vin);
        session.setAccessToken(accessToken);
        session.setCreatedAt(System.currentTimeMillis());
        session.setLastActiveAt(System.currentTimeMillis());
        session.setExpiresAt(System.currentTimeMillis() + tokenExpireMs);
        
        // 存储会话
        tokenStore.put(accessToken, session);
        sessionStore.put(session.getSessionId(), session);
        
        // 设置结果
        result.setSuccess(true);
        result.setAccessToken(accessToken);
        result.setRefreshToken(refreshToken);
        result.setExpiresIn(tokenExpireMs / 1000);
        
        log.info("车辆认证成功: vin={}", vin);
        
        return result;
    }
    
    @Override
    public AuthResult authenticateByDevice(String deviceId, String secret) {
        // 简化实现，与 VIN 认证类似
        AuthResult result = new AuthResult();
        result.setSuccess(true);
        result.setAccessToken(generateToken());
        result.setExpiresIn(tokenExpireMs / 1000);
        return result;
    }
    
    @Override
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        
        AuthSession session = tokenStore.get(token);
        if (session == null) {
            return false;
        }
        
        // 检查是否过期
        if (session.getExpiresAt() < System.currentTimeMillis()) {
            tokenStore.remove(token);
            sessionStore.remove(session.getSessionId());
            return false;
        }
        
        return true;
    }
    
    @Override
    public void invalidateToken(String vin) {
        // 查找并删除该 VIN 的所有会话
        tokenStore.entrySet().removeIf(entry -> {
            if (vin.equals(entry.getValue().getVin())) {
                sessionStore.remove(entry.getValue().getSessionId());
                return true;
            }
            return false;
        });
        
        log.info("Token 已失效: vin={}", vin);
    }
    
    @Override
    public AuthSession getSession(String vin) {
        for (AuthSession session : sessionStore.values()) {
            if (vin.equals(session.getVin())) {
                return session;
            }
        }
        return null;
    }
    
    /**
     * 生成 Token
     */
    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
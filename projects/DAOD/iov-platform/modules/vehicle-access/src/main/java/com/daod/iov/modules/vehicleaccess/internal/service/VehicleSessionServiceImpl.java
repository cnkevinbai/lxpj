package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.VehicleSessionService;
import com.daod.iov.modules.vehicleaccess.api.dto.AuthResult;
import com.daod.iov.modules.vehicleaccess.api.dto.SessionData;
import com.daod.iov.modules.vehicleaccess.api.dto.VehicleSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 车辆会话服务实现
 */
public class VehicleSessionServiceImpl implements VehicleSessionService {
    
    private static final Logger log = LoggerFactory.getLogger(VehicleSessionServiceImpl.class);
    
    /** 会话存储 */
    private final Map<String, VehicleSession> sessionStore = new ConcurrentHashMap<>();
    
    /** VIN-SessionID 映射 */
    private final Map<String, String> vinSessionMap = new ConcurrentHashMap<>();
    
    @Override
    public VehicleSession createSession(String vin, AuthResult authResult) {
        // 关闭旧会话
        String oldSessionId = vinSessionMap.get(vin);
        if (oldSessionId != null) {
            sessionStore.remove(oldSessionId);
        }
        
        // 创建新会话
        String sessionId = UUID.randomUUID().toString();
        Instant now = Instant.now();
        
        VehicleSession session = new VehicleSession();
        session.setSessionId(sessionId);
        session.setVin(vin);
        session.setAccessToken(authResult.getAccessToken());
        session.setCreatedAt(now);
        session.setLastActiveAt(now);
        
        // 设置过期时间 (authResult.getExpiresIn() 秒后)
        if (authResult.getExpiresIn() > 0) {
            session.setExpiresAt(now.plusSeconds(authResult.getExpiresIn()));
        }
        
        session.setAuthResult(authResult);
        session.setState(VehicleSession.SessionState.AUTHENTICATED);
        
        // 存储
        sessionStore.put(sessionId, session);
        vinSessionMap.put(vin, sessionId);
        
        log.info("会话创建成功: vin={}, sessionId={}", vin, sessionId);
        
        return session;
    }
    
    @Override
    public VehicleSession getSession(String sessionId) {
        VehicleSession session = sessionStore.get(sessionId);
        
        if (session != null && session.isExpired()) {
            // 会话已过期
            closeSession(sessionId);
            return null;
        }
        
        return session;
    }
    
    @Override
    public VehicleSession getSessionByVin(String vin) {
        String sessionId = vinSessionMap.get(vin);
        return sessionId != null ? getSession(sessionId) : null;
    }
    
    @Override
    public void updateSession(String sessionId, SessionData data) {
        VehicleSession session = sessionStore.get(sessionId);
        if (session != null) {
            session.setData(data);
            session.setLastActiveAt(Instant.now());
            log.debug("会话更新: sessionId={}", sessionId);
        }
    }
    
    @Override
    public void closeSession(String sessionId) {
        VehicleSession session = sessionStore.remove(sessionId);
        if (session != null) {
            vinSessionMap.remove(session.getVin());
            log.info("会话关闭: vin={}, sessionId={}", session.getVin(), sessionId);
        }
    }
    
    @Override
    public int getActiveSessionCount() {
        // 清理过期会话
        sessionStore.entrySet().removeIf(entry -> entry.getValue().isExpired());
        
        return sessionStore.size();
    }
}
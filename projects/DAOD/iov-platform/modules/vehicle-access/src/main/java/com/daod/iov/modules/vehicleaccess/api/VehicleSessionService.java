package com.daod.iov.modules.vehicleaccess.api;

import com.daod.iov.modules.vehicleaccess.api.dto.*;

/**
 * 车辆会话服务接口
 * 
 * 提供会话管理能力
 */
public interface VehicleSessionService {
    
    /**
     * 创建会话
     * 
     * @param vin 车辆识别码
     * @param authResult 认证结果
     * @return 会话信息
     */
    VehicleSession createSession(String vin, AuthResult authResult);
    
    /**
     * 获取会话
     * 
     * @param sessionId 会话 ID
     * @return 会话信息
     */
    VehicleSession getSession(String sessionId);
    
    /**
     * 通过 VIN 获取会话
     * 
     * @param vin 车辆识别码
     * @return 会话信息
     */
    VehicleSession getSessionByVin(String vin);
    
    /**
     * 更新会话
     * 
     * @param sessionId 会话 ID
     * @param data 会话数据
     */
    void updateSession(String sessionId, SessionData data);
    
    /**
     * 关闭会话
     * 
     * @param sessionId 会话 ID
     */
    void closeSession(String sessionId);
    
    /**
     * 获取活跃会话数
     * 
     * @return 会话数
     */
    int getActiveSessionCount();
}
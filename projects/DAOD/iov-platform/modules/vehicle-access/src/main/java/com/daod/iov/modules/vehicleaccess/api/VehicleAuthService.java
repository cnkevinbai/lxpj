package com.daod.iov.modules.vehicleaccess.api;

import com.daod.iov.modules.vehicleaccess.api.dto.*;

/**
 * 车辆认证服务接口
 * 
 * 提供车辆认证、Token 管理能力
 */
public interface VehicleAuthService {
    
    /**
     * 车辆认证
     * 
     * @param request 认证请求
     * @return 认证结果
     */
    AuthResult authenticate(AuthRequest request);
    
    /**
     * 通过 VIN 认证
     * 
     * @param vin 车辆识别码
     * @param deviceKey 设备密钥
     * @return 认证结果
     */
    AuthResult authenticateByVin(String vin, String deviceKey);
    
    /**
     * 通过设备 ID 认证
     * 
     * @param deviceId 设备 ID
     * @param secret 密钥
     * @return 认证结果
     */
    AuthResult authenticateByDevice(String deviceId, String secret);
    
    /**
     * 验证 Token
     * 
     * @param token Token 字符串
     * @return 是否有效
     */
    boolean validateToken(String token);
    
    /**
     * 使 Token 失效
     * 
     * @param vin 车辆识别码
     */
    void invalidateToken(String vin);
    
    /**
     * 获取会话
     * 
     * @param vin 车辆识别码
     * @return 认证会话
     */
    AuthSession getSession(String vin);
}
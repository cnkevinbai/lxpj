package com.daod.iov.modules.mqtt.api;

import com.daod.iov.modules.mqtt.api.dto.DeviceAuthRequest;
import com.daod.iov.modules.mqtt.api.dto.DeviceAuthResult;

/**
 * 设备认证处理器接口
 * 
 * 用于处理 MQTT 设备的连接认证
 */
public interface DeviceAuthHandler {
    
    /**
     * 处理设备认证
     * 
     * @param request 认证请求
     * @return 认证结果
     */
    DeviceAuthResult handleAuth(DeviceAuthRequest request);
    
    /**
     * 设备连接成功回调
     * 
     * @param clientId 客户端 ID
     * @param terminalId 终端 ID
     */
    void onDeviceConnected(String clientId, String terminalId);
    
    /**
     * 设备断开连接回调
     * 
     * @param clientId 客户端 ID
     * @param terminalId 终端 ID
     */
    void onDeviceDisconnected(String clientId, String terminalId);
}
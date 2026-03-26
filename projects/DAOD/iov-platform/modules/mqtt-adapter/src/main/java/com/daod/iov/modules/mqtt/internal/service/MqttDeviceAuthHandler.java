package com.daod.iov.modules.mqtt.internal.service;

import com.daod.iov.modules.mqtt.api.DeviceAuthHandler;
import com.daod.iov.modules.mqtt.api.dto.DeviceAuthRequest;
import com.daod.iov.modules.mqtt.api.dto.DeviceAuthResult;
import com.daod.iov.modules.vehicleaccess.api.BindingService;
import com.daod.iov.modules.vehicleaccess.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * MQTT 设备认证处理器实现
 * 
 * 实现 MQTT 设备连接认证、Token 验证、设备影子同步
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class MqttDeviceAuthHandler implements DeviceAuthHandler {
    
    private static final Logger log = LoggerFactory.getLogger(MqttDeviceAuthHandler.class);
    
    private final BindingService bindingService;
    private final DeviceShadowService shadowService;
    
    public MqttDeviceAuthHandler(BindingService bindingService, DeviceShadowService shadowService) {
        this.bindingService = bindingService;
        this.shadowService = shadowService;
    }
    
    @Override
    public DeviceAuthResult handleAuth(DeviceAuthRequest request) {
        String clientId = request.getClientId();
        String token = request.getPassword();
        
        log.info("MQTT 设备认证: clientId={}", clientId);
        
        // 1. 解析客户端 ID
        if (!clientId.startsWith("terminal_")) {
            return DeviceAuthResult.failed("无效的客户端ID格式");
        }
        
        String terminalId = clientId.substring(9);  // 去掉 "terminal_" 前缀
        
        // 2. 验证 Token
        TokenInfo tokenInfo = verifyToken(token);
        if (tokenInfo == null) {
            log.warn("Token 验证失败: terminalId={}", terminalId);
            return DeviceAuthResult.failed("Token无效或已过期");
        }
        
        // 3. 获取或创建绑定
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            // 根据 Token 中的 VIN 创建绑定
            String vin = tokenInfo.getVin();
            if (vin == null) {
                return DeviceAuthResult.failed("Token中缺少VIN信息");
            }
            
            binding = bindingService.createBinding(
                terminalId, 
                vin, 
                ProtocolType.MQTT,
                tokenInfo.getTenantId()
            );
        } else if (binding.getStatus() == BindingStatus.UNBOUND) {
            // 重新绑定
            binding = bindingService.rebind(binding.getBindingId());
        } else if (binding.getStatus() == BindingStatus.PENDING_RECOVER) {
            // 恢复绑定
            binding = bindingService.recoverBinding(binding.getBindingId());
        }
        
        // 4. 确认绑定
        if (binding.getStatus() != BindingStatus.BOUND) {
            binding = bindingService.confirmBinding(binding.getBindingId());
        }
        
        // 5. 创建/更新设备影子
        DeviceShadow shadow = shadowService.getOrCreate(terminalId);
        shadow.setConnected(true);
        shadow.setConnectTime(LocalDateTime.now());
        shadow.setProtocol(ProtocolType.MQTT);
        shadow.setDeviceModel(request.getDeviceModel());
        shadow.setFirmwareVersion(request.getFirmwareVersion());
        shadowService.save(shadow);
        
        // 6. 记录事件
        bindingService.recordEvent(BindingEvent.bindSuccess(
            binding.getBindingId(), 
            terminalId, 
            binding.getVin(), 
            ProtocolType.MQTT
        ));
        
        log.info("MQTT 设备认证成功: terminalId={}, vin={}", terminalId, binding.getVin());
        
        return DeviceAuthResult.success(terminalId, binding.getVin());
    }
    
    @Override
    public void onDeviceConnected(String clientId, String terminalId) {
        log.info("MQTT 设备连接成功: terminalId={}", terminalId);
        
        // 1. 更新绑定状态
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        if (binding != null) {
            bindingService.updateLastConfirmTime(binding.getBindingId());
        }
        
        // 2. 更新设备影子
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        if (shadow != null) {
            shadow.setConnected(true);
            shadow.setConnectTime(LocalDateTime.now());
            shadowService.save(shadow);
        }
    }
    
    @Override
    public void onDeviceDisconnected(String clientId, String terminalId) {
        log.info("MQTT 设备断开连接: terminalId={}", terminalId);
        
        // 1. 标记待恢复状态
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        if (binding != null && binding.getStatus() == BindingStatus.BOUND) {
            bindingService.markPendingRecover(binding.getBindingId());
        }
        
        // 2. 更新设备影子
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        if (shadow != null) {
            shadow.setConnected(false);
            shadow.setDisconnectTime(LocalDateTime.now());
            shadowService.save(shadow);
        }
    }
    
    /**
     * 验证 Token
     * 
     * TODO: 实现实际的 JWT Token 验证逻辑
     */
    private TokenInfo verifyToken(String token) {
        // 简化实现，实际应使用 JWT 解析
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        // 模拟 Token 信息
        TokenInfo info = new TokenInfo();
        info.setVin("LDA1234567890ABCD");
        info.setTenantId("T001");
        info.setExpireTime(LocalDateTime.now().plusHours(24));
        
        return info;
    }
    
    /**
     * Token 信息
     */
    private static class TokenInfo {
        private String vin;
        private String tenantId;
        private LocalDateTime expireTime;
        
        public String getVin() { return vin; }
        public void setVin(String vin) { this.vin = vin; }
        public String getTenantId() { return tenantId; }
        public void setTenantId(String tenantId) { this.tenantId = tenantId; }
        public LocalDateTime getExpireTime() { return expireTime; }
        public void setExpireTime(LocalDateTime expireTime) { this.expireTime = expireTime; }
        
        public boolean isExpired() {
            return expireTime != null && expireTime.isBefore(LocalDateTime.now());
        }
    }
}
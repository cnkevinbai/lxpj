package com.daod.iov.modules.jtt808.service;

import com.daod.iov.modules.jtt808.dto.Jtt808RegisterData;
import com.daod.iov.modules.vehicleaccess.api.BindingService;
import com.daod.iov.modules.vehicleaccess.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

/**
 * JT/T 808 认证服务
 * 
 * 处理 JT/T 808 协议的终端注册和鉴权
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class Jtt808AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(Jtt808AuthService.class);
    
    private final BindingService bindingService;
    
    public Jtt808AuthService(BindingService bindingService) {
        this.bindingService = bindingService;
    }
    
    /**
     * 处理终端注册 (消息 0x0100)
     * 
     * @param data 注册数据
     * @return 注册响应
     */
    public Jtt808RegisterResponse handleRegister(Jtt808RegisterData data) {
        String terminalId = data.getTerminalId();
        
        log.info("处理终端注册: terminalId={}, model={}", terminalId, data.getTerminalModel());
        
        // 1. 验证终端信息
        if (!validateTerminalInfo(data)) {
            log.warn("终端信息验证失败: terminalId={}", terminalId);
            return Jtt808RegisterResponse.failed("终端信息验证失败");
        }
        
        // 2. 查询或创建绑定
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            // 新设备，创建待确认绑定
            String vin = extractVin(data);
            binding = bindingService.createPendingBinding(terminalId, vin, ProtocolType.JTT808);
        } else if (binding.getStatus() == BindingStatus.UNBOUND || 
                   binding.getStatus() == BindingStatus.EXPIRED) {
            // 重新绑定
            binding = bindingService.rebind(binding.getBindingId());
        }
        
        // 3. 更新绑定信息
        binding.setDeviceModel(data.getTerminalModel());
        binding.addAttribute("provinceId", data.getProvinceId());
        binding.addAttribute("cityId", data.getCityId());
        binding.addAttribute("manufacturerId", data.getManufacturerId());
        binding.addAttribute("plateColor", data.getPlateColor());
        bindingService.save(binding);
        
        // 4. 获取鉴权码
        String authCode = binding.getAuthCode();
        if (authCode == null || !binding.isAuthCodeValid()) {
            authCode = bindingService.generateAuthCode(terminalId);
            binding.setAuthCode(authCode);
            binding.setAuthCodeExpireTime(LocalDateTime.now().plusHours(24));
            bindingService.save(binding);
        }
        
        log.info("终端注册成功: terminalId={}, authCode={}", terminalId, authCode);
        
        return Jtt808RegisterResponse.success(authCode);
    }
    
    /**
     * 处理终端鉴权 (消息 0x0102)
     * 
     * @param terminalId 终端 ID
     * @param authCode 鉴权码
     * @return 鉴权结果
     */
    public Jtt808AuthResult handleAuth(String terminalId, String authCode) {
        log.info("处理终端鉴权: terminalId={}", terminalId);
        
        // 1. 验证鉴权码
        if (!bindingService.validateAuthCode(terminalId, authCode)) {
            log.warn("鉴权码验证失败: terminalId={}", terminalId);
            return Jtt808AuthResult.failed("鉴权码不正确或已过期");
        }
        
        // 2. 获取绑定信息
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            log.warn("设备未注册: terminalId={}", terminalId);
            return Jtt808AuthResult.failed("设备未注册");
        }
        
        // 3. 确认绑定
        binding = bindingService.confirmBinding(binding.getBindingId());
        
        // 4. 删除鉴权码 (一次性使用)
        bindingService.removeAuthCode(terminalId);
        
        // 5. 记录事件
        bindingService.recordEvent(BindingEvent.authSuccess(
            binding.getBindingId(), terminalId, binding.getVin(), ProtocolType.JTT808
        ));
        
        log.info("终端鉴权成功: terminalId={}, vin={}", terminalId, binding.getVin());
        
        return Jtt808AuthResult.success(binding.getVin());
    }
    
    /**
     * 验证终端信息
     */
    private boolean validateTerminalInfo(Jtt808RegisterData data) {
        // 验证必填字段
        if (data.getTerminalId() == null || data.getTerminalId().isEmpty()) {
            return false;
        }
        
        if (data.getManufacturerId() == null || data.getManufacturerId().isEmpty()) {
            return false;
        }
        
        if (data.getTerminalModel() == null || data.getTerminalModel().isEmpty()) {
            return false;
        }
        
        // 验证省域ID和市域ID
        if (data.getProvinceId() == null || data.getCityId() == null) {
            return false;
        }
        
        return true;
    }
    
    /**
     * 从注册数据中提取 VIN
     * 
     * TODO: 根据实际业务逻辑实现
     */
    private String extractVin(Jtt808RegisterData data) {
        // 简化实现，实际应根据终端ID或其他信息查询VIN
        return "LDA" + System.currentTimeMillis();
    }
    
    // ==================== 内部类 ====================
    
    /**
     * 注册响应
     */
    public static class Jtt808RegisterResponse {
        private boolean success;
        private String authCode;
        private String errorMessage;
        
        public static Jtt808RegisterResponse success(String authCode) {
            Jtt808RegisterResponse response = new Jtt808RegisterResponse();
            response.success = true;
            response.authCode = authCode;
            return response;
        }
        
        public static Jtt808RegisterResponse failed(String errorMessage) {
            Jtt808RegisterResponse response = new Jtt808RegisterResponse();
            response.success = false;
            response.errorMessage = errorMessage;
            return response;
        }
        
        public boolean isSuccess() { return success; }
        public String getAuthCode() { return authCode; }
        public String getErrorMessage() { return errorMessage; }
    }
    
    /**
     * 鉴权结果
     */
    public static class Jtt808AuthResult {
        private boolean success;
        private String vin;
        private String errorMessage;
        
        public static Jtt808AuthResult success(String vin) {
            Jtt808AuthResult result = new Jtt808AuthResult();
            result.success = true;
            result.vin = vin;
            return result;
        }
        
        public static Jtt808AuthResult failed(String errorMessage) {
            Jtt808AuthResult result = new Jtt808AuthResult();
            result.success = false;
            result.errorMessage = errorMessage;
            return result;
        }
        
        public boolean isSuccess() { return success; }
        public String getVin() { return vin; }
        public String getErrorMessage() { return errorMessage; }
    }
}
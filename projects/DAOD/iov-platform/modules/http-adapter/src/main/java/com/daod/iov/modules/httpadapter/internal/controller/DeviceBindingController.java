package com.daod.iov.modules.httpadapter.internal.controller;

import com.daod.iov.modules.httpadapter.api.dto.*;
import com.daod.iov.modules.vehicleaccess.api.BindingService;
import com.daod.iov.modules.vehicleaccess.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * HTTP 设备绑定控制器
 * 
 * 提供设备绑定、解绑、状态查询等 API
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/v1/terminal")
public class DeviceBindingController {
    
    private static final Logger log = LoggerFactory.getLogger(DeviceBindingController.class);
    
    @Resource
    private BindingService bindingService;
    
    /**
     * 设备注册/绑定
     * 
     * POST /api/v1/terminal/{terminalId}/register
     * 
     * 幂等设计: 同一终端重复注册返回已存在的绑定信息
     */
    @PostMapping("/{terminalId}/register")
    public BindingResponse register(
            @PathVariable String terminalId,
            @RequestHeader("X-Timestamp") String timestamp,
            @RequestHeader("X-Nonce") String nonce,
            @RequestHeader("X-Signature") String signature,
            @RequestBody RegisterRequest request) {
        
        log.info("设备注册: terminalId={}, vin={}", terminalId, request.getVin());
        
        try {
            // 1. 幂等检查
            DeviceBinding existingBinding = bindingService.getByDeviceId(terminalId);
            
            if (existingBinding != null) {
                // 已存在绑定，返回现有信息
                if (existingBinding.getVin().equals(request.getVin())) {
                    // 更新最后确认时间
                    bindingService.updateLastConfirmTime(existingBinding.getBindingId());
                    
                    log.info("设备已绑定，返回现有绑定: terminalId={}", terminalId);
                    return BindingResponse.success(existingBinding);
                } else {
                    // VIN 不一致，返回错误
                    log.warn("设备已绑定到其他车辆: terminalId={}, existingVin={}", 
                        terminalId, existingBinding.getVin());
                    return BindingResponse.error("设备已绑定到其他车辆");
                }
            }
            
            // 2. 检查 VIN 是否已绑定其他设备
            DeviceBinding vinBinding = bindingService.getByVin(request.getVin());
            if (vinBinding != null && vinBinding.getStatus() == BindingStatus.BOUND) {
                log.warn("车辆已绑定其他设备: vin={}, existingDeviceId={}", 
                    request.getVin(), vinBinding.getDeviceId());
                return BindingResponse.error("车辆已绑定其他设备");
            }
            
            // 3. 创建绑定 (HTTP 协议，注册即确认)
            DeviceBinding binding = bindingService.createBinding(
                terminalId,
                request.getVin(),
                ProtocolType.HTTP,
                request.getTenantId()
            );
            
            // 4. 设置设备信息
            if (request.getDeviceModel() != null) {
                binding.setDeviceModel(request.getDeviceModel());
            }
            if (request.getDeviceType() != null) {
                binding.setDeviceType(request.getDeviceType());
            }
            bindingService.save(binding);
            
            log.info("设备绑定成功: terminalId={}, vin={}, bindingId={}", 
                terminalId, request.getVin(), binding.getBindingId());
            
            return BindingResponse.success(binding);
            
        } catch (Exception e) {
            log.error("设备绑定失败: terminalId={}", terminalId, e);
            return BindingResponse.error("绑定失败: " + e.getMessage());
        }
    }
    
    /**
     * 数据上报 (同时更新绑定状态)
     * 
     * POST /api/v1/terminal/{terminalId}/data
     */
    @PostMapping("/{terminalId}/data")
    public DataReportResponse reportData(
            @PathVariable String terminalId,
            @RequestBody DataReportRequest request) {
        
        // 1. 验证绑定状态
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null || binding.getStatus() != BindingStatus.BOUND) {
            return DataReportResponse.error("设备未绑定");
        }
        
        // 2. 更新最后确认时间 (心跳保活)
        bindingService.updateLastConfirmTime(binding.getBindingId());
        
        // 3. 处理数据上报
        // TODO: 调用监控服务处理数据
        
        // 4. 返回待处理指令
        return DataReportResponse.success(binding.getVin());
    }
    
    /**
     * 解绑设备
     * 
     * DELETE /api/v1/terminal/{terminalId}/binding
     */
    @DeleteMapping("/{terminalId}/binding")
    public BindingResponse unbind(
            @PathVariable String terminalId,
            @RequestHeader("X-Reason") String reason) {
        
        log.info("解绑设备: terminalId={}, reason={}", terminalId, reason);
        
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            return BindingResponse.error("设备未绑定");
        }
        
        bindingService.unbind(binding.getBindingId(), reason);
        
        return BindingResponse.success(null);
    }
    
    /**
     * 查询绑定状态
     * 
     * GET /api/v1/terminal/{terminalId}/binding
     */
    @GetMapping("/{terminalId}/binding")
    public BindingResponse getBinding(@PathVariable String terminalId) {
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            return BindingResponse.error("设备未绑定");
        }
        
        return BindingResponse.success(binding);
    }
    
    // ==================== 内部 DTO 类 ====================
    
    /**
     * 注册请求
     */
    public static class RegisterRequest {
        private String vin;
        private String tenantId;
        private String deviceType;
        private String deviceModel;
        private String firmwareVersion;
        
        public String getVin() { return vin; }
        public void setVin(String vin) { this.vin = vin; }
        public String getTenantId() { return tenantId; }
        public void setTenantId(String tenantId) { this.tenantId = tenantId; }
        public String getDeviceType() { return deviceType; }
        public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
        public String getDeviceModel() { return deviceModel; }
        public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }
        public String getFirmwareVersion() { return firmwareVersion; }
        public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    }
    
    /**
     * 绑定响应
     */
    public static class BindingResponse {
        private boolean success;
        private String message;
        private BindingData data;
        
        public static BindingResponse success(DeviceBinding binding) {
            BindingResponse response = new BindingResponse();
            response.success = true;
            response.message = "操作成功";
            if (binding != null) {
                response.data = new BindingData(binding);
            }
            return response;
        }
        
        public static BindingResponse error(String message) {
            BindingResponse response = new BindingResponse();
            response.success = false;
            response.message = message;
            return response;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public BindingData getData() { return data; }
    }
    
    /**
     * 绑定数据
     */
    public static class BindingData {
        private String bindingId;
        private String deviceId;
        private String vin;
        private String status;
        private String protocol;
        private String bindTime;
        
        public BindingData(DeviceBinding binding) {
            this.bindingId = binding.getBindingId();
            this.deviceId = binding.getDeviceId();
            this.vin = binding.getVin();
            this.status = binding.getStatus().getCode();
            this.protocol = binding.getProtocol().getCode();
            this.bindTime = binding.getBindTime() != null ? 
                binding.getBindTime().toString() : null;
        }
        
        public String getBindingId() { return bindingId; }
        public String getDeviceId() { return deviceId; }
        public String getVin() { return vin; }
        public String getStatus() { return status; }
        public String getProtocol() { return protocol; }
        public String getBindTime() { return bindTime; }
    }
    
    /**
     * 数据上报响应
     */
    public static class DataReportResponse {
        private boolean success;
        private String message;
        private String vin;
        private long serverTime;
        private int pendingCommands;
        
        public static DataReportResponse success(String vin) {
            DataReportResponse response = new DataReportResponse();
            response.success = true;
            response.vin = vin;
            response.serverTime = System.currentTimeMillis();
            response.pendingCommands = 0;
            return response;
        }
        
        public static DataReportResponse error(String message) {
            DataReportResponse response = new DataReportResponse();
            response.success = false;
            response.message = message;
            return response;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getVin() { return vin; }
        public long getServerTime() { return serverTime; }
        public int getPendingCommands() { return pendingCommands; }
    }
    
    /**
     * 数据上报请求
     */
    public static class DataReportRequest {
        private long timestamp;
        private Object data;
        
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
        public Object getData() { return data; }
        public void setData(Object data) { this.data = data; }
    }
}
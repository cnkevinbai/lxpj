package com.daod.iov.modules.vehicleaccess.api;

import com.daod.iov.modules.vehicleaccess.api.dto.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 设备绑定服务接口
 * 
 * 提供设备与车辆绑定的核心能力，支持三种协议 (JT/T 808、MQTT、HTTP)
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public interface BindingService {
    
    // ==================== 绑定操作 ====================
    
    /**
     * 创建待确认绑定
     * 
     * @param deviceId 设备 ID
     * @param vin 车辆 VIN
     * @param protocol 协议类型
     * @return 绑定信息
     */
    DeviceBinding createPendingBinding(String deviceId, String vin, ProtocolType protocol);
    
    /**
     * 创建并确认绑定 (HTTP 协议使用)
     * 
     * @param deviceId 设备 ID
     * @param vin 车辆 VIN
     * @param protocol 协议类型
     * @param tenantId 租户 ID
     * @return 绑定信息
     */
    DeviceBinding createBinding(String deviceId, String vin, ProtocolType protocol, String tenantId);
    
    /**
     * 确认绑定
     * 
     * @param bindingId 绑定 ID
     * @return 绑定信息
     */
    DeviceBinding confirmBinding(String bindingId);
    
    /**
     * 解绑设备
     * 
     * @param bindingId 绑定 ID
     * @param reason 解绑原因
     */
    void unbind(String bindingId, String reason);
    
    /**
     * 强制解绑 (管理员操作)
     * 
     * @param bindingId 绑定 ID
     * @param operator 操作人
     * @param reason 解绑原因
     */
    void forceUnbind(String bindingId, String operator, String reason);
    
    // ==================== 绑定恢复 ====================
    
    /**
     * 标记待恢复状态
     * 
     * @param bindingId 绑定 ID
     */
    void markPendingRecover(String bindingId);
    
    /**
     * 恢复绑定
     * 
     * @param bindingId 绑定 ID
     * @return 绑定信息
     */
    DeviceBinding recoverBinding(String bindingId);
    
    /**
     * 标记绑定过期
     * 
     * @param bindingId 绑定 ID
     */
    void expireBinding(String bindingId);
    
    /**
     * 重新绑定
     * 
     * @param bindingId 绑定 ID
     * @return 绑定信息
     */
    DeviceBinding rebind(String bindingId);
    
    // ==================== 绑定查询 ====================
    
    /**
     * 通过绑定 ID 获取绑定信息
     * 
     * @param bindingId 绑定 ID
     * @return 绑定信息
     */
    DeviceBinding getById(String bindingId);
    
    /**
     * 通过设备 ID 获取绑定信息
     * 
     * @param deviceId 设备 ID
     * @return 绑定信息
     */
    DeviceBinding getByDeviceId(String deviceId);
    
    /**
     * 通过 VIN 获取绑定信息
     * 
     * @param vin 车辆 VIN
     * @return 绑定信息
     */
    DeviceBinding getByVin(String vin);
    
    /**
     * 通过 VIN 和协议获取绑定信息
     * 
     * @param vin 车辆 VIN
     * @param protocol 协议类型
     * @return 绑定信息
     */
    DeviceBinding getByVinAndProtocol(String vin, ProtocolType protocol);
    
    /**
     * 查询租户下的所有绑定
     * 
     * @param tenantId 租户 ID
     * @return 绑定列表
     */
    List<DeviceBinding> findByTenantId(String tenantId);
    
    /**
     * 查询指定状态的绑定
     * 
     * @param status 绑定状态
     * @return 绑定列表
     */
    List<DeviceBinding> findByStatus(BindingStatus status);
    
    /**
     * 查询需要心跳确认的绑定
     * 
     * @param threshold 超时阈值
     * @return 绑定列表
     */
    List<DeviceBinding> findNeedHeartbeatConfirm(LocalDateTime threshold);
    
    /**
     * 查询需要恢复的绑定
     * 
     * @return 绑定列表
     */
    List<DeviceBinding> findNeedRecovery();
    
    // ==================== 绑定更新 ====================
    
    /**
     * 更新最后确认时间
     * 
     * @param bindingId 绑定 ID
     */
    void updateLastConfirmTime(String bindingId);
    
    /**
     * 更新绑定状态
     * 
     * @param bindingId 绑定 ID
     * @param status 新状态
     */
    void updateStatus(String bindingId, BindingStatus status);
    
    /**
     * 保存绑定信息
     * 
     * @param binding 绑定信息
     */
    void save(DeviceBinding binding);
    
    // ==================== 鉴权码 (JT/T 808) ====================
    
    /**
     * 生成鉴权码
     * 
     * @param deviceId 设备 ID
     * @return 鉴权码
     */
    String generateAuthCode(String deviceId);
    
    /**
     * 验证鉴权码
     * 
     * @param deviceId 设备 ID
     * @param authCode 鉴权码
     * @return 是否有效
     */
    boolean validateAuthCode(String deviceId, String authCode);
    
    /**
     * 删除鉴权码
     * 
     * @param deviceId 设备 ID
     */
    void removeAuthCode(String deviceId);
    
    // ==================== 事件记录 ====================
    
    /**
     * 记录绑定事件
     * 
     * @param event 绑定事件
     */
    void recordEvent(BindingEvent event);
    
    /**
     * 查询绑定事件历史
     * 
     * @param bindingId 绑定 ID
     * @param limit 限制数量
     * @return 事件列表
     */
    List<BindingEvent> getEventHistory(String bindingId, int limit);
    
    // ==================== 统计信息 ====================
    
    /**
     * 获取绑定统计信息
     * 
     * @param tenantId 租户 ID
     * @return 统计信息
     */
    BindingStatistics getStatistics(String tenantId);
    
    /**
     * 获取协议绑定数量
     * 
     * @param protocol 协议类型
     * @return 绑定数量
     */
    long countByProtocol(ProtocolType protocol);
    
    /**
     * 获取在线设备数量
     * 
     * @param tenantId 租户 ID (可选)
     * @return 在线设备数量
     */
    long countOnline(String tenantId);
}
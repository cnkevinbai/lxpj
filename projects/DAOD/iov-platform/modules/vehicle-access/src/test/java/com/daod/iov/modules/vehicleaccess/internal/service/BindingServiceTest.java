package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.BindingService;
import com.daod.iov.modules.vehicleaccess.api.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * BindingService 单元测试
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class BindingServiceTest {
    
    @InjectMocks
    private BindingServiceImpl bindingService;
    
    private String testDeviceId;
    private String testVin;
    
    @BeforeEach
    void setUp() {
        testDeviceId = "13800001111";
        testVin = "LDA1234567890ABCD";
    }
    
    @Test
    @DisplayName("创建待确认绑定 - 成功")
    void testCreatePendingBinding_Success() {
        // When
        DeviceBinding binding = bindingService.createPendingBinding(
            testDeviceId, 
            testVin, 
            ProtocolType.JTT808
        );
        
        // Then
        assertNotNull(binding);
        assertNotNull(binding.getBindingId());
        assertEquals(testDeviceId, binding.getDeviceId());
        assertEquals(testVin, binding.getVin());
        assertEquals(ProtocolType.JTT808, binding.getProtocol());
        assertEquals(BindingStatus.PENDING, binding.getStatus());
        assertNotNull(binding.getBindTime());
    }
    
    @Test
    @DisplayName("创建并确认绑定 - HTTP协议")
    void testCreateBinding_HTTP_Success() {
        // When
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId,
            testVin,
            ProtocolType.HTTP,
            "T001"
        );
        
        // Then
        assertNotNull(binding);
        assertEquals(BindingStatus.BOUND, binding.getStatus());
        assertEquals("T001", binding.getTenantId());
    }
    
    @Test
    @DisplayName("确认绑定 - 成功")
    void testConfirmBinding_Success() {
        // Given
        DeviceBinding pendingBinding = bindingService.createPendingBinding(
            testDeviceId, testVin, ProtocolType.JTT808
        );
        
        // When
        DeviceBinding confirmedBinding = bindingService.confirmBinding(pendingBinding.getBindingId());
        
        // Then
        assertEquals(BindingStatus.BOUND, confirmedBinding.getStatus());
        assertNotNull(confirmedBinding.getLastConfirmTime());
    }
    
    @Test
    @DisplayName("确认绑定 - 绑定不存在")
    void testConfirmBinding_NotFound() {
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            bindingService.confirmBinding("NON_EXISTENT_ID");
        });
    }
    
    @Test
    @DisplayName("解绑设备 - 成功")
    void testUnbind_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        bindingService.unbind(binding.getBindingId(), "测试解绑");
        
        // Then
        DeviceBinding unboundBinding = bindingService.getById(binding.getBindingId());
        assertEquals(BindingStatus.UNBOUND, unboundBinding.getStatus());
    }
    
    @Test
    @DisplayName("标记待恢复状态 - 成功")
    void testMarkPendingRecover_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        bindingService.markPendingRecover(binding.getBindingId());
        
        // Then
        DeviceBinding recoveredBinding = bindingService.getById(binding.getBindingId());
        assertEquals(BindingStatus.PENDING_RECOVER, recoveredBinding.getStatus());
    }
    
    @Test
    @DisplayName("恢复绑定 - 成功")
    void testRecoverBinding_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        bindingService.markPendingRecover(binding.getBindingId());
        
        // When
        DeviceBinding recoveredBinding = bindingService.recoverBinding(binding.getBindingId());
        
        // Then
        assertEquals(BindingStatus.BOUND, recoveredBinding.getStatus());
        assertNotNull(recoveredBinding.getLastConfirmTime());
    }
    
    @Test
    @DisplayName("标记绑定过期 - 成功")
    void testExpireBinding_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        bindingService.expireBinding(binding.getBindingId());
        
        // Then
        DeviceBinding expiredBinding = bindingService.getById(binding.getBindingId());
        assertEquals(BindingStatus.EXPIRED, expiredBinding.getStatus());
    }
    
    @Test
    @DisplayName("通过设备ID获取绑定 - 成功")
    void testGetByDeviceId_Success() {
        // Given
        DeviceBinding created = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        DeviceBinding found = bindingService.getByDeviceId(testDeviceId);
        
        // Then
        assertNotNull(found);
        assertEquals(created.getBindingId(), found.getBindingId());
    }
    
    @Test
    @DisplayName("通过设备ID获取绑定 - 不存在")
    void testGetByDeviceId_NotFound() {
        // When
        DeviceBinding found = bindingService.getByDeviceId("NON_EXISTENT");
        
        // Then
        assertNull(found);
    }
    
    @Test
    @DisplayName("通过VIN获取绑定 - 成功")
    void testGetByVin_Success() {
        // Given
        DeviceBinding created = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        DeviceBinding found = bindingService.getByVin(testVin);
        
        // Then
        assertNotNull(found);
        assertEquals(created.getBindingId(), found.getBindingId());
    }
    
    @Test
    @DisplayName("按状态查询绑定 - 成功")
    void testFindByStatus_Success() {
        // Given
        bindingService.createBinding("DEVICE_1", "VIN_001", ProtocolType.JTT808, "T001");
        bindingService.createBinding("DEVICE_2", "VIN_002", ProtocolType.MQTT, "T001");
        DeviceBinding pendingBinding = bindingService.createPendingBinding(
            "DEVICE_3", "VIN_003", ProtocolType.HTTP
        );
        
        // When
        List<DeviceBinding> boundList = bindingService.findByStatus(BindingStatus.BOUND);
        List<DeviceBinding> pendingList = bindingService.findByStatus(BindingStatus.PENDING);
        
        // Then
        assertEquals(2, boundList.size());
        assertEquals(1, pendingList.size());
    }
    
    @Test
    @DisplayName("生成鉴权码 - 成功")
    void testGenerateAuthCode_Success() {
        // When
        String authCode = bindingService.generateAuthCode(testDeviceId);
        
        // Then
        assertNotNull(authCode);
        assertEquals(20, authCode.length());  // 时间戳8位 + 随机数8位 + 校验位4位
    }
    
    @Test
    @DisplayName("验证鉴权码 - 有效")
    void testValidateAuthCode_Valid() {
        // Given
        String authCode = bindingService.generateAuthCode(testDeviceId);
        
        // When
        boolean isValid = bindingService.validateAuthCode(testDeviceId, authCode);
        
        // Then
        assertTrue(isValid);
    }
    
    @Test
    @DisplayName("验证鉴权码 - 无效")
    void testValidateAuthCode_Invalid() {
        // Given
        bindingService.generateAuthCode(testDeviceId);
        
        // When
        boolean isValid = bindingService.validateAuthCode(testDeviceId, "INVALID_CODE");
        
        // Then
        assertFalse(isValid);
    }
    
    @Test
    @DisplayName("删除鉴权码 - 成功")
    void testRemoveAuthCode_Success() {
        // Given
        String authCode = bindingService.generateAuthCode(testDeviceId);
        
        // When
        bindingService.removeAuthCode(testDeviceId);
        
        // Then
        boolean isValid = bindingService.validateAuthCode(testDeviceId, authCode);
        assertFalse(isValid);
    }
    
    @Test
    @DisplayName("记录绑定事件 - 成功")
    void testRecordEvent_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        BindingEvent event = BindingEvent.bindSuccess(
            binding.getBindingId(),
            testDeviceId,
            testVin,
            ProtocolType.JTT808
        );
        
        // When
        bindingService.recordEvent(event);
        
        // Then
        List<BindingEvent> events = bindingService.getEventHistory(binding.getBindingId(), 10);
        assertFalse(events.isEmpty());
        assertEquals(BindingEventType.BIND_SUCCESS, events.get(0).getEventType());
    }
    
    @Test
    @DisplayName("获取统计信息 - 成功")
    void testGetStatistics_Success() {
        // Given
        bindingService.createBinding("DEVICE_1", "VIN_001", ProtocolType.JTT808, "T001");
        bindingService.createBinding("DEVICE_2", "VIN_002", ProtocolType.MQTT, "T001");
        bindingService.createBinding("DEVICE_3", "VIN_003", ProtocolType.HTTP, "T001");
        
        // When
        BindingStatistics stats = bindingService.getStatistics("T001");
        
        // Then
        assertNotNull(stats);
        assertEquals(3, stats.getTotalBindings());
        assertEquals(1, stats.getJtt808Bindings());
        assertEquals(1, stats.getMqttBindings());
        assertEquals(1, stats.getHttpBindings());
    }
    
    @Test
    @DisplayName("按协议统计绑定数 - 成功")
    void testCountByProtocol_Success() {
        // Given
        bindingService.createBinding("DEVICE_1", "VIN_001", ProtocolType.JTT808, "T001");
        bindingService.createBinding("DEVICE_2", "VIN_002", ProtocolType.JTT808, "T001");
        bindingService.createBinding("DEVICE_3", "VIN_003", ProtocolType.MQTT, "T001");
        
        // When
        long jtt808Count = bindingService.countByProtocol(ProtocolType.JTT808);
        long mqttCount = bindingService.countByProtocol(ProtocolType.MQTT);
        long httpCount = bindingService.countByProtocol(ProtocolType.HTTP);
        
        // Then
        assertEquals(2, jtt808Count);
        assertEquals(1, mqttCount);
        assertEquals(0, httpCount);
    }
    
    @Test
    @DisplayName("更新最后确认时间 - 成功")
    void testUpdateLastConfirmTime_Success() {
        // Given
        DeviceBinding binding = bindingService.createBinding(
            testDeviceId, testVin, ProtocolType.JTT808, "T001"
        );
        
        // When
        bindingService.updateLastConfirmTime(binding.getBindingId());
        
        // Then
        DeviceBinding updated = bindingService.getById(binding.getBindingId());
        assertNotNull(updated.getLastConfirmTime());
    }
    
    @Test
    @DisplayName("绑定状态枚举 - 活跃状态判断")
    void testBindingStatus_IsActive() {
        assertTrue(BindingStatus.BOUND.isActive());
        assertTrue(BindingStatus.PENDING_RECOVER.isActive());
        assertFalse(BindingStatus.UNBOUND.isActive());
        assertFalse(BindingStatus.EXPIRED.isActive());
        assertFalse(BindingStatus.ERROR.isActive());
    }
    
    @Test
    @DisplayName("绑定状态枚举 - 需要恢复判断")
    void testBindingStatus_NeedsRecovery() {
        assertTrue(BindingStatus.PENDING_RECOVER.needsRecovery());
        assertTrue(BindingStatus.ERROR.needsRecovery());
        assertFalse(BindingStatus.BOUND.needsRecovery());
    }
    
    @Test
    @DisplayName("协议类型枚举 - 长连接判断")
    void testProtocolType_IsLongConnection() {
        assertTrue(ProtocolType.JTT808.isLongConnection());
        assertTrue(ProtocolType.MQTT.isLongConnection());
        assertFalse(ProtocolType.HTTP.isLongConnection());
    }
    
    @Test
    @DisplayName("协议类型枚举 - 心跳超时时间")
    void testProtocolType_HeartbeatTimeout() {
        assertEquals(5, ProtocolType.JTT808.getHeartbeatTimeoutMinutes());
        assertEquals(5, ProtocolType.MQTT.getHeartbeatTimeoutMinutes());
        assertEquals(10, ProtocolType.HTTP.getHeartbeatTimeoutMinutes());
    }
}
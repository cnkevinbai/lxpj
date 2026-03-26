package com.daod.iov.modules.mqtt.internal.service;

import com.daod.iov.modules.mqtt.api.DeviceShadowService;
import com.daod.iov.modules.mqtt.api.dto.DeviceShadow;
import com.daod.iov.modules.vehicleaccess.api.dto.ProtocolType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 设备影子服务实现
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class DeviceShadowServiceImpl implements DeviceShadowService {
    
    private static final Logger log = LoggerFactory.getLogger(DeviceShadowServiceImpl.class);
    
    /** 设备影子缓存 */
    private final Map<String, DeviceShadow> shadowStore = new ConcurrentHashMap<>();
    
    @Override
    public DeviceShadow getByDeviceId(String terminalId) {
        return shadowStore.get(terminalId);
    }
    
    @Override
    public DeviceShadow getOrCreate(String terminalId) {
        return shadowStore.computeIfAbsent(terminalId, id -> {
            log.debug("创建设备影子: terminalId={}", id);
            return new DeviceShadow(id);
        });
    }
    
    @Override
    public void save(DeviceShadow shadow) {
        shadow.setUpdatedAt(LocalDateTime.now());
        shadowStore.put(shadow.getTerminalId(), shadow);
        log.debug("保存设备影子: terminalId={}", shadow.getTerminalId());
    }
    
    @Override
    public void updateReported(String terminalId, Map<String, Object> state) {
        DeviceShadow shadow = getOrCreate(terminalId);
        shadow.updateReported(state);
        save(shadow);
        log.info("更新报告状态: terminalId={}, version={}", terminalId, shadow.getReportedVersion());
    }
    
    @Override
    public void updateDesired(String terminalId, Map<String, Object> state) {
        DeviceShadow shadow = getOrCreate(terminalId);
        shadow.updateDesired(state);
        save(shadow);
        log.info("更新期望状态: terminalId={}, version={}", terminalId, shadow.getDesiredVersion());
    }
    
    @Override
    public void syncDesiredToDevice(String terminalId) {
        DeviceShadow shadow = getByDeviceId(terminalId);
        if (shadow == null || !shadow.isConnected()) {
            log.warn("设备离线，无法同步: terminalId={}", terminalId);
            return;
        }
        
        if (!shadow.hasPendingDesired()) {
            log.debug("无待同步的期望状态: terminalId={}", terminalId);
            return;
        }
        
        // TODO: 实际发布 MQTT 消息到设备
        log.info("同步期望状态到设备: terminalId={}, desired={}", terminalId, shadow.getDesired());
        
        // 清除已同步的期望状态
        shadow.clearDesired();
        save(shadow);
    }
    
    @Override
    public List<DeviceShadow> findHttpDevicesNotReportedSince(LocalDateTime threshold) {
        List<DeviceShadow> result = new ArrayList<>();
        
        for (DeviceShadow shadow : shadowStore.values()) {
            if (shadow.getProtocol() == ProtocolType.HTTP) {
                LocalDateTime lastReport = shadow.getLastReportTime();
                if (lastReport == null || lastReport.isBefore(threshold)) {
                    result.add(shadow);
                }
            }
        }
        
        return result;
    }
    
    @Override
    public void updateBindingState(String terminalId, String status) {
        DeviceShadow shadow = getByDeviceId(terminalId);
        if (shadow != null) {
            // 可以添加绑定状态属性到 reported 中
            shadow.getReported().put("bindingStatus", status);
            save(shadow);
        }
    }
}
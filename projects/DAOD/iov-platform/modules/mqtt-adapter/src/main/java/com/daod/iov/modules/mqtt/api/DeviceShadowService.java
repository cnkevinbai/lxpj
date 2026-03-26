package com.daod.iov.modules.mqtt.api;

import com.daod.iov.modules.mqtt.api.dto.DeviceShadow;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 设备影子服务接口
 * 
 * 管理 MQTT 设备的状态缓存和同步
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public interface DeviceShadowService {
    
    /**
     * 获取设备影子
     * 
     * @param terminalId 终端 ID
     * @return 设备影子
     */
    DeviceShadow getByDeviceId(String terminalId);
    
    /**
     * 获取或创建设备影子
     * 
     * @param terminalId 终端 ID
     * @return 设备影子
     */
    DeviceShadow getOrCreate(String terminalId);
    
    /**
     * 保存设备影子
     * 
     * @param shadow 设备影子
     */
    void save(DeviceShadow shadow);
    
    /**
     * 更新报告状态 (设备上报)
     * 
     * @param terminalId 终端 ID
     * @param state 状态
     */
    void updateReported(String terminalId, Map<String, Object> state);
    
    /**
     * 更新期望状态 (平台下发)
     * 
     * @param terminalId 终端 ID
     * @param state 状态
     */
    void updateDesired(String terminalId, Map<String, Object> state);
    
    /**
     * 同步期望状态到设备
     * 
     * @param terminalId 终端 ID
     */
    void syncDesiredToDevice(String terminalId);
    
    /**
     * 查询自指定时间以来未上报的 HTTP 设备
     * 
     * @param threshold 时间阈值
     * @return 设备影子列表
     */
    List<DeviceShadow> findHttpDevicesNotReportedSince(LocalDateTime threshold);
    
    /**
     * 更新绑定状态
     * 
     * @param terminalId 终端 ID
     * @param status 绑定状态
     */
    void updateBindingState(String terminalId, String status);
}
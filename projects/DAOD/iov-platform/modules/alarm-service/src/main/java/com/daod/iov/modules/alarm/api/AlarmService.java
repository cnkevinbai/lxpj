package com.daod.iov.modules.alarm.api;

import com.daod.iov.modules.alarm.api.dto.*;
import java.util.List;

/**
 * 告警服务接口
 */
public interface AlarmService {
    
    /**
     * 创建告警
     */
    AlarmInfo createAlarm(AlarmCreateRequest request);
    
    /**
     * 获取告警列表
     */
    PageResult<AlarmInfo> getAlarmList(AlarmQueryRequest request);
    
    /**
     * 获取告警详情
     */
    AlarmInfo getAlarmDetail(String alarmId);
    
    /**
     * 处理告警
     */
    AlarmInfo handleAlarm(String alarmId, AlarmHandleRequest request);
    
    /**
     * 批量处理告警
     */
    int batchHandle(List<String> alarmIds, AlarmHandleRequest request);
    
    /**
     * 忽略告警
     */
    void ignoreAlarm(String alarmId);
    
    /**
     * 获取告警统计
     */
    AlarmStatistics getStatistics(String tenantId);
}
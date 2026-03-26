package com.daod.iov.modules.alarm.api.dto;

import java.time.Instant;

/**
 * 告警查询请求
 */
public class AlarmQueryRequest {
    
    /** 租户 ID */
    private String tenantId;
    
    /** 告警类型 */
    private AlarmType alarmType;
    
    /** 告警级别 */
    private AlarmLevel alarmLevel;
    
    /** 告警状态 */
    private AlarmStatus alarmStatus;
    
    /** 车辆 ID */
    private String vehicleId;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 关键词 */
    private String keyword;
    
    /** 开始时间 */
    private Instant startTime;
    
    /** 结束时间 */
    private Instant endTime;
    
    /** 页码 */
    private int page = 1;
    
    /** 每页数量 */
    private int pageSize = 20;
    
    // Getters and Setters
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public AlarmType getAlarmType() { return alarmType; }
    public void setAlarmType(AlarmType alarmType) { this.alarmType = alarmType; }
    
    public AlarmLevel getAlarmLevel() { return alarmLevel; }
    public void setAlarmLevel(AlarmLevel alarmLevel) { this.alarmLevel = alarmLevel; }
    
    public AlarmStatus getAlarmStatus() { return alarmStatus; }
    public void setAlarmStatus(AlarmStatus alarmStatus) { this.alarmStatus = alarmStatus; }
    
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
}
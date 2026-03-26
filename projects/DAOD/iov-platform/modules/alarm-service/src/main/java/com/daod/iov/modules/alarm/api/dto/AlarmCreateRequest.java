package com.daod.iov.modules.alarm.api.dto;

import javax.validation.constraints.NotNull;
import java.time.Instant;

/**
 * 告警创建请求
 */
public class AlarmCreateRequest {
    
    /** 告警类型 */
    @NotNull(message = "告警类型不能为空")
    private AlarmType alarmType;
    
    /** 告警级别 */
    @NotNull(message = "告警级别不能为空")
    private AlarmLevel alarmLevel;
    
    /** 告警标题 */
    @NotNull(message = "告警标题不能为空")
    private String title;
    
    /** 告警内容 */
    private String content;
    
    /** 车辆 ID */
    private String vehicleId;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 租户 ID */
    @NotNull(message = "租户ID不能为空")
    private String tenantId;
    
    /** 纬度 */
    private Double latitude;
    
    /** 经度 */
    private Double longitude;
    
    /** 地址 */
    private String address;
    
    /** 发生时间 */
    private Instant occurTime;
    
    /** 扩展数据 */
    private String extraData;
    
    // Getters and Setters
    public AlarmType getAlarmType() { return alarmType; }
    public void setAlarmType(AlarmType alarmType) { this.alarmType = alarmType; }
    
    public AlarmLevel getAlarmLevel() { return alarmLevel; }
    public void setAlarmLevel(AlarmLevel alarmLevel) { this.alarmLevel = alarmLevel; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public Instant getOccurTime() { return occurTime; }
    public void setOccurTime(Instant occurTime) { this.occurTime = occurTime; }
    
    public String getExtraData() { return extraData; }
    public void setExtraData(String extraData) { this.extraData = extraData; }
}
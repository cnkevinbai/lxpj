package com.daod.iov.modules.alarm.api.dto;

/**
 * 告警信息
 */
public class AlarmInfo {
    
    private String id;
    private String alarmNo;
    private AlarmType type;
    private AlarmLevel level;
    private AlarmStatus status;
    private String title;
    private String content;
    private String vehicleId;
    private String vehicleNo;
    private String terminalId;
    private GeoPoint location;
    private long occurTime;
    private long handleTime;
    private String handler;
    private String handleNote;
    private String tenantId;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAlarmNo() { return alarmNo; }
    public void setAlarmNo(String alarmNo) { this.alarmNo = alarmNo; }
    public AlarmType getType() { return type; }
    public void setType(AlarmType type) { this.type = type; }
    public AlarmLevel getLevel() { return level; }
    public void setLevel(AlarmLevel level) { this.level = level; }
    public AlarmStatus getStatus() { return status; }
    public void setStatus(AlarmStatus status) { this.status = status; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    public GeoPoint getLocation() { return location; }
    public void setLocation(GeoPoint location) { this.location = location; }
    public long getOccurTime() { return occurTime; }
    public void setOccurTime(long occurTime) { this.occurTime = occurTime; }
    public long getHandleTime() { return handleTime; }
    public void setHandleTime(long handleTime) { this.handleTime = handleTime; }
    public String getHandler() { return handler; }
    public void setHandler(String handler) { this.handler = handler; }
    public String getHandleNote() { return handleNote; }
    public void setHandleNote(String handleNote) { this.handleNote = handleNote; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
}
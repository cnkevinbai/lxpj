package com.daod.iov.modules.mqtt.api.dto;

import com.daod.iov.modules.vehicleaccess.api.dto.ProtocolType;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 设备影子
 * 
 * 缓存设备的当前状态和期望状态，支持双向同步
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class DeviceShadow {
    
    /** 终端 ID */
    private String terminalId;
    
    /** 是否在线 */
    private boolean connected;
    
    /** 连接时间 */
    private LocalDateTime connectTime;
    
    /** 断开时间 */
    private LocalDateTime disconnectTime;
    
    /** 协议类型 */
    private ProtocolType protocol;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 报告状态 (设备上报) */
    private Map<String, Object> reported;
    
    /** 报告状态版本号 */
    private int reportedVersion;
    
    /** 期望状态 (平台下发) */
    private Map<String, Object> desired;
    
    /** 期望状态版本号 */
    private int desiredVersion;
    
    /** 最后上报时间 */
    private LocalDateTime lastReportTime;
    
    /** 创建时间 */
    private LocalDateTime createdAt;
    
    /** 更新时间 */
    private LocalDateTime updatedAt;
    
    // ==================== 构造函数 ====================
    
    public DeviceShadow() {
        this.reported = new HashMap<>();
        this.desired = new HashMap<>();
        this.reportedVersion = 0;
        this.desiredVersion = 0;
        this.createdAt = LocalDateTime.now();
    }
    
    public DeviceShadow(String terminalId) {
        this();
        this.terminalId = terminalId;
    }
    
    // ==================== 业务方法 ====================
    
    /**
     * 判断是否有待同步的期望状态
     */
    public boolean hasPendingDesired() {
        return desired != null && !desired.isEmpty();
    }
    
    /**
     * 更新报告状态
     */
    public void updateReported(Map<String, Object> state) {
        if (this.reported == null) {
            this.reported = new HashMap<>();
        }
        this.reported.putAll(state);
        this.reportedVersion++;
        this.lastReportTime = LocalDateTime.now();
    }
    
    /**
     * 更新期望状态
     */
    public void updateDesired(Map<String, Object> state) {
        if (this.desired == null) {
            this.desired = new HashMap<>();
        }
        this.desired.putAll(state);
        this.desiredVersion++;
    }
    
    /**
     * 清除期望状态 (设备已同步)
     */
    public void clearDesired() {
        this.desired.clear();
    }
    
    // ==================== Getters and Setters ====================
    
    public String getTerminalId() {
        return terminalId;
    }
    
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }
    
    public boolean isConnected() {
        return connected;
    }
    
    public void setConnected(boolean connected) {
        this.connected = connected;
    }
    
    public LocalDateTime getConnectTime() {
        return connectTime;
    }
    
    public void setConnectTime(LocalDateTime connectTime) {
        this.connectTime = connectTime;
    }
    
    public LocalDateTime getDisconnectTime() {
        return disconnectTime;
    }
    
    public void setDisconnectTime(LocalDateTime disconnectTime) {
        this.disconnectTime = disconnectTime;
    }
    
    public ProtocolType getProtocol() {
        return protocol;
    }
    
    public void setProtocol(ProtocolType protocol) {
        this.protocol = protocol;
    }
    
    public String getDeviceModel() {
        return deviceModel;
    }
    
    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }
    
    public String getFirmwareVersion() {
        return firmwareVersion;
    }
    
    public void setFirmwareVersion(String firmwareVersion) {
        this.firmwareVersion = firmwareVersion;
    }
    
    public Map<String, Object> getReported() {
        return reported;
    }
    
    public void setReported(Map<String, Object> reported) {
        this.reported = reported;
    }
    
    public int getReportedVersion() {
        return reportedVersion;
    }
    
    public void setReportedVersion(int reportedVersion) {
        this.reportedVersion = reportedVersion;
    }
    
    public Map<String, Object> getDesired() {
        return desired;
    }
    
    public void setDesired(Map<String, Object> desired) {
        this.desired = desired;
    }
    
    public int getDesiredVersion() {
        return desiredVersion;
    }
    
    public void setDesiredVersion(int desiredVersion) {
        this.desiredVersion = desiredVersion;
    }
    
    public LocalDateTime getLastReportTime() {
        return lastReportTime;
    }
    
    public void setLastReportTime(LocalDateTime lastReportTime) {
        this.lastReportTime = lastReportTime;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
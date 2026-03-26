package com.daod.iov.modules.httpadapter.api.dto;

import javax.validation.constraints.NotBlank;
import java.util.Map;

/**
 * 数据上报请求
 */
public class DataReportRequest {
    
    /** 终端 ID */
    @NotBlank(message = "终端ID不能为空")
    private String terminalId;
    
    /** 时间戳 */
    private Long timestamp;
    
    /** 车辆状态 */
    private String vehicleStatus;
    
    /** 速度 (km/h) */
    private Double speed;
    
    /** 电量 (%) */
    private Integer batteryLevel;
    
    /** 里程 (km) */
    private Double mileage;
    
    /** SOC (%) */
    private Integer soc;
    
    /** 温度 (℃) */
    private Double temperature;
    
    /** 信号强度 */
    private Integer signalStrength;
    
    /** 位置信息 */
    private PositionInfo position;
    
    /** 扩展数据 */
    private Map<String, Object> extra;
    
    // Getters and Setters
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
    
    public String getVehicleStatus() { return vehicleStatus; }
    public void setVehicleStatus(String vehicleStatus) { this.vehicleStatus = vehicleStatus; }
    
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    
    public Double getMileage() { return mileage; }
    public void setMileage(Double mileage) { this.mileage = mileage; }
    
    public Integer getSoc() { return soc; }
    public void setSoc(Integer soc) { this.soc = soc; }
    
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    
    public Integer getSignalStrength() { return signalStrength; }
    public void setSignalStrength(Integer signalStrength) { this.signalStrength = signalStrength; }
    
    public PositionInfo getPosition() { return position; }
    public void setPosition(PositionInfo position) { this.position = position; }
    
    public Map<String, Object> getExtra() { return extra; }
    public void setExtra(Map<String, Object> extra) { this.extra = extra; }
}
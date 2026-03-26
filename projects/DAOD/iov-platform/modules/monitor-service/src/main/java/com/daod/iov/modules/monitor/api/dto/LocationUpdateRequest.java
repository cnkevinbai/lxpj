package com.daod.iov.modules.monitor.api.dto;

import javax.validation.constraints.NotNull;
import java.time.Instant;

/**
 * 位置更新请求
 */
public class LocationUpdateRequest {
    
    /** 车辆 ID */
    @NotNull(message = "车辆ID不能为空")
    private String vehicleId;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 纬度 */
    @NotNull(message = "纬度不能为空")
    private Double latitude;
    
    /** 经度 */
    @NotNull(message = "经度不能为空")
    private Double longitude;
    
    /** 海拔 (米) */
    private Double altitude;
    
    /** 速度 (km/h) */
    private Double speed;
    
    /** 方向 (0-360度) */
    private Integer direction;
    
    /** 里程 (km) */
    private Double mileage;
    
    /** 定位时间 */
    private Instant locationTime;
    
    /** 定位类型 (GPS/LBS/WiFi) */
    private String locationType;
    
    /** 精度 (米) */
    private Double accuracy;
    
    /** 扩展属性 */
    private String extra;
    
    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Double getAltitude() { return altitude; }
    public void setAltitude(Double altitude) { this.altitude = altitude; }
    
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    
    public Integer getDirection() { return direction; }
    public void setDirection(Integer direction) { this.direction = direction; }
    
    public Double getMileage() { return mileage; }
    public void setMileage(Double mileage) { this.mileage = mileage; }
    
    public Instant getLocationTime() { return locationTime; }
    public void setLocationTime(Instant locationTime) { this.locationTime = locationTime; }
    
    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }
}
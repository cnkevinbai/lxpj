package com.daod.iov.modules.monitor.api.dto;

import java.time.Instant;

/**
 * 轨迹点
 */
public class TrajectoryPoint {
    
    /** 轨迹点 ID */
    private String id;
    
    /** 车辆 ID */
    private String vehicleId;
    
    /** 纬度 */
    private Double latitude;
    
    /** 经度 */
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
    
    /** 定位类型 */
    private String locationType;
    
    /** 是否停止点 */
    private Boolean isStop;
    
    /** 停止时长 (秒) */
    private Integer stopDuration;
    
    /** 地址 */
    private String address;
    
    /** 扩展属性 */
    private String extra;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
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
    
    public Boolean getIsStop() { return isStop; }
    public void setIsStop(Boolean isStop) { this.isStop = isStop; }
    
    public Integer getStopDuration() { return stopDuration; }
    public void setStopDuration(Integer stopDuration) { this.stopDuration = stopDuration; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }
}
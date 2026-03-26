package com.daod.iov.modules.monitor.api.dto;

import javax.validation.constraints.NotNull;
import java.time.Instant;

/**
 * 轨迹查询请求
 */
public class TrajectoryQueryRequest {
    
    /** 车辆 ID */
    @NotNull(message = "车辆ID不能为空")
    private String vehicleId;
    
    /** 开始时间 */
    @NotNull(message = "开始时间不能为空")
    private Instant startTime;
    
    /** 结束时间 */
    @NotNull(message = "结束时间不能为空")
    private Instant endTime;
    
    /** 采样间隔 (秒) */
    private Integer sampleInterval;
    
    /** 是否简化轨迹 */
    private Boolean simplify;
    
    /** 简化精度 (米) */
    private Double simplifyTolerance;
    
    /** 是否包含停止点 */
    private Boolean includeStops;
    
    /** 最小停止时间 (秒) */
    private Integer minStopDuration;
    
    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    
    public Integer getSampleInterval() { return sampleInterval; }
    public void setSampleInterval(Integer sampleInterval) { this.sampleInterval = sampleInterval; }
    
    public Boolean getSimplify() { return simplify; }
    public void setSimplify(Boolean simplify) { this.simplify = simplify; }
    
    public Double getSimplifyTolerance() { return simplifyTolerance; }
    public void setSimplifyTolerance(Double simplifyTolerance) { this.simplifyTolerance = simplifyTolerance; }
    
    public Boolean getIncludeStops() { return includeStops; }
    public void setIncludeStops(Boolean includeStops) { this.includeStops = includeStops; }
    
    public Integer getMinStopDuration() { return minStopDuration; }
    public void setMinStopDuration(Integer minStopDuration) { this.minStopDuration = minStopDuration; }
}
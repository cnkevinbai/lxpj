package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 车辆信息
 */
public class VehicleInfo {
    
    /** 车辆 ID */
    private String id;
    
    /** 车辆识别码 (VIN) */
    private String vin;
    
    /** 车牌号 */
    private String plateNo;
    
    /** 车辆类型 */
    private String vehicleType;
    
    /** 品牌 */
    private String brand;
    
    /** 型号 */
    private String model;
    
    /** 颜色 */
    private String color;
    
    /** 绑定设备 ID */
    private String deviceId;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 状态 */
    private VehicleStatus status;
    
    // Getters and Setters
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    
    public String getPlateNo() { return plateNo; }
    public void setPlateNo(String plateNo) { this.plateNo = plateNo; }
    
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    
    /**
     * 车辆状态枚举
     */
    public enum VehicleStatus {
        ONLINE,     // 在线
        OFFLINE,    // 离线
        FAULT,      // 故障
        SLEEP       // 休眠
    }
}
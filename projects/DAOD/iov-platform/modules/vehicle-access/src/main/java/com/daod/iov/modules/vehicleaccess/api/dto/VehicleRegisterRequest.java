package com.daod.iov.modules.vehicleaccess.api.dto;

import java.util.List;

/**
 * 车辆注册请求
 */
public class VehicleRegisterRequest {
    
    /** 车辆识别码 */
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
    
    /** 设备 ID 列表 */
    private List<String> deviceIds;
    
    /** 租户 ID */
    private String tenantId;
    
    // Getters and Setters
    
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
    
    public List<String> getDeviceIds() { return deviceIds; }
    public void setDeviceIds(List<String> deviceIds) { this.deviceIds = deviceIds; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
}
package com.daod.iov.modules.vehicleaccess.api.dto;

import javax.validation.constraints.Size;
import java.util.Map;

/**
 * 车辆信息更新请求
 * 
 * 用于更新车辆的基本信息
 */
public class VehicleInfoUpdateRequest {
    
    /** 车牌号 */
    @Size(max = 20, message = "车牌号长度不能超过20")
    private String plateNumber;
    
    /** 车辆类型 */
    @Size(max = 50, message = "车辆类型长度不能超过50")
    private String vehicleType;
    
    /** 品牌 */
    @Size(max = 50, message = "品牌长度不能超过50")
    private String brand;
    
    /** 型号 */
    @Size(max = 50, message = "型号长度不能超过50")
    private String model;
    
    /** 颜色 */
    @Size(max = 20, message = "颜色长度不能超过20")
    private String color;
    
    /** 发动机号 */
    @Size(max = 50, message = "发动机号长度不能超过50")
    private String engineNumber;
    
    /** 购买日期 */
    private String purchaseDate;
    
    /** 保险到期日 */
    private String insuranceExpiry;
    
    /** 年检到期日 */
    private String inspectionExpiry;
    
    /** 所属车队 */
    private String fleetId;
    
    /** 负责人 */
    private String manager;
    
    /** 联系电话 */
    @Size(max = 20, message = "联系电话长度不能超过20")
    private String contactPhone;
    
    /** 备注 */
    private String remark;
    
    /** 扩展属性 */
    private Map<String, Object> attributes;
    
    // Getters and Setters
    public String getPlateNumber() {
        return plateNumber;
    }
    
    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }
    
    public String getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getEngineNumber() {
        return engineNumber;
    }
    
    public void setEngineNumber(String engineNumber) {
        this.engineNumber = engineNumber;
    }
    
    public String getPurchaseDate() {
        return purchaseDate;
    }
    
    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
    
    public String getInsuranceExpiry() {
        return insuranceExpiry;
    }
    
    public void setInsuranceExpiry(String insuranceExpiry) {
        this.insuranceExpiry = insuranceExpiry;
    }
    
    public String getInspectionExpiry() {
        return inspectionExpiry;
    }
    
    public void setInspectionExpiry(String inspectionExpiry) {
        this.inspectionExpiry = inspectionExpiry;
    }
    
    public String getFleetId() {
        return fleetId;
    }
    
    public void setFleetId(String fleetId) {
        this.fleetId = fleetId;
    }
    
    public String getManager() {
        return manager;
    }
    
    public void setManager(String manager) {
        this.manager = manager;
    }
    
    public String getContactPhone() {
        return contactPhone;
    }
    
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
    
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
}
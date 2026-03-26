package com.daod.iov.modules.jtt808.dto;

/**
 * JT/T 808 终端注册数据
 * 
 * 对应消息 ID: 0x0100
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class Jtt808RegisterData {
    
    /** 省域 ID */
    private String provinceId;
    
    /** 市县域 ID */
    private String cityId;
    
    /** 制造商 ID */
    private String manufacturerId;
    
    /** 终端型号 */
    private String terminalModel;
    
    /** 终端 ID (序列号) */
    private String terminalId;
    
    /** 车牌颜色 */
    private String plateColor;
    
    /** 车辆 VIN (可选，部分终端在注册时携带) */
    private String vin;
    
    /** 手机号 (作为终端标识) */
    private String phone;
    
    // ==================== Getters and Setters ====================
    
    public String getProvinceId() {
        return provinceId;
    }
    
    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }
    
    public String getCityId() {
        return cityId;
    }
    
    public void setCityId(String cityId) {
        this.cityId = cityId;
    }
    
    public String getManufacturerId() {
        return manufacturerId;
    }
    
    public void setManufacturerId(String manufacturerId) {
        this.manufacturerId = manufacturerId;
    }
    
    public String getTerminalModel() {
        return terminalModel;
    }
    
    public void setTerminalModel(String terminalModel) {
        this.terminalModel = terminalModel;
    }
    
    public String getTerminalId() {
        return terminalId;
    }
    
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }
    
    public String getPlateColor() {
        return plateColor;
    }
    
    public void setPlateColor(String plateColor) {
        this.plateColor = plateColor;
    }
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
}
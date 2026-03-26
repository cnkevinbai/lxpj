package com.daod.iov.modules.vehicleaccess.api.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 设备绑定请求
 * 
 * 用于将终端设备与车辆进行绑定
 */
public class DeviceBindRequest {
    
    /** 终端序列号 */
    @NotBlank(message = "终端序列号不能为空")
    @Size(max = 50, message = "终端序列号长度不能超过50")
    private String terminalId;
    
    /** 车辆识别码 */
    @NotBlank(message = "车辆识别码不能为空")
    @Size(min = 17, max = 17, message = "VIN码必须为17位")
    private String vin;
    
    /** 设备类型 */
    private String deviceType;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** SIM 卡号 */
    private String simNumber;
    
    /** 安装位置 */
    private String installLocation;
    
    /** 备注信息 */
    private String remark;
    
    // 构造函数
    public DeviceBindRequest() {}
    
    public DeviceBindRequest(String terminalId, String vin) {
        this.terminalId = terminalId;
        this.vin = vin;
    }
    
    // Getters and Setters
    public String getTerminalId() {
        return terminalId;
    }
    
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public String getDeviceType() {
        return deviceType;
    }
    
    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }
    
    public String getDeviceModel() {
        return deviceModel;
    }
    
    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }
    
    public String getSimNumber() {
        return simNumber;
    }
    
    public void setSimNumber(String simNumber) {
        this.simNumber = simNumber;
    }
    
    public String getInstallLocation() {
        return installLocation;
    }
    
    public void setInstallLocation(String installLocation) {
        this.installLocation = installLocation;
    }
    
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
}
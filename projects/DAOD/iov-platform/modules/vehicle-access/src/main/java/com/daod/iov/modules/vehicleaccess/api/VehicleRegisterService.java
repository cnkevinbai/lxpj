package com.daod.iov.modules.vehicleaccess.api;

import com.daod.iov.modules.vehicleaccess.api.dto.*;

/**
 * 车辆注册服务接口
 * 
 * 提供车辆注册、设备绑定能力
 */
public interface VehicleRegisterService {
    
    /**
     * 注册车辆
     * 
     * @param request 注册请求
     * @return 车辆信息
     */
    VehicleInfo registerVehicle(VehicleRegisterRequest request);
    
    /**
     * 绑定设备
     * 
     * @param vin 车辆识别码
     * @param request 绑定请求
     * @return 车辆信息
     */
    VehicleInfo bindDevice(String vin, DeviceBindRequest request);
    
    /**
     * 解绑设备
     * 
     * @param vin 车辆识别码
     * @param deviceId 设备 ID
     */
    void unbindDevice(String vin, String deviceId);
    
    /**
     * 通过 VIN 获取车辆
     * 
     * @param vin 车辆识别码
     * @return 车辆信息
     */
    VehicleInfo getVehicleByVin(String vin);
    
    /**
     * 通过设备 ID 获取车辆
     * 
     * @param deviceId 设备 ID
     * @return 车辆信息
     */
    VehicleInfo getVehicleByDevice(String deviceId);
    
    /**
     * 更新车辆信息
     * 
     * @param vin 车辆识别码
     * @param request 更新请求
     * @return 车辆信息
     */
    VehicleInfo updateVehicleInfo(String vin, VehicleInfoUpdateRequest request);
}
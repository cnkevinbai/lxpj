package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.VehicleRegisterService;
import com.daod.iov.modules.vehicleaccess.api.dto.DeviceBindRequest;
import com.daod.iov.modules.vehicleaccess.api.dto.VehicleInfo;
import com.daod.iov.modules.vehicleaccess.api.dto.VehicleInfoUpdateRequest;
import com.daod.iov.modules.vehicleaccess.api.dto.VehicleRegisterRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 车辆注册服务实现
 */
public class VehicleRegisterServiceImpl implements VehicleRegisterService {
    
    private static final Logger log = LoggerFactory.getLogger(VehicleRegisterServiceImpl.class);
    
    /** 车辆存储 */
    private final Map<String, VehicleInfo> vehicleStore = new ConcurrentHashMap<>();
    
    /** 设备-VIN 映射 */
    private final Map<String, String> deviceVehicleMap = new ConcurrentHashMap<>();
    
    @Override
    public VehicleInfo registerVehicle(VehicleRegisterRequest request) {
        log.info("注册车辆: vin={}", request.getVin());
        
        // 检查是否已存在
        if (vehicleStore.containsKey(request.getVin())) {
            throw new RuntimeException("车辆已存在: " + request.getVin());
        }
        
        // 创建车辆信息
        VehicleInfo vehicle = new VehicleInfo();
        vehicle.setId(UUID.randomUUID().toString());
        vehicle.setVin(request.getVin());
        vehicle.setPlateNo(request.getPlateNo());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setColor(request.getColor());
        vehicle.setTenantId(request.getTenantId());
        vehicle.setStatus(VehicleInfo.VehicleStatus.OFFLINE);
        
        // 绑定设备
        if (request.getDeviceIds() != null && !request.getDeviceIds().isEmpty()) {
            vehicle.setDeviceId(request.getDeviceIds().get(0));
            for (String deviceId : request.getDeviceIds()) {
                deviceVehicleMap.put(deviceId, request.getVin());
            }
        }
        
        // 存储
        vehicleStore.put(request.getVin(), vehicle);
        
        log.info("车辆注册成功: vin={}, id={}", vehicle.getVin(), vehicle.getId());
        
        return vehicle;
    }
    
    @Override
    public VehicleInfo bindDevice(String vin, DeviceBindRequest request) {
        VehicleInfo vehicle = vehicleStore.get(vin);
        if (vehicle == null) {
            throw new RuntimeException("车辆不存在: " + vin);
        }
        
        String deviceId = request.getTerminalId();
        vehicle.setDeviceId(deviceId);
        deviceVehicleMap.put(deviceId, vin);
        
        log.info("设备绑定成功: vin={}, deviceId={}", vin, deviceId);
        
        return vehicle;
    }
    
    @Override
    public void unbindDevice(String vin, String deviceId) {
        VehicleInfo vehicle = vehicleStore.get(vin);
        if (vehicle != null && deviceId.equals(vehicle.getDeviceId())) {
            vehicle.setDeviceId(null);
        }
        deviceVehicleMap.remove(deviceId);
        
        log.info("设备解绑成功: vin={}, deviceId={}", vin, deviceId);
    }
    
    @Override
    public VehicleInfo getVehicleByVin(String vin) {
        return vehicleStore.get(vin);
    }
    
    @Override
    public VehicleInfo getVehicleByDevice(String deviceId) {
        String vin = deviceVehicleMap.get(deviceId);
        return vin != null ? vehicleStore.get(vin) : null;
    }
    
    @Override
    public VehicleInfo updateVehicleInfo(String vin, VehicleInfoUpdateRequest request) {
        VehicleInfo vehicle = vehicleStore.get(vin);
        if (vehicle == null) {
            throw new RuntimeException("车辆不存在: " + vin);
        }
        
        // 更新字段
        if (request.getPlateNumber() != null) {
            vehicle.setPlateNo(request.getPlateNumber());
        }
        if (request.getVehicleType() != null) {
            vehicle.setVehicleType(request.getVehicleType());
        }
        if (request.getBrand() != null) {
            vehicle.setBrand(request.getBrand());
        }
        if (request.getModel() != null) {
            vehicle.setModel(request.getModel());
        }
        if (request.getColor() != null) {
            vehicle.setColor(request.getColor());
        }
        
        log.info("车辆信息更新成功: vin={}", vin);
        
        return vehicle;
    }
}
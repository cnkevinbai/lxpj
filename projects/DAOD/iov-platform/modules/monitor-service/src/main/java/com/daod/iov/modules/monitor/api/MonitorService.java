package com.daod.iov.modules.monitor.api;

import com.daod.iov.modules.monitor.api.dto.*;
import java.util.List;

/**
 * 监控服务接口
 */
public interface MonitorService {
    
    /**
     * 获取实时位置
     */
    List<VehicleLocation> getRealTimeLocations(String tenantId);
    
    /**
     * 获取车辆位置
     */
    VehicleLocation getVehicleLocation(String vehicleId);
    
    /**
     * 更新车辆位置
     */
    void updateLocation(LocationUpdateRequest request);
    
    /**
     * 获取轨迹数据
     */
    List<TrajectoryPoint> getTrajectory(TrajectoryQueryRequest request);
    
    /**
     * 获取在线车辆数
     */
    int getOnlineCount(String tenantId);
}
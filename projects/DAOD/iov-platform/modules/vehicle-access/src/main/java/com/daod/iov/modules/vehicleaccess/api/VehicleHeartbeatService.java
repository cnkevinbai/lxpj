package com.daod.iov.modules.vehicleaccess.api;

import com.daod.iov.modules.vehicleaccess.api.dto.*;

/**
 * 心跳管理服务接口
 * 
 * 提供心跳接收、超时检测能力
 */
public interface VehicleHeartbeatService {
    
    /**
     * 接收心跳
     * 
     * @param vin 车辆识别码
     * @param data 心跳数据
     * @return 心跳结果
     */
    HeartbeatResult receiveHeartbeat(String vin, HeartbeatData data);
    
    /**
     * 获取最后心跳时间
     * 
     * @param vin 车辆识别码
     * @return 时间戳
     */
    long getLastHeartbeatTime(String vin);
    
    /**
     * 检查心跳超时
     * 
     * @return 超时车辆列表
     */
    java.util.List<String> checkTimeout();
    
    /**
     * 获取在线状态
     * 
     * @param vin 车辆识别码
     * @return 在线状态
     */
    OnlineStatus getOnlineStatus(String vin);
}
package com.daod.iov.modules.clickhouse.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * ClickHouse 数据同步服务接口
 * 
 * 提供业务数据同步到 ClickHouse 的能力
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public interface ClickHouseSyncService {
    
    // ==================== 车辆统计数据同步 ====================
    
    /**
     * 同步车辆日统计数据
     * 
     * @param date 统计日期
     */
    void syncVehicleDailyStats(LocalDateTime date);
    
    /**
     * 同步车辆运行数据
     * 
     * @param vin 车辆VIN
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    void syncVehicleRuntimeData(String vin, LocalDateTime startTime, LocalDateTime endTime);
    
    // ==================== 告警统计数据同步 ====================
    
    /**
     * 同步告警统计数据
     * 
     * @param tenantId 租户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    void syncAlarmStats(String tenantId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 同步告警聚合数据
     * 
     * @param date 统计日期
     */
    void syncAlarmAggregation(LocalDateTime date);
    
    // ==================== 运营数据同步 ====================
    
    /**
     * 同步运营统计数据
     * 
     * @param tenantId 租户ID
     * @param date 统计日期
     */
    void syncOperationStats(String tenantId, LocalDateTime date);
    
    /**
     * 同步车队统计数据
     * 
     * @param fleetId 车队ID
     * @param date 统计日期
     */
    void syncFleetStats(String fleetId, LocalDateTime date);
    
    // ==================== 轨迹数据同步 ====================
    
    /**
     * 批量同步轨迹数据
     * 
     * @param records 轨迹记录列表
     */
    void syncTrajectoryBatch(List<Map<String, Object>> records);
    
    /**
     * 同步轨迹聚合数据 (按小时)
     * 
     * @param vin 车辆VIN
     * @param hour 小时 (格式: yyyy-MM-dd HH:00:00)
     */
    void syncTrajectoryHourly(String vin, LocalDateTime hour);
    
    // ==================== 实时数据写入 ====================
    
    /**
     * 写入车辆位置数据
     * 
     * @param positionData 位置数据
     */
    void writeVehiclePosition(Map<String, Object> positionData);
    
    /**
     * 批量写入车辆位置数据
     * 
     * @param positionList 位置数据列表
     */
    void writeVehiclePositionBatch(List<Map<String, Object>> positionList);
    
    /**
     * 写入遥测数据
     * 
     * @param telemetryData 遥测数据
     */
    void writeTelemetry(Map<String, Object> telemetryData);
    
    /**
     * 批量写入遥测数据
     * 
     * @param telemetryList 遥测数据列表
     */
    void writeTelemetryBatch(List<Map<String, Object>> telemetryList);
    
    // ==================== 数据清理 ====================
    
    /**
     * 清理过期数据
     * 
     * @param tableName 表名
     * @param retentionDays 保留天数
     */
    void cleanExpiredData(String tableName, int retentionDays);
    
    /**
     * 清理轨迹明细数据 (保留聚合数据)
     * 
     * @param before 清理此时间之前的数据
     */
    void cleanTrajectoryDetails(LocalDateTime before);
}
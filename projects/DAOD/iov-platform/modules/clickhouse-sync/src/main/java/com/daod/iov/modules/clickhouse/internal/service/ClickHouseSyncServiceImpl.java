package com.daod.iov.modules.clickhouse.internal.service;

import com.daod.iov.modules.clickhouse.api.ClickHouseSyncService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

/**
 * ClickHouse 数据同步服务实现
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
@Service
public class ClickHouseSyncServiceImpl implements ClickHouseSyncService {
    
    @Autowired
    private DataSource clickHouseDataSource;
    
    @Autowired
    private JdbcTemplate clickHouseJdbcTemplate;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    // ==================== 车辆统计数据同步 ====================
    
    @Override
    public void syncVehicleDailyStats(LocalDateTime date) {
        log.info("开始同步车辆日统计数据: date={}", date.format(formatter));
        
        String sql = """
            INSERT INTO vehicle_stats_daily (date, vin, organization_id, 
                total_distance, total_duration, max_speed, avg_speed,
                total_energy_consumption, charging_count, charging_duration)
            SELECT 
                toDate(?) as date,
                vin,
                organization_id,
                sum(distance) as total_distance,
                sum(duration) as total_duration,
                max(speed) as max_speed,
                avg(speed) as avg_speed,
                sum(energy_consumption) as total_energy_consumption,
                countIf(is_charging = 1) as charging_count,
                sum(charging_duration) as charging_duration
            FROM vehicle_runtime_source
            WHERE date = toDate(?)
            GROUP BY vin, organization_id
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, date, date);
            log.info("车辆日统计数据同步完成: date={}", date.format(formatter));
        } catch (Exception e) {
            log.error("车辆日统计数据同步失败: {}", e.getMessage());
            throw new RuntimeException("车辆日统计数据同步失败", e);
        }
    }
    
    @Override
    public void syncVehicleRuntimeData(String vin, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("开始同步车辆运行数据: vin={}, startTime={}, endTime={}", vin, startTime, endTime);
        
        String sql = """
            INSERT INTO vehicle_runtime_stats
            SELECT * FROM vehicle_runtime_source
            WHERE vin = ? AND timestamp BETWEEN ? AND ?
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, vin, startTime, endTime);
            log.info("车辆运行数据同步完成: vin={}", vin);
        } catch (Exception e) {
            log.error("车辆运行数据同步失败: {}", e.getMessage());
            throw new RuntimeException("车辆运行数据同步失败", e);
        }
    }
    
    // ==================== 告警统计数据同步 ====================
    
    @Override
    public void syncAlarmStats(String tenantId, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("开始同步告警统计数据: tenantId={}, startTime={}, endTime={}", tenantId, startTime, endTime);
        
        String sql = """
            INSERT INTO alarm_stats_hourly (hour, tenant_id, alarm_type, alarm_level, count)
            SELECT 
                toStartOfHour(occur_time) as hour,
                tenant_id,
                alarm_type,
                alarm_level,
                count() as count
            FROM alarm_source
            WHERE tenant_id = ? AND occur_time BETWEEN ? AND ?
            GROUP BY hour, tenant_id, alarm_type, alarm_level
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, tenantId, startTime, endTime);
            log.info("告警统计数据同步完成: tenantId={}", tenantId);
        } catch (Exception e) {
            log.error("告警统计数据同步失败: {}", e.getMessage());
            throw new RuntimeException("告警统计数据同步失败", e);
        }
    }
    
    @Override
    public void syncAlarmAggregation(LocalDateTime date) {
        log.info("开始同步告警聚合数据: date={}", date.format(formatter));
        
        String sql = """
            INSERT INTO alarm_aggregation_daily (date, tenant_id, total_alarms, 
                level_1_count, level_2_count, level_3_count, handled_count, unhandled_count)
            SELECT 
                toDate(?) as date,
                tenant_id,
                count() as total_alarms,
                countIf(alarm_level = 1) as level_1_count,
                countIf(alarm_level = 2) as level_2_count,
                countIf(alarm_level = 3) as level_3_count,
                countIf(status = 'handled') as handled_count,
                countIf(status = 'unhandled') as unhandled_count
            FROM alarm_source
            WHERE toDate(occur_time) = toDate(?)
            GROUP BY tenant_id
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, date, date);
            log.info("告警聚合数据同步完成: date={}", date.format(formatter));
        } catch (Exception e) {
            log.error("告警聚合数据同步失败: {}", e.getMessage());
            throw new RuntimeException("告警聚合数据同步失败", e);
        }
    }
    
    // ==================== 运营数据同步 ====================
    
    @Override
    public void syncOperationStats(String tenantId, LocalDateTime date) {
        log.info("开始同步运营统计数据: tenantId={}, date={}", tenantId, date);
        
        String sql = """
            INSERT INTO operation_stats_daily (date, tenant_id, 
                active_vehicles, total_trips, total_distance, total_duration, avg_utilization)
            SELECT 
                toDate(?) as date,
                ? as tenant_id,
                count(DISTINCT vin) as active_vehicles,
                count() as total_trips,
                sum(distance) as total_distance,
                sum(duration) as total_duration,
                avg(utilization) as avg_utilization
            FROM operation_source
            WHERE tenant_id = ? AND toDate(start_time) = toDate(?)
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, date, tenantId, tenantId, date);
            log.info("运营统计数据同步完成: tenantId={}", tenantId);
        } catch (Exception e) {
            log.error("运营统计数据同步失败: {}", e.getMessage());
            throw new RuntimeException("运营统计数据同步失败", e);
        }
    }
    
    @Override
    public void syncFleetStats(String fleetId, LocalDateTime date) {
        log.info("开始同步车队统计数据: fleetId={}, date={}", fleetId, date);
        
        String sql = """
            INSERT INTO fleet_stats_daily (date, fleet_id, 
                vehicle_count, active_count, total_distance, total_trips, efficiency)
            SELECT 
                toDate(?) as date,
                ? as fleet_id,
                count(DISTINCT vin) as vehicle_count,
                countIf(status = 'active') as active_count,
                sum(distance) as total_distance,
                count() as total_trips,
                avg(efficiency) as efficiency
            FROM fleet_operation_source
            WHERE fleet_id = ? AND toDate(timestamp) = toDate(?)
            GROUP BY fleet_id
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, date, fleetId, fleetId, date);
            log.info("车队统计数据同步完成: fleetId={}", fleetId);
        } catch (Exception e) {
            log.error("车队统计数据同步失败: {}", e.getMessage());
            throw new RuntimeException("车队统计数据同步失败", e);
        }
    }
    
    // ==================== 轨迹数据同步 ====================
    
    @Override
    public void syncTrajectoryBatch(List<Map<String, Object>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        
        log.info("开始批量同步轨迹数据: count={}", records.size());
        
        String sql = """
            INSERT INTO trajectory_detail (vin, timestamp, latitude, longitude, 
                speed, direction, mileage, location_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        try (Connection conn = clickHouseDataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            for (Map<String, Object> record : records) {
                ps.setString(1, (String) record.get("vin"));
                ps.setString(2, record.get("timestamp").toString());
                ps.setDouble(3, (Double) record.get("latitude"));
                ps.setDouble(4, (Double) record.get("longitude"));
                ps.setDouble(5, (Double) record.get("speed"));
                ps.setDouble(6, (Double) record.get("direction"));
                ps.setDouble(7, (Double) record.get("mileage"));
                ps.setString(8, (String) record.get("locationType"));
                ps.addBatch();
            }
            
            ps.executeBatch();
            log.info("轨迹数据批量同步完成: count={}", records.size());
            
        } catch (Exception e) {
            log.error("轨迹数据批量同步失败: {}", e.getMessage());
            throw new RuntimeException("轨迹数据批量同步失败", e);
        }
    }
    
    @Override
    public void syncTrajectoryHourly(String vin, LocalDateTime hour) {
        log.info("开始同步轨迹小时聚合: vin={}, hour={}", vin, hour);
        
        String sql = """
            INSERT INTO trajectory_hourly (vin, hour, 
                start_lat, start_lng, end_lat, end_lng,
                avg_speed, max_speed, total_distance, point_count)
            SELECT 
                vin,
                toStartOfHour(?) as hour,
                first_value(latitude) as start_lat,
                first_value(longitude) as start_lng,
                last_value(latitude) as end_lat,
                last_value(longitude) as end_lng,
                avg(speed) as avg_speed,
                max(speed) as max_speed,
                sum(distance) as total_distance,
                count() as point_count
            FROM trajectory_detail
            WHERE vin = ? AND toStartOfHour(timestamp) = toStartOfHour(?)
            GROUP BY vin
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql, hour, vin, hour);
            log.info("轨迹小时聚合同步完成: vin={}", vin);
        } catch (Exception e) {
            log.error("轨迹小时聚合同步失败: {}", e.getMessage());
            throw new RuntimeException("轨迹小时聚合同步失败", e);
        }
    }
    
    // ==================== 实时数据写入 ====================
    
    @Override
    public void writeVehiclePosition(Map<String, Object> positionData) {
        String sql = """
            INSERT INTO vehicle_position_realtime (vin, timestamp, latitude, longitude, 
                speed, direction, mileage, altitude, accuracy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql,
                positionData.get("vin"),
                positionData.get("timestamp"),
                positionData.get("latitude"),
                positionData.get("longitude"),
                positionData.get("speed"),
                positionData.get("direction"),
                positionData.get("mileage"),
                positionData.get("altitude"),
                positionData.get("accuracy")
            );
        } catch (Exception e) {
            log.error("写入车辆位置数据失败: {}", e.getMessage());
        }
    }
    
    @Override
    public void writeVehiclePositionBatch(List<Map<String, Object>> positionList) {
        if (positionList == null || positionList.isEmpty()) {
            return;
        }
        
        String sql = """
            INSERT INTO vehicle_position_realtime (vin, timestamp, latitude, longitude, 
                speed, direction, mileage, altitude, accuracy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        try (Connection conn = clickHouseDataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            for (Map<String, Object> data : positionList) {
                ps.setString(1, (String) data.get("vin"));
                ps.setString(2, data.get("timestamp").toString());
                ps.setDouble(3, (Double) data.get("latitude"));
                ps.setDouble(4, (Double) data.get("longitude"));
                ps.setDouble(5, (Double) data.get("speed"));
                ps.setDouble(6, (Double) data.get("direction"));
                ps.setDouble(7, (Double) data.get("mileage"));
                ps.setDouble(8, (Double) data.get("altitude"));
                ps.setDouble(9, (Double) data.get("accuracy"));
                ps.addBatch();
            }
            
            ps.executeBatch();
            log.debug("批量写入车辆位置数据: count={}", positionList.size());
            
        } catch (Exception e) {
            log.error("批量写入车辆位置数据失败: {}", e.getMessage());
        }
    }
    
    @Override
    public void writeTelemetry(Map<String, Object> telemetryData) {
        String sql = """
            INSERT INTO vehicle_telemetry_realtime (vin, timestamp, data_type, data_value)
            VALUES (?, ?, ?, ?)
            """;
        
        try {
            clickHouseJdbcTemplate.update(sql,
                telemetryData.get("vin"),
                telemetryData.get("timestamp"),
                telemetryData.get("dataType"),
                telemetryData.get("dataValue")
            );
        } catch (Exception e) {
            log.error("写入遥测数据失败: {}", e.getMessage());
        }
    }
    
    @Override
    public void writeTelemetryBatch(List<Map<String, Object>> telemetryList) {
        if (telemetryList == null || telemetryList.isEmpty()) {
            return;
        }
        
        String sql = "INSERT INTO vehicle_telemetry_realtime (vin, timestamp, data_type, data_value) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = clickHouseDataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            for (Map<String, Object> data : telemetryList) {
                ps.setString(1, (String) data.get("vin"));
                ps.setString(2, data.get("timestamp").toString());
                ps.setString(3, (String) data.get("dataType"));
                ps.setString(4, String.valueOf(data.get("dataValue")));
                ps.addBatch();
            }
            
            ps.executeBatch();
            log.debug("批量写入遥测数据: count={}", telemetryList.size());
            
        } catch (Exception e) {
            log.error("批量写入遥测数据失败: {}", e.getMessage());
        }
    }
    
    // ==================== 数据清理 ====================
    
    @Override
    public void cleanExpiredData(String tableName, int retentionDays) {
        log.info("开始清理过期数据: table={}, retentionDays={}", tableName, retentionDays);
        
        String sql = String.format("ALTER TABLE %s DELETE WHERE timestamp < now() - INTERVAL %d DAY", 
            tableName, retentionDays);
        
        try {
            clickHouseJdbcTemplate.execute(sql);
            log.info("过期数据清理完成: table={}", tableName);
        } catch (Exception e) {
            log.error("过期数据清理失败: {}", e.getMessage());
        }
    }
    
    @Override
    public void cleanTrajectoryDetails(LocalDateTime before) {
        log.info("开始清理轨迹明细数据: before={}", before.format(formatter));
        
        String sql = "ALTER TABLE trajectory_detail DELETE WHERE timestamp < ?";
        
        try {
            clickHouseJdbcTemplate.update(sql, before);
            log.info("轨迹明细数据清理完成");
        } catch (Exception e) {
            log.error("轨迹明细数据清理失败: {}", e.getMessage());
        }
    }
    
    // ==================== 定时任务 ====================
    
    /**
     * 每日凌晨 1 点同步前一天的统计数据
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void scheduledDailySync() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        log.info("开始执行每日统计同步任务: date={}", yesterday.format(formatter));
        
        try {
            syncVehicleDailyStats(yesterday);
            syncAlarmAggregation(yesterday);
        } catch (Exception e) {
            log.error("每日统计同步任务失败: {}", e.getMessage());
        }
    }
    
    /**
     * 每小时清理过期数据
     */
    @Scheduled(cron = "0 30 * * * ?")
    public void scheduledDataCleanup() {
        log.info("开始执行数据清理任务");
        
        try {
            // 清理 90 天前的轨迹明细
            cleanTrajectoryDetails(LocalDateTime.now().minusDays(90));
            
            // 清理其他过期数据
            cleanExpiredData("vehicle_position_realtime", 30);
            cleanExpiredData("vehicle_telemetry_realtime", 30);
        } catch (Exception e) {
            log.error("数据清理任务失败: {}", e.getMessage());
        }
    }
}
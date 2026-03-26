package com.daod.iov.modules.monitor;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 监控服务模块
 * 
 * 功能：
 * - 实时监控
 * - 数据采集
 * - 指标统计
 * - 告警触发
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class MonitorServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(MonitorServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final Map<String, VehicleMonitor> vehicleMonitors = new ConcurrentHashMap<>();
    private final AtomicInteger totalMessages = new AtomicInteger(0);
    private final AtomicInteger totalAlerts = new AtomicInteger(0);
    
    public MonitorServiceModule() {
        this.metadata = new ModuleMetadata("monitor-service", "1.0.0", "监控服务");
        this.metadata.setType("business");
        this.metadata.setPriority(45);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("监控服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void start() {
        logger.info("监控服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        logger.info("监控服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        vehicleMonitors.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 监控功能 ====================
    
    public void updateVehicleLocation(String vehicleId, double lat, double lng, double speed) {
        VehicleMonitor monitor = vehicleMonitors.computeIfAbsent(vehicleId, 
            k -> new VehicleMonitor(vehicleId));
        monitor.updateLocation(lat, lng, speed);
        totalMessages.incrementAndGet();
        
        // 检查超速告警
        if (speed > 60) {
            logger.warn("超速告警: {} 速度 {} km/h", vehicleId, speed);
            totalAlerts.incrementAndGet();
        }
    }
    
    public VehicleMonitor getVehicleMonitor(String vehicleId) {
        return vehicleMonitors.get(vehicleId);
    }
    
    public List<VehicleMonitor> listVehicleMonitors() {
        return new ArrayList<>(vehicleMonitors.values());
    }
    
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVehicles", vehicleMonitors.size());
        stats.put("totalMessages", totalMessages.get());
        stats.put("totalAlerts", totalAlerts.get());
        return stats;
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(
            new Metric("monitor_vehicles", Metric.MetricType.GAUGE, vehicleMonitors.size()),
            new Metric("monitor_messages", Metric.MetricType.COUNTER, totalMessages.get()),
            new Metric("monitor_alerts", Metric.MetricType.COUNTER, totalAlerts.get())
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("监控服务运行正常")
            .withDetail("vehicles", vehicleMonitors.size());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return List.of(); }
    @Override public List<Permission> getRequiredPermissions() { return List.of(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class VehicleMonitor {
        private final String vehicleId;
        private double latitude;
        private double longitude;
        private double speed;
        private long lastUpdate;
        
        public VehicleMonitor(String vehicleId) {
            this.vehicleId = vehicleId;
            this.lastUpdate = System.currentTimeMillis();
        }
        
        public void updateLocation(double lat, double lng, double speed) {
            this.latitude = lat;
            this.longitude = lng;
            this.speed = speed;
            this.lastUpdate = System.currentTimeMillis();
        }
        
        public String getVehicleId() { return vehicleId; }
        public double getLatitude() { return latitude; }
        public double getLongitude() { return longitude; }
        public double getSpeed() { return speed; }
        public long getLastUpdate() { return lastUpdate; }
    }
}
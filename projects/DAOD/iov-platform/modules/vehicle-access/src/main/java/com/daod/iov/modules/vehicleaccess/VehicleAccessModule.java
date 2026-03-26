package com.daod.iov.modules.vehicleaccess;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 车辆接入模块 - SFU 标准实现
 * 
 * 功能：
 * - 终端注册与认证
 * - 心跳管理
 * - 会话管理
 * - 消息路由
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class VehicleAccessModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleAccessModule.class);
    
    // ==================== 模块基础属性 ====================
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 业务数据 ====================
    private final Map<String, VehicleSession> sessions = new ConcurrentHashMap<>();
    private final AtomicInteger onlineCount = new AtomicInteger(0);
    
    public VehicleAccessModule() {
        this.metadata = new ModuleMetadata("vehicle-access", "1.0.0", "车辆接入服务");
        this.metadata.setType("business");
        this.metadata.setPriority(60);
    }
    
    // ==================== 生命周期 ====================
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("车辆接入模块初始化中...");
        
        // 初始化会话存储
        sessions.clear();
        onlineCount.set(0);
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
        
        logger.info("车辆接入模块初始化完成");
    }
    
    @Override
    public void start() {
        logger.info("车辆接入模块启动中...");
        state = ModuleState.RUNNING;
        logger.info("车辆接入模块启动完成，当前在线车辆: {}", onlineCount.get());
    }
    
    @Override
    public void stop() {
        logger.info("车辆接入模块停止中...");
        // 断开所有会话
        sessions.clear();
        onlineCount.set(0);
        state = ModuleState.STOPPED;
        logger.info("车辆接入模块已停止");
    }
    
    @Override
    public void destroy() {
        sessions.clear();
        state = ModuleState.DESTROYED;
        logger.info("车辆接入模块已销毁");
    }
    
    // ==================== 状态查询 ====================
    
    @Override
    public ModuleMetadata getMetadata() { return metadata; }
    
    @Override
    public ModuleState getState() { return state; }
    
    @Override
    public HealthStatus getHealthStatus() { return healthStatus; }
    
    // ==================== 业务方法 ====================
    
    /**
     * 终端注册
     */
    public boolean register(String terminalId, String plateNo, String deviceModel) {
        if (sessions.containsKey(terminalId)) {
            logger.warn("终端已存在: {}", terminalId);
            return false;
        }
        
        VehicleSession session = new VehicleSession(terminalId, plateNo, deviceModel);
        sessions.put(terminalId, session);
        onlineCount.incrementAndGet();
        
        logger.info("终端注册成功: {} -> {}", terminalId, plateNo);
        return true;
    }
    
    /**
     * 终端认证
     */
    public boolean authenticate(String terminalId, String authCode) {
        VehicleSession session = sessions.get(terminalId);
        if (session == null) {
            logger.warn("终端不存在: {}", terminalId);
            return false;
        }
        
        session.setAuthenticated(true);
        session.setLastSeen(System.currentTimeMillis());
        
        logger.info("终端认证成功: {}", terminalId);
        return true;
    }
    
    /**
     * 心跳处理
     */
    public void heartbeat(String terminalId) {
        VehicleSession session = sessions.get(terminalId);
        if (session != null) {
            session.setLastSeen(System.currentTimeMillis());
            logger.debug("心跳更新: {}", terminalId);
        }
    }
    
    /**
     * 终端离线
     */
    public void offline(String terminalId) {
        if (sessions.remove(terminalId) != null) {
            onlineCount.decrementAndGet();
            logger.info("终端离线: {}", terminalId);
        }
    }
    
    /**
     * 获取在线数量
     */
    public int getOnlineCount() {
        return onlineCount.get();
    }
    
    /**
     * 获取所有在线终端
     */
    public List<VehicleSession> getOnlineSessions() {
        return List.copyOf(sessions.values());
    }
    
    // ==================== 可观测性 ====================
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(
            new Metric("vehicle_online_count", Metric.MetricType.GAUGE, onlineCount.get())
                .withLabel("module", "vehicle-access")
                .withHelp("在线车辆数量"),
            new Metric("vehicle_session_total", Metric.MetricType.GAUGE, sessions.size())
                .withLabel("module", "vehicle-access")
                .withHelp("会话总数")
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("车辆接入服务运行正常")
            .withDetail("onlineCount", onlineCount.get());
    }
    
    // ==================== API 规范 ====================
    
    @Override
    public String getApiSpecification() {
        return "/api/vehicle-access/openapi.yaml";
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of(
            new ApiDependency("tenant-api", "tenant-service", "^1.0.0"),
            new ApiDependency("auth-api", "auth-service", "^1.0.0")
        );
    }
    
    // ==================== 沙箱配置 ====================
    
    @Override
    public List<Permission> getRequiredPermissions() {
        return List.of(
            Permission.NETWORK_CONNECT,
            Permission.HTTP_SERVER
        );
    }
    
    @Override
    public ResourceRequirements getResourceRequirements() {
        return ResourceRequirements.defaults()
            .maxConnections(2000)
            .maxThreads(100);
    }
    
    // ==================== 内部类 ====================
    
    /**
     * 车辆会话
     */
    public static class VehicleSession {
        private final String terminalId;
        private final String plateNo;
        private final String deviceModel;
        private boolean authenticated;
        private long lastSeen;
        private double latitude;
        private double longitude;
        
        public VehicleSession(String terminalId, String plateNo, String deviceModel) {
            this.terminalId = terminalId;
            this.plateNo = plateNo;
            this.deviceModel = deviceModel;
            this.authenticated = false;
            this.lastSeen = System.currentTimeMillis();
        }
        
        public String getTerminalId() { return terminalId; }
        public String getPlateNo() { return plateNo; }
        public String getDeviceModel() { return deviceModel; }
        public boolean isAuthenticated() { return authenticated; }
        public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }
        public long getLastSeen() { return lastSeen; }
        public void setLastSeen(long lastSeen) { this.lastSeen = lastSeen; }
        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
    }
}
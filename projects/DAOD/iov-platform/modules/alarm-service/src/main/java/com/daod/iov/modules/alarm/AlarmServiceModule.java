package com.daod.iov.modules.alarm;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * 告警服务模块
 * 
 * 功能：
 * - 告警规则管理
 * - 告警生成
 * - 告警通知
 * - 告警处理
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class AlarmServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(AlarmServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final List<Alarm> alarms = new ArrayList<>();
    private final AtomicInteger pendingCount = new AtomicInteger(0);
    
    public AlarmServiceModule() {
        this.metadata = new ModuleMetadata("alarm-service", "1.0.0", "告警服务");
        this.metadata.setType("business");
        this.metadata.setPriority(40);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("告警服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void start() {
        logger.info("告警服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        logger.info("告警服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        alarms.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 告警管理 ====================
    
    public String createAlarm(String terminalId, String type, String level, String message) {
        String alarmId = UUID.randomUUID().toString();
        Alarm alarm = new Alarm(alarmId, terminalId, type, level, message);
        alarms.add(alarm);
        pendingCount.incrementAndGet();
        logger.warn("告警: [{}] {} - {}", level, type, message);
        return alarmId;
    }
    
    public List<Alarm> listAlarms(String status, int page, int pageSize) {
        List<Alarm> filtered = status == null ? alarms : 
            alarms.stream().filter(a -> a.getStatus().equals(status)).collect(Collectors.toList());
        
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, filtered.size());
        
        return filtered.subList(start, end);
    }
    
    public void processAlarm(String alarmId, String action) {
        alarms.stream()
            .filter(a -> a.getId().equals(alarmId))
            .findFirst()
            .ifPresent(alarm -> {
                alarm.setStatus("PROCESSED");
                alarm.setAction(action);
                pendingCount.decrementAndGet();
                logger.info("处理告警: {} -> {}", alarmId, action);
            });
    }
    
    public int getPendingCount() {
        return pendingCount.get();
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return Arrays.asList(
            new Metric("alarms_total", Metric.MetricType.GAUGE, alarms.size()),
            new Metric("alarms_pending", Metric.MetricType.GAUGE, pendingCount.get())
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("告警服务运行正常")
            .withDetail("pending", pendingCount.get());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return Collections.emptyList(); }
    @Override public List<Permission> getRequiredPermissions() { return Collections.emptyList(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class Alarm {
        private final String id;
        private final String terminalId;
        private final String type;
        private final String level;
        private final String message;
        private String status;
        private String action;
        private final long createdAt;
        
        public Alarm(String id, String terminalId, String type, String level, String message) {
            this.id = id;
            this.terminalId = terminalId;
            this.type = type;
            this.level = level;
            this.message = message;
            this.status = "PENDING";
            this.createdAt = System.currentTimeMillis();
        }
        
        public String getId() { return id; }
        public String getTerminalId() { return terminalId; }
        public String getType() { return type; }
        public String getLevel() { return level; }
        public String getMessage() { return message; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public long getCreatedAt() { return createdAt; }
    }
}
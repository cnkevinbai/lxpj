package com.daod.iov.modules.edgeproxy;

import com.daod.iov.plugin.*;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 边缘代理模块主服务类
 * 实现云边通信代理、边缘节点管理、数据同步等功能
 */
public class EdgeProxyService implements IModule {
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;
    private ModuleContext context;
    
    // 边缘节点配置
    private String edgeNodeId;
    private String mqttBroker;
    private String cloudEndpoint;
    private int syncInterval;
    private int offlineCacheSize;
    private boolean enableCompression;
    
    // 运行时组件
    private EdgeClient edgeClient;
    private HeartbeatManager heartbeatManager;
    private DataSyncManager dataSyncManager;
    private CommandDispatcher commandDispatcher;
    private NodeHealthMonitor healthMonitor;
    
    // 线程池
    private ScheduledExecutorService scheduler;
    
    // 状态标志
    private AtomicBoolean initialized = new AtomicBoolean(false);
    private AtomicBoolean connected = new AtomicBoolean(false);

    public EdgeProxyService() {
        // 初始化模块元数据
        this.metadata = new ModuleMetadata(
            "edge-proxy",               // 模块名称
            "1.0.0",                    // 模块版本
            "边缘代理服务模块 - 云边协同通信"  // 模块描述
        );
        
        // 设置模块类型和优先级
        this.metadata.setType("extension");
        this.metadata.setPriority(60);
        
        // 设置初始状态
        this.state = ModuleState.UNINITIALIZED;
        this.healthStatus = HealthStatus.UNKNOWN;
    }

    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }

    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        System.out.println("边缘代理模块初始化: " + metadata.getName());
        
        try {
            // 1. 加载配置
            loadConfig();
            
            // 2. 初始化组件
            initializeComponents();
            
            // 3. 初始化线程池
            scheduler = Executors.newScheduledThreadPool(4, r -> {
                Thread t = new Thread(r, "edge-proxy-" + System.nanoTime());
                t.setDaemon(true);
                return t;
            });
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            initialized.set(true);
            
            System.out.println("边缘代理模块初始化完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("INITIALIZATION_FAILED", "edge-proxy",
                "边缘代理模块初始化失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void start() throws ModuleException {
        System.out.println("边缘代理模块启动: " + metadata.getName());
        
        if (!initialized.get()) {
            throw new ModuleException("NOT_INITIALIZED", "edge-proxy",
                "模块未初始化，请先调用initialize()");
        }
        
        try {
            // 1. 启动边缘客户端
            edgeClient.start();
            connected.set(true);
            
            // 2. 启动心跳管理
            heartbeatManager.start(edgeNodeId);
            
            // 3. 启动数据同步
            dataSyncManager.start();
            
            // 4. 启动指令分发
            commandDispatcher.start();
            
            // 5. 启动健康监控
            healthMonitor.start();
            
            // 6. 注册离线缓存清理任务
            scheduler.scheduleWithFixedDelay(
                this::cleanupOfflineCache,
                60, 60, TimeUnit.MINUTES
            );
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            System.out.println("边缘代理模块启动完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("START_FAILED", "edge-proxy",
                "边缘代理模块启动失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void stop() throws ModuleException {
        System.out.println("边缘代理模块停止: " + metadata.getName());
        
        try {
            // 1. 停止健康监控
            healthMonitor.stop();
            
            // 2. 停止指令分发
            commandDispatcher.stop();
            
            // 3. 停止数据同步
            dataSyncManager.stop();
            
            // 4. 停止心跳管理
            heartbeatManager.stop();
            
            // 5. 停止边缘客户端
            edgeClient.stop();
            connected.set(false);
            
            // 6. 关闭线程池
            if (scheduler != null) {
                scheduler.shutdown();
                try {
                    if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                        scheduler.shutdownNow();
                    }
                } catch (InterruptedException e) {
                    scheduler.shutdownNow();
                    Thread.currentThread().interrupt();
                }
            }
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            System.out.println("边缘代理模块停止完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("STOP_FAILED", "edge-proxy",
                "边缘代理模块停止失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void destroy() throws ModuleException {
        System.out.println("边缘代理模块销毁: " + metadata.getName());
        
        try {
            // 释放所有资源
            if (edgeClient != null) {
                edgeClient.destroy();
            }
            if (heartbeatManager != null) {
                heartbeatManager.destroy();
            }
            if (dataSyncManager != null) {
                dataSyncManager.destroy();
            }
            if (commandDispatcher != null) {
                commandDispatcher.destroy();
            }
            if (healthMonitor != null) {
                healthMonitor.destroy();
            }
            
            // 清理
            edgeNodeId = null;
            mqttBroker = null;
            cloudEndpoint = null;
            
            state = ModuleState.DESTROYED;
            initialized.set(false);
            
            System.out.println("边缘代理模块销毁完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("DESTROY_FAILED", "edge-proxy",
                "边缘代理模块销毁失败: " + e.getMessage(), e);
        }
    }

    @Override
    public ModuleState getState() {
        return state;
    }

    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }

    /**
     * 加载配置
     */
    private void loadConfig() {
        Object val;
        
        val = context.getConfig().get("edgeNodeId");
        edgeNodeId = val != null ? val.toString() : "edge-node-default";
        
        val = context.getConfig().get("mqttBroker");
        mqttBroker = val != null ? val.toString() : "tcp://localhost:1883";
        
        val = context.getConfig().get("cloudEndpoint");
        cloudEndpoint = val != null ? val.toString() : "wss://api.daod.io/edge";
        
        val = context.getConfig().get("syncInterval");
        syncInterval = val instanceof Number ? ((Number) val).intValue() : 60000;
        
        val = context.getConfig().get("offlineCacheSize");
        offlineCacheSize = val instanceof Number ? ((Number) val).intValue() : 10000;
        
        val = context.getConfig().get("enableCompression");
        enableCompression = val instanceof Boolean ? (Boolean) val : true;
        
        System.out.println("配置加载完成: edgeNodeId=" + edgeNodeId);
    }

    /**
     * 初始化组件
     */
    private void initializeComponents() {
        // 初始化边缘客户端
        edgeClient = new EdgeClient(
            mqttBroker, cloudEndpoint, this::onConnect, this::onDisconnect, this::onMessage
        );
        
        // 初始化心跳管理器
        heartbeatManager = new HeartbeatManager();
        
        // 初始化数据同步管理器
        dataSyncManager = new DataSyncManager(
            syncInterval, offlineCacheSize, enableCompression
        );
        
        // 初始化指令分发器
        commandDispatcher = new CommandDispatcher();
        
        // 初始化健康监控器
        healthMonitor = new NodeHealthMonitor(this);
    }

    /**
     * 连接建立回调
     */
    private void onConnect() {
        System.out.println("边缘节点连接建立: " + edgeNodeId);
        
        // 发送注册消息
        edgeClient.publish(
            "edge/" + edgeNodeId + "/register", 
            buildRegisterMessage(),
            1
        );
    }

    /**
     * 连接断开回调
     */
    private void onDisconnect() {
        System.out.println("边缘节点连接断开: " + edgeNodeId);
        connected.set(false);
    }

    /**
     * 消息接收回调
     */
    private void onMessage(String topic, byte[] payload) {
        // 分发到指令处理器
        commandDispatcher.handleMessage(topic, payload);
    }

    /**
     * 构建注册消息
     */
    private String buildRegisterMessage() {
        return String.format(
            "{\"edgeNodeId\":\"%s\",\"timestamp\":%d,\"version\":\"1.0.0\"}",
            edgeNodeId, System.currentTimeMillis()
        );
    }

    /**
     * 清理离线缓存
     */
    private void cleanupOfflineCache() {
        if (dataSyncManager != null) {
            dataSyncManager.cleanup();
        }
    }

    /**
     * 获取边缘节点ID
     */
    public String getEdgeNodeId() {
        return edgeNodeId;
    }

    /**
     * 检查是否连接
     */
    public boolean isConnected() {
        return connected.get();
    }

    /**
     * 上报车辆数据
     */
    public void reportVehicleData(String data) {
        if (edgeClient != null && connected.get()) {
            edgeClient.publish("edge/" + edgeNodeId + "/data", data, 1);
        } else {
            // 离线缓存
            if (dataSyncManager != null) {
                dataSyncManager.cacheData(data);
            }
        }
    }

    /**
     * 获取节点健康状态
     */
    public NodeHealthStatus getNodeHealthStatus() {
        return healthMonitor != null ? healthMonitor.getStatus() : null;
    }
}

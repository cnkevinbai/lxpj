package com.daod.iov.plugin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 示例模块 - 用于验证模块化框架功能
 */
public class SampleModule implements IModule {
    
    private static final Logger logger = LoggerFactory.getLogger(SampleModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;
    private ModuleContext context;
    
    public SampleModule() {
        this.metadata = new ModuleMetadata("sample-module", "1.0.0", "示例模块，用于验证模块化框架功能");
        this.metadata.setType("extension");
        this.metadata.setPriority(100);
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
        this.state = ModuleState.INITIALIZING;
        
        logger.info("SampleModule 正在初始化...");
        
        // 模拟初始化过程
        try {
            Thread.sleep(100); // 模拟一些初始化工作
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("INITIALIZATION_INTERRUPTED", "模块初始化被中断");
        }
        
        this.state = ModuleState.INITIALIZED;
        this.healthStatus = HealthStatus.HEALTHY;
        logger.info("SampleModule 初始化完成");
    }
    
    @Override
    public void start() throws ModuleException {
        if (state != ModuleState.INITIALIZED && state != ModuleState.STOPPED) {
            throw new ModuleException("INVALID_STATE", "模块无法在当前状态下启动: " + state);
        }
        
        this.state = ModuleState.STARTING;
        logger.info("SampleModule 正在启动...");
        
        // 模拟启动过程
        try {
            Thread.sleep(100); // 模拟一些启动工作
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("START_INTERRUPTED", "模块启动被中断");
        }
        
        this.state = ModuleState.RUNNING;
        this.healthStatus = HealthStatus.HEALTHY;
        logger.info("SampleModule 启动完成");
    }
    
    @Override
    public void stop() throws ModuleException {
        if (state != ModuleState.RUNNING) {
            throw new ModuleException("INVALID_STATE", "模块无法在当前状态下停止: " + state);
        }
        
        this.state = ModuleState.STOPPING;
        logger.info("SampleModule 正在停止...");
        
        // 模拟停止过程
        try {
            Thread.sleep(100); // 模拟一些清理工作
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("STOP_INTERRUPTED", "模块停止被中断");
        }
        
        this.state = ModuleState.STOPPED;
        this.healthStatus = HealthStatus.OFFLINE;
        logger.info("SampleModule 停止完成");
    }
    
    @Override
    public void destroy() throws ModuleException {
        if (state == ModuleState.DESTROYED) {
            return; // 已经销毁，直接返回
        }
        
        this.state = ModuleState.DESTROYING;
        logger.info("SampleModule 正在销毁...");
        
        // 模拟销毁过程
        try {
            Thread.sleep(100); // 模拟一些销毁工作
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("DESTROY_INTERRUPTED", "模块销毁被中断");
        }
        
        this.state = ModuleState.DESTROYED;
        this.healthStatus = HealthStatus.OFFLINE;
        logger.info("SampleModule 销毁完成");
    }
    
    @Override
    public ModuleState getState() {
        return state;
    }
    
    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
}
package com.daod.iov.core.hotreload;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 热更新引擎模块
 * 
 * 负责模块的动态加载、卸载、更新和版本管理
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class HotReloadEngine implements IModule {
    
    private static final Logger logger = LoggerFactory.getLogger(HotReloadEngine.class);
    
    // ==================== 模块基础属性 ====================
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 模块注册表 ====================
    private final Map<String, IModule> modules = new ConcurrentHashMap<>();
    
    /**
     * 构造函数
     */
    public HotReloadEngine() {
        this.metadata = new ModuleMetadata(
            "hot-reload-engine",
            "1.0.0",
            "热更新引擎"
        );
        this.metadata.setType("core");
        this.metadata.setPriority(10);
    }
    
    // ==================== 生命周期 ====================
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        this.state = ModuleState.INITIALIZED;
        this.healthStatus = HealthStatus.HEALTHY;
        logger.info("热更新引擎初始化完成");
    }
    
    @Override
    public void start() {
        this.state = ModuleState.RUNNING;
        logger.info("热更新引擎启动完成");
    }
    
    @Override
    public void stop() {
        this.state = ModuleState.STOPPED;
        logger.info("热更新引擎停止完成");
    }
    
    @Override
    public void destroy() {
        this.modules.clear();
        this.state = ModuleState.DESTROYED;
        logger.info("热更新引擎销毁完成");
    }
    
    // ==================== 状态查询 ====================
    
    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }
    
    @Override
    public ModuleState getState() {
        return state;
    }
    
    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
    
    // ==================== 模块管理 ====================
    
    /**
     * 注册模块
     */
    public void registerModule(String moduleId, IModule module) {
        modules.put(moduleId, module);
        logger.info("模块注册: {}", moduleId);
    }
    
    /**
     * 注销模块
     */
    public void unregisterModule(String moduleId) {
        modules.remove(moduleId);
        logger.info("模块注销: {}", moduleId);
    }
    
    /**
     * 获取模块
     */
    public IModule getModule(String moduleId) {
        return modules.get(moduleId);
    }
    
    /**
     * 获取所有模块ID
     */
    public List<String> getModuleIds() {
        return new ArrayList<>(modules.keySet());
    }
    
    /**
     * 热更新模块
     */
    public boolean hotReload(String moduleId, IModule newModule) {
        IModule oldModule = modules.get(moduleId);
        
        try {
            // 停止旧模块
            if (oldModule != null) {
                oldModule.stop();
                oldModule.destroy();
            }
            
            // 启动新模块
            if (context != null) {
                newModule.initialize(context);
            }
            newModule.start();
            
            // 注册新模块
            modules.put(moduleId, newModule);
            
            logger.info("模块热更新成功: {}", moduleId);
            return true;
            
        } catch (Exception e) {
            logger.error("模块热更新失败: {}", moduleId, e);
            
            // 尝试回滚
            if (oldModule != null) {
                try {
                    oldModule.start();
                    modules.put(moduleId, oldModule);
                    logger.info("模块回滚成功: {}", moduleId);
                } catch (Exception ex) {
                    logger.error("模块回滚失败: {}", moduleId, ex);
                }
            }
            
            return false;
        }
    }
}
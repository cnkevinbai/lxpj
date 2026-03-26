package com.daod.iov.plugin;

import com.daod.iov.plugin.impl.DefaultModuleManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 模块化框架演示应用程序
 * 展示模块化框架的基本功能
 */
public class DemoApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);
    
    public static void main(String[] args) {
        logger.info("=== 车联网平台模块化框架演示 ===");
        
        try {
            // 创建模块管理器
            ModuleManager moduleManager = new DefaultModuleManager();
            
            // 初始化模块管理器
            logger.info("1. 初始化模块管理器...");
            moduleManager.initialize();
            logger.info("模块管理器初始化完成");
            
            // 创建示例模块
            logger.info("2. 创建示例模块...");
            SampleModule sampleModule = new SampleModule();
            logger.info("示例模块创建完成: {}", sampleModule.getMetadata().getName());
            
            // 演示模块生命周期
            logger.info("3. 演示模块生命周期...");
            
            // 初始化模块
            logger.info("  - 初始化模块");
            ModuleContext context = new ModuleContext(
                sampleModule.getMetadata().getName() + ":" + sampleModule.getMetadata().getVersion(),
                "demo-path",
                null
            );
            sampleModule.initialize(context);
            logger.info("  - 模块状态: {}, 健康状态: {}", sampleModule.getState(), sampleModule.getHealthStatus());
            
            // 启动模块
            logger.info("  - 启动模块");
            sampleModule.start();
            logger.info("  - 模块状态: {}, 健康状态: {}", sampleModule.getState(), sampleModule.getHealthStatus());
            
            // 检查模块状态
            logger.info("  - 检查模块状态: {}", moduleManager.getModuleState(
                sampleModule.getMetadata().getName() + ":" + sampleModule.getMetadata().getVersion()));
            
            // 停止模块
            logger.info("  - 停止模块");
            sampleModule.stop();
            logger.info("  - 模块状态: {}, 健康状态: {}", sampleModule.getState(), sampleModule.getHealthStatus());
            
            // 销毁模块
            logger.info("  - 销毁模块");
            sampleModule.destroy();
            logger.info("  - 模块状态: {}, 健康状态: {}", sampleModule.getState(), sampleModule.getHealthStatus());
            
            // 演示模块管理器功能
            logger.info("4. 演示模块管理器功能...");
            
            // 注册模块监听器
            moduleManager.registerModuleListener(new ModuleListener() {
                @Override
                public void onModuleLoaded(IModule module) {
                    logger.info("监听到模块加载事件: {}", module.getMetadata().getName());
                }
                
                @Override
                public void onModuleUnloaded(String moduleId) {
                    logger.info("监听到模块卸载事件: {}", moduleId);
                }
                
                @Override
                public void onModuleStarted(IModule module) {
                    logger.info("监听到模块启动事件: {}", module.getMetadata().getName());
                }
                
                @Override
                public void onModuleStopped(IModule module) {
                    logger.info("监听到模块停止事件: {}", module.getMetadata().getName());
                }
                
                @Override
                public void onModuleUpdated(String moduleId, String oldVersion, String newVersion) {
                    logger.info("监听到模块更新事件: {} ({} -> {})", moduleId, oldVersion, newVersion);
                }
                
                @Override
                public void onModuleError(String moduleId, Throwable error) {
                    logger.error("监听到模块错误事件: {} - {}", moduleId, error.getMessage());
                }
                
                @Override
                public void onModuleStateChanged(String moduleId, ModuleState oldState, ModuleState newState) {
                    logger.info("监听到模块状态变更事件: {} ({} -> {})", moduleId, oldState, newState);
                }
            });
            
            logger.info("模块管理器中的模块数量: {}", moduleManager.getAllModules().size());
            
            // 演示依赖解析
            logger.info("5. 演示依赖解析功能...");
            ModuleMetadata metadata = new ModuleMetadata("demo-module", "1.0.0", "演示模块");
            
            ModuleMetadata.Dependency dep1 = new ModuleMetadata.Dependency("common-core", "1.0.0");
            dep1.setOptional(false);
            ModuleMetadata.Dependency dep2 = new ModuleMetadata.Dependency("security-core", "1.0.0");
            dep2.setOptional(true);
            
            metadata.setDependencies(java.util.Arrays.asList(dep1, dep2));
            
            logger.info("模块依赖:");
            for (ModuleMetadata.Dependency dep : metadata.getDependencies()) {
                logger.info("  - {}: {} (可选: {})", dep.getName(), dep.getVersion(), dep.isOptional());
            }
            
            logger.info("=== 演示完成 ===");
            
        } catch (ModuleException e) {
            logger.error("模块化框架演示过程中发生错误: ", e);
        }
    }
}
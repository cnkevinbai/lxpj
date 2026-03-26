package com.daod.iov.demo;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.vehiclemonitor.VehicleMonitorModule;

/**
 * 模块化框架演示应用程序
 * 展示如何使用模块管理器加载、启动和管理模块
 */
public class ModuleDemoApplication {

    public static void main(String[] args) {
        System.out.println("=================================");
        System.out.println("  车联网管理平台模块演示程序");
        System.out.println("=================================");
        
        try {
            // 获取模块管理器实例
            ModuleManager manager = ModuleManagerFactory.getInstance();
            
            // 初始化模块管理器
            System.out.println("\n1. 初始化模块管理器...");
            manager.initialize();
            System.out.println("   模块管理器初始化完成");
            
            // 创建车辆监控模块实例
            System.out.println("\n2. 创建车辆监控模块实例...");
            VehicleMonitorModule vehicleMonitorModule = new VehicleMonitorModule();
            System.out.println("   模块名称: " + vehicleMonitorModule.getMetadata().getName());
            System.out.println("   模块版本: " + vehicleMonitorModule.getMetadata().getVersion());
            System.out.println("   模块描述: " + vehicleMonitorModule.getMetadata().getDescription());
            System.out.println("   初始状态: " + vehicleMonitorModule.getState());
            
            // 注册模块监听器
            System.out.println("\n3. 注册模块监听器...");
            manager.registerModuleListener(new DemoModuleListener());
            System.out.println("   模块监听器注册完成");
            
            // 由于我们没有实际的JAR文件，我们将直接使用模块实例
            // 在实际应用中，我们会使用 manager.loadModule("path/to/module.jar") 来加载模块
            
            // 演示模块生命周期
            System.out.println("\n4. 演示模块生命周期管理...");
            
            // 初始化模块
            System.out.println("   - 初始化模块...");
            ModuleContext context = new ModuleContext(
                vehicleMonitorModule.getMetadata().getName() + ":1.0.0",
                "demo-context",
                null
            );
            context.setModuleManager(manager);
            vehicleMonitorModule.initialize(context);
            System.out.println("   - 模块状态: " + vehicleMonitorModule.getState());
            
            // 启动模块
            System.out.println("   - 启动模块...");
            vehicleMonitorModule.start();
            System.out.println("   - 模块状态: " + vehicleMonitorModule.getState());
            
            // 检查模块健康状态
            System.out.println("   - 模块健康状态: " + vehicleMonitorModule.getHealthStatus());
            
            // 等待一段时间
            System.out.println("   - 模块运行中...");
            Thread.sleep(1000);
            
            // 停止模块
            System.out.println("   - 停止模块...");
            vehicleMonitorModule.stop();
            System.out.println("   - 模块状态: " + vehicleMonitorModule.getState());
            
            // 销毁模块
            System.out.println("   - 销毁模块...");
            vehicleMonitorModule.destroy();
            System.out.println("   - 模块状态: " + vehicleMonitorModule.getState());
            
            System.out.println("\n5. 演示完成！");
            
        } catch (Exception e) {
            System.err.println("演示过程中发生错误: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // 关闭模块管理器
            System.out.println("\n6. 关闭模块管理器...");
            ModuleManagerFactory.shutdown();
            System.out.println("   模块管理器已关闭");
        }
        
        System.out.println("\n=================================");
        System.out.println("  演示程序结束");
        System.out.println("=================================");
    }
    
    /**
     * 演示用的模块监听器
     */
    static class DemoModuleListener implements ModuleListener {
        @Override
        public void onModuleLoaded(IModule module) {
            System.out.println("   >>> 模块已加载: " + module.getMetadata().getName());
        }

        @Override
        public void onModuleUnloaded(String moduleId) {
            System.out.println("   >>> 模块已卸载: " + moduleId);
        }

        @Override
        public void onModuleStarted(IModule module) {
            System.out.println("   >>> 模块已启动: " + module.getMetadata().getName());
        }

        @Override
        public void onModuleStopped(IModule module) {
            System.out.println("   >>> 模块已停止: " + module.getMetadata().getName());
        }

        @Override
        public void onModuleUpdated(String moduleId, String oldVersion, String newVersion) {
            System.out.println("   >>> 模块已更新: " + moduleId + " (" + oldVersion + " -> " + newVersion + ")");
        }

        @Override
        public void onModuleStateChanged(IModule module, ModuleState oldState, ModuleState newState) {
            System.out.println("   >>> 模块状态变更: " + module.getMetadata().getName() + " (" + oldState + " -> " + newState + ")");
        }
    }
}
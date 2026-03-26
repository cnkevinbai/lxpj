package com.daod.iov.modules.edgeproxy;

import com.daod.iov.plugin.ModuleContext;
import java.util.HashMap;
import java.util.Map;

/**
 * 边缘代理模块启动入口
 */
public class EdgeProxyMain {
    
    public static void main(String[] args) {
        EdgeProxyService service = new EdgeProxyService();
        
        // 创建模块配置
        Map<String, Object> config = new HashMap<>();
        config.put("edgeNodeId", "edge-node-1");
        config.put("mqttBroker", "tcp://localhost:1883");
        config.put("cloudEndpoint", "wss://api.daod.io/edge");
        
        // 创建模块上下文
        ModuleContext context = new ModuleContext("edge-proxy:1.0.0", "", config);
        
        try {
            // 初始化模块
            service.initialize(context);
            
            // 启动模块
            service.start();
            
            System.out.println("边缘代理模块正在运行...");
            
            // 保持运行
            Thread.sleep(60000);
            
            // 停止模块
            service.stop();
            
            // 销毁模块
            service.destroy();
            
        } catch (Exception e) {
            System.err.println("边缘代理模块运行异常: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

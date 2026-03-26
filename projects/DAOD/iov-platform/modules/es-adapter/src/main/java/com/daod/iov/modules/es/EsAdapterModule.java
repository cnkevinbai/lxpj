package com.daod.iov.modules.es;

import com.daod.iov.common.core.module.AbstractModule;
import com.daod.iov.common.core.module.ModuleContext;
import com.daod.iov.common.core.module.ModuleMetadata;
import com.daod.iov.common.core.module.ModuleState;

/**
 * Elasticsearch 适配器模块
 * 
 * 功能:
 * 1. 日志检索 - 系统日志、操作日志、审计日志检索
 * 2. 轨迹搜索 - 车辆轨迹数据检索
 * 3. 全文检索 - 车辆信息、用户信息检索
 * 4. 告警检索 - 历史告警数据检索
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class EsAdapterModule extends AbstractModule {
    
    public EsAdapterModule() {
        super(ModuleMetadata.builder()
            .id("es-adapter")
            .name("Elasticsearch Adapter")
            .version("1.0.0")
            .description("Elasticsearch搜索适配器，提供日志检索、轨迹搜索、全文检索能力")
            .type("adapter")
            .priority(50)
            .build());
    }
    
    @Override
    protected void doInitialize(ModuleContext context) {
        log.info("初始化 Elasticsearch 适配器模块...");
        // 初始化 Elasticsearch 客户端
    }
    
    @Override
    protected void doStart() {
        log.info("启动 Elasticsearch 适配器模块...");
        setState(ModuleState.RUNNING);
    }
    
    @Override
    protected void doStop() {
        log.info("停止 Elasticsearch 适配器模块...");
        setState(ModuleState.STOPPED);
    }
    
    @Override
    protected void doDestroy() {
        log.info("销毁 Elasticsearch 适配器模块...");
        // 关闭 Elasticsearch 客户端
    }
}
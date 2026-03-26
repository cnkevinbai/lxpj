package com.daod.iov.modules.edgeproxy;

/**
 * 数据同步适配器
 * 实现数据同步策略的适配
 */
public class DataSyncAdapter {
    
    /**
     * 同步适配
     */
    public void adapt(String strategy, DataSyncHandler handler) {
        System.out.println("适配同步策略: " + strategy);
    }
}

package com.daod.iov.services.config;

/**
 * 配置变更监听器接口
 * 配置中心模块向其他模块提供的扩展点
 */
public interface ConfigListener {
    
    /**
     * 配置变更回调
     * 
     * @param namespace 命名空间
     * @param group 分组
     * @param key 配置Key
     * @param newConfig 新配置
     */
    void onConfigChanged(String namespace, String group, String key, ConfigItem newConfig);
    
    /**
     * 配置删除回调
     * 
     * @param namespace 命名空间
     * @param group 分组
     * @param key 配置Key
     */
    void onConfigDeleted(String namespace, String group, String key);
}

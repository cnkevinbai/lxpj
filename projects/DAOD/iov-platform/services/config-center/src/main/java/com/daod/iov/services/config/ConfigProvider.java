package com.daod.iov.services.config;

/**
 * 配置提供者接口
 * 定义配置中心需要实现的功能
 */
public interface ConfigProvider {
    
    /**
     * 获取单个配置项
     * 
     * @param namespace 命名空间
     * @param group 分组
     * @param key 配置Key
     * @return 配置项
     */
    ConfigItem getConfig(String namespace, String group, String key);
    
    /**
     * 获取指定命名空间下的所有配置
     * 
     * @param namespace 命名空间
     * @return 配置映射
     */
    java.util.Map<String, ConfigItem> getConfigByNamespace(String namespace);
    
    /**
     * 获取指定分组下的所有配置
     * 
     * @param namespace 命名空间
     * @param group 分组
     * @return 配置映射
     */
    java.util.Map<String, java.util.Map<String, ConfigItem>> getConfigByGroup(String namespace, String group);
    
    /**
     * 获取配置的历史版本
     * 
     * @param namespace 命名空间
     * @param group 分组
     * @param key 配置Key
     * @param limit 返回数量限制
     * @return 历史配置列表
     */
    java.util.List<ConfigItem> getConfigHistory(String namespace, String group, String key, int limit);
    
    /**
     * 添加配置监听器
     * 
     * @param listener 监听器
     */
    void addConfigListener(ConfigListener listener);
    
    /**
     * 移除配置监听器
     * 
     * @param listener 监听器
     */
    void removeConfigListener(ConfigListener listener);
}

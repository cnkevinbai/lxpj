package com.daod.iov.services.config;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 配置项实体类
 * 代表一个完整的配置项
 */
@Data
public class ConfigItem {
    
    /**
     * 配置ID
     */
    private String id;
    
    /**
     * 命名空间
     */
    private String namespace;
    
    /**
     * 分组
     */
    private String group;
    
    /**
     * 配置Key
     */
    private String key;
    
    /**
     * 配置值
     */
    private String value;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 版本号
     */
    private Integer version;
    
    /**
     * 环境
     */
    private String environment;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
    
    /**
     * 创建人
     */
    private String createdBy;
    
    /**
     * 更新人
     */
    private String updatedBy;
    
    /**
     * 是否启用
     */
    private boolean enabled = true;
    
    /**
     * 是否启用版本历史
     */
    private boolean versionHistoryEnabled = true;
}

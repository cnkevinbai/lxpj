package com.daod.iov.modules.role.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 权限实体类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Permission {
    /**
     * 权限ID
     */
    private String id;
    
    /**
     * 租户ID
     */
    private String tenantId;
    
    /**
     * 权限名称
     */
    private String name;
    
    /**
     * 权限编码
     */
    private String code;
    
    /**
     * 权限类型（menu:菜单, operation:操作, data:数据）
     */
    private String type;
    
    /**
     * 父权限ID
     */
    private String parentId;
    
    /**
     * 权限路径（菜单路由或API路径）
     */
    private String path;
    
    /**
     * 组件路径（前端组件）
     */
    private String component;
    
    /**
     * 图标
     */
    private String icon;
    
    /**
     * 排序序号
     */
    private Integer sort;
    
    /**
     * 是否隐藏
     */
    private boolean hidden;
    
    /**
     * 是否禁用
     */
    private boolean disabled;
    
    /**
     * 扩展属性
     */
    private Map<String, Object> extensions;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 创建人
     */
    private String createdBy;
    
    /**
     * 更新人
     */
    private String updatedBy;
}

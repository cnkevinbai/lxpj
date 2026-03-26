package com.daod.iov.modules.role.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 权限响应DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PermissionResponse {
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
     * 权限类型
     */
    private String type;
    
    /**
     * 父权限ID
     */
    private String parentId;
    
    /**
     * 父权限名称
     */
    private String parentName;
    
    /**
     * 权限路径
     */
    private String path;
    
    /**
     * 组件路径
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
    private String createdAt;
    
    /**
     * 更新时间
     */
    private String updatedAt;
}

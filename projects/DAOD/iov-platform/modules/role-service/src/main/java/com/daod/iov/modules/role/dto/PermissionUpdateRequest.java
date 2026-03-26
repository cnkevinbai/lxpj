package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 权限更新请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PermissionUpdateRequest {
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
     * 父权限ID
     */
    private String parentId;
    
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
    private Boolean hidden;
    
    /**
     * 是否禁用
     */
    private Boolean disabled;
    
    /**
     * 扩展属性
     */
    private Map<String, Object> extensions;
}

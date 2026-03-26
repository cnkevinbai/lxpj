package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 权限创建请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PermissionCreateRequest {
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
     * 扩展属性
     */
    private Map<String, Object> extensions;
}

package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色更新请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleUpdateRequest {
    /**
     * 角色ID
     */
    private String id;
    
    /**
     * 租户ID
     */
    private String tenantId;
    
    /**
     * 角色名称
     */
    private String name;
    
    /**
     * 角色编码
     */
    private String code;
    
    /**
     * 父角色ID（用于继承）
     */
    private String parentId;
    
    /**
     * 角色描述
     */
    private String description;
    
    /**
     * 菜单权限ID列表
     */
    private List<String> menuPermissions;
    
    /**
     * 操作权限ID列表
     */
    private List<String> operationPermissions;
    
    /**
     * 数据权限配置
     */
    private RoleDataPermissionRequest dataPermission;
    
    /**
     * 是否禁用
     */
    private Boolean disabled;
    
    /**
     * 扩展属性
     */
    private Map<String, Object> extensions;
}

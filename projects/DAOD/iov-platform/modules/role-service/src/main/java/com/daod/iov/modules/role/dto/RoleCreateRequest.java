package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色创建请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleCreateRequest {
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
     * 是否默认角色
     */
    private boolean defaultRole;
    
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
     * 扩展属性
     */
    private Map<String, Object> extensions;
}

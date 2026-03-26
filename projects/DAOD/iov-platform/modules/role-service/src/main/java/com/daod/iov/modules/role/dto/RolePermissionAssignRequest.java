package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色-权限关联请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RolePermissionAssignRequest {
    /**
     * 角色ID
     */
    private String roleId;
    
    /**
     * 租户ID
     */
    private String tenantId;
    
    /**
     * 要分配的菜单权限ID列表
     */
    private List<String> menuPermissionIds;
    
    /**
     * 要分配的操作权限ID列表
     */
    private List<String> operationPermissionIds;
    
    /**
     * 要分配的数据权限配置
     */
    private RoleDataPermissionRequest dataPermission;
}

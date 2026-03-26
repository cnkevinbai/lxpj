package com.daod.iov.modules.role.dto;

import com.daod.iov.modules.role.entity.*;
import lombok.*;
import java.util.*;

/**
 * 角色响应DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleResponse {
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
     * 父角色ID
     */
    private String parentId;
    
    /**
     * 角色层级
     */
    private Integer level;
    
    /**
     * 父角色名称
     */
    private String parentName;
    
    /**
     * 角色描述
     */
    private String description;
    
    /**
     * 角色类型
     */
    private String type;
    
    /**
     * 是否默认角色
     */
    private boolean defaultRole;
    
    /**
     * 是否禁用
     */
    private boolean disabled;
    
    /**
     * 菜单权限ID列表
     */
    private List<String> menuPermissions;
    
    /**
     * 操作权限列表
     */
    private List<String> operationPermissions;
    
    /**
     * 数据权限配置
     */
    private RoleDataPermissionResponse dataPermission;
    
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
    
    /**
     * 创建人
     */
    private String createdBy;
    
    /**
     * 更新人
     */
    private String updatedBy;
    
    /**
     * 继承的权限ID列表
     */
    private List<String> inheritedPermissions;
    
    /**
     * 子角色数量
     */
    private int childRoleCount;
}

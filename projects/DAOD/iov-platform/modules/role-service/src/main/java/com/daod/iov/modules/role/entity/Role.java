package com.daod.iov.modules.role.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 角色实体类
 * 
 * 功能特性:
 * - 多租户角色隔离
 * - 角色继承机制
 * - 默认角色模板
 * - 权限定义和管理
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Role {
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
     * 父角色ID（用于角色继承）
     */
    private String parentId;
    
    /**
     * 角色层级
     */
    private Integer level;
    
    /**
     * 角色描述
     */
    private String description;
    
    /**
     * 角色类型（system：系统角色，custom：自定义角色）
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
    private DataPermissionConfig dataPermission;
    
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
    
    /**
     * 数据权限配置
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DataPermissionConfig {
        /**
         * 数据权限类型（none:无限制, tenant:租户内部, dept:部门内, self:本人, custom:自定义）
         */
        private String type;
        
        /**
         * 受限的数据范围ID列表
         */
        private List<String> scopeIds;
        
        /**
         * 是否继承父角色的数据权限
         */
        private boolean inheritParent;
    }
}

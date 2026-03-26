package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色数据权限请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleDataPermissionRequest {
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
    private Boolean inheritParent;
}

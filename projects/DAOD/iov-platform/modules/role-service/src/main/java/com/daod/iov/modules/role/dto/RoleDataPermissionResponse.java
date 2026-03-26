package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色数据权限响应
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleDataPermissionResponse {
    /**
     * 数据权限类型
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

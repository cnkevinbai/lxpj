package com.daod.iov.modules.role;

import java.util.*;

/**
 * 权限提供者扩展点接口
 */
public interface PermissionProvider {
    /**
     * 获取角色的权限列表
     * 
     * @param roleId 角色ID
     * @param tenantId 租户ID
     * @return 权限列表
     */
    List<String> getPermissions(String roleId, String tenantId);
}

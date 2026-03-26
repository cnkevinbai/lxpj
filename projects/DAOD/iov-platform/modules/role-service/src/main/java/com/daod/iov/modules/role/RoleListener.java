package com.daod.iov.modules.role;

import com.daod.iov.modules.role.entity.Role;

/**
 * 角色监听器扩展点接口
 */
public interface RoleListener {
    /**
     * 角色创建回调
     * 
     * @param role 角色对象
     */
    void onRoleCreated(Role role);
    
    /**
     * 角色更新回调
     * 
     * @param role 角色对象
     */
    void onRoleUpdated(Role role);
    
    /**
     * 角色删除回调
     * 
     * @param role 角色对象
     */
    void onRoleDeleted(Role role);
    
    /**
     * 权限分配回调
     * 
     * @param role 角色对象
     */
    void onPermissionAssigned(Role role);
}

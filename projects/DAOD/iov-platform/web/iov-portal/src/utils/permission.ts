/**
 * 权限工具函数
 * 
 * @description 权限校验方法
 * @author daod-team
 */

import { getUserInfo } from './storage';

/**
 * 检查是否有权限
 */
export const hasPermission = (permission: string): boolean => {
  const user = getUserInfo();
  if (!user) return false;
  
  // 超级管理员拥有所有权限
  if (user.role === 'admin' || user.role === 'super_admin') {
    return true;
  }
  
  // 检查权限列表
  const permissions = user.permissions || [];
  return permissions.includes('ALL') || permissions.includes(permission);
};

/**
 * 检查是否有任一权限
 */
export const hasAnyPermission = (permissionList: string[]): boolean => {
  return permissionList.some(p => hasPermission(p));
};

/**
 * 检查是否有所有权限
 */
export const hasAllPermissions = (permissionList: string[]): boolean => {
  return permissionList.every(p => hasPermission(p));
};

/**
 * 检查是否有角色
 */
export const hasRole = (role: string): boolean => {
  const user = getUserInfo();
  if (!user) return false;
  return user.role === role;
};

/**
 * 检查是否有任一角色
 */
export const hasAnyRole = (roleList: string[]): boolean => {
  return roleList.some(r => hasRole(r));
};

/**
 * 获取当前用户 ID
 */
export const getCurrentUserId = (): string | null => {
  const user = getUserInfo();
  return user?.id || null;
};

/**
 * 获取当前租户 ID
 */
export const getCurrentTenantId = (): string | null => {
  const user = getUserInfo();
  return user?.tenantId || null;
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getUserInfo();
};

/**
 * 权限常量定义
 */
export const PERMISSIONS = {
  // 终端管理
  TERMINAL_VIEW: 'terminal:view',
  TERMINAL_CREATE: 'terminal:create',
  TERMINAL_UPDATE: 'terminal:update',
  TERMINAL_DELETE: 'terminal:delete',
  
  // 车辆管理
  VEHICLE_VIEW: 'vehicle:view',
  VEHICLE_CREATE: 'vehicle:create',
  VEHICLE_UPDATE: 'vehicle:update',
  VEHICLE_DELETE: 'vehicle:delete',
  
  // 告警管理
  ALARM_VIEW: 'alarm:view',
  ALARM_HANDLE: 'alarm:handle',
  
  // OTA 管理
  OTA_VIEW: 'ota:view',
  OTA_CREATE: 'ota:create',
  OTA_EXECUTE: 'ota:execute',
  
  // 指令管理
  COMMAND_VIEW: 'command:view',
  COMMAND_EXECUTE: 'command:execute',
  
  // 系统管理
  SYSTEM_SETTINGS: 'system:settings',
  MODULE_MANAGE: 'module:manage',
  USER_MANAGE: 'user:manage',
  ROLE_MANAGE: 'role:manage',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];
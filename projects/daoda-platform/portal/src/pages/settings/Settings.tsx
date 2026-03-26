/**
 * 系统设置模块路由
 */
import { Routes, Route } from 'react-router-dom'
import SettingsDashboard from './SettingsDashboard'
import UserManagement from './UserManagement'
import RoleManagement from './RoleManagement'
import TenantManagement from './TenantManagement'
import SystemSettings from './SystemSettings'
import ModuleManagement from './ModuleManagement'
import WebhookManagement from './WebhookManagement'
import MenuManagement from './MenuManagement'
import ApiKeyManagement from './ApiKeyManagement'
import LogViewer from './LogViewer'

export default function Settings() {
  return (
    <Routes>
      <Route index element={<SettingsDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="roles" element={<RoleManagement />} />
      <Route path="tenants" element={<TenantManagement />} />
      <Route path="system" element={<SystemSettings />} />
      <Route path="modules" element={<ModuleManagement />} />
      <Route path="webhooks" element={<WebhookManagement />} />
      <Route path="menus" element={<MenuManagement />} />
      <Route path="api-keys" element={<ApiKeyManagement />} />
      <Route path="logs" element={<LogViewer />} />
    </Routes>
  )
}
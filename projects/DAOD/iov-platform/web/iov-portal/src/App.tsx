import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import zhCN from 'antd/locale/zh_CN';

// 布局
import MainLayout from './layouts/MainLayout';

// 页面导入
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Terminals from './pages/terminals/Terminals';
import TerminalDetail from './pages/terminals/TerminalDetail';
import Vehicles from './pages/vehicles/Vehicles';
import Map from './pages/map/Map';
import Alarms from './pages/alarms/Alarms';
import Trajectory from './pages/trajectory/Trajectory';
import Geofence from './pages/geofence/Geofence';
import Reports from './pages/reports/Reports';
import Firmware from './pages/firmware/Firmware';
import Commands from './pages/commands/Commands';
import Modules from './pages/modules/Modules';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';

// 新增页面
import DeviceAccess from './pages/access/DeviceAccess';
import AlarmRules from './pages/alarm-rules/AlarmRules';
import RemoteControl from './pages/remote/RemoteControl';
import Tenants from './pages/tenants/Tenants';
import Roles from './pages/roles/Roles';
import Accounts from './pages/accounts/Accounts';

// 创建 React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <Routes>
          {/* 登录页 */}
          <Route path="/login" element={<Login />} />
          
          {/* 主布局路由 */}
          <Route element={<MainLayout />}>
            {/* 监控中心 */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* 设备管理 */}
            <Route path="/terminals" element={<Terminals />} />
            <Route path="/terminals/:id" element={<TerminalDetail />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/access" element={<DeviceAccess />} />
            
            {/* 监控服务 */}
            <Route path="/map" element={<Map />} />
            <Route path="/trajectory" element={<Trajectory />} />
            <Route path="/geofence" element={<Geofence />} />
            
            {/* 告警服务 */}
            <Route path="/alarms" element={<Alarms />} />
            <Route path="/alarm-rules" element={<AlarmRules />} />
            
            {/* 远程控制 */}
            <Route path="/commands" element={<Commands />} />
            <Route path="/remote" element={<RemoteControl />} />
            
            {/* OTA升级 */}
            <Route path="/firmware" element={<Firmware />} />
            <Route path="/ota-tasks" element={<Firmware />} />
            
            {/* 智能规划 */}
            <Route path="/route-planning" element={<Trajectory />} />
            <Route path="/trip-planning" element={<Trajectory />} />
            
            {/* 系统管理 */}
            <Route path="/modules" element={<Modules />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* 默认重定向 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
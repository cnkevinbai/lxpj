import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { AgentsPage } from './pages/AgentsPage';
import { SkillsPage } from './pages/SkillsPage';
import { TasksPage } from './pages/TasksPage';
import { FilesPage } from './pages/FilesPage';
import FileManagementPage from './pages/FileManagementPage';
import { SystemPage } from './pages/SystemPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskWindowPage } from './pages/TaskWindowPage';
import { LoginPage } from './pages/LoginPage';
import { useAuthStore, initializeAuth, isTokenExpired } from './store/authStore';
import { useEffect, useState } from 'react';

// 开发模式：跳过登录
const DEV_SKIP_LOGIN = true;

// 受保护路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore();
  
  // 开发模式直接通过
  if (DEV_SKIP_LOGIN) {
    return <>{children}</>;
  }

  // Token 过期处理
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      useAuthStore.getState().logout();
    }
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 路由组件
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 任务窗口路由 - 独立窗口页面 */}
        <Route path="/task-window" element={<TaskWindowPage />} />
        
        {/* 控制面板路由（受保护） */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="file-management" element={<FileManagementPage />} />
          <Route path="system" element={<SystemPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* 根路由重定向到控制面板 */}
        <Route path="/" element={
          <Navigate to="/admin/dashboard" replace />
        } />
        
        {/* 默认重定向 */}
        <Route path="*" element={
          <Navigate to="/admin/dashboard" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const [initialized, setInitialized] = useState(false);

  // 初始化认证
  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setInitialized(true);
    };
    init();
  }, []);

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl animate-pulse bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg"
          >
            🦞
          </div>
          <p className="text-slate-600 font-medium">OpenClaw 控制面板</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
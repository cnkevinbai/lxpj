/**
 * Notification 通知提醒路由配置
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 页面组件
import NotificationCenter from './NotificationCenter';

// 懒加载组件
const NotificationTemplates = React.lazy(() => import('./NotificationTemplates'));
const NotificationPreference = React.lazy(() => import('./NotificationPreference'));

/**
 * Notification 路由组件
 */
const NotificationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 我的消息 */}
      <Route path="/messages" element={<NotificationCenter />} />
      
      {/* 消息模板 */}
      <Route 
        path="/templates" 
        element={
          <React.Suspense fallback={<div>加载中...</div>}>
            <NotificationTemplates />
          </React.Suspense>
        }
      />
      
      {/* 通知设置 */}
      <Route 
        path="/preference" 
        element={
          <React.Suspense fallback={<div>加载中...</div>}>
            <NotificationPreference />
          </React.Suspense>
        }
      />
      
      {/* 默认路由 */}
      <Route path="/" element={<NotificationCenter />} />
      <Route path="*" element={<NotificationCenter />} />
    </Routes>
  );
};

export default NotificationRoutes;

// 导出页面组件
export { NotificationCenter };
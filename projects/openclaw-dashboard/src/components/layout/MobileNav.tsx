/**
 * 移动端导航组件 - 底部导航栏（管理门户）
 */

import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// SVG 图标
const Icons = {
  dashboard: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  chat: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  tasks: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  files: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
};

// 导航项配置（管理门户）
const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: Icons.dashboard, label: '仪表盘' },
  { path: '/admin/chat', icon: Icons.chat, label: '对话' },
  { path: '/admin/tasks', icon: Icons.tasks, label: '任务' },
  { path: '/admin/files', icon: Icons.files, label: '文件' },
  { path: '/admin/settings', icon: Icons.settings, label: '设置' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 backdrop-blur-xl"
         style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
      <div className="flex items-center justify-around py-2 px-4 safe-area-bottom">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-3"
            >
              {/* 活跃指示器 */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-12 h-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* 图标 */}
              <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              
              {/* 标签 */}
              <span className={`text-xs mt-1 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;

/**
 * AdminLayout - 对内门户布局组件（管理控制台）
 * 面向系统操作员/管理员，提供完整的系统管理功能
 * 风格：深色科技风格，专业、功能导向
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { TaskBar } from '../components/task-window/TaskBar';
import { TaskWindowsContainer } from '../components/task-window/TaskWindowsContainer';
import { TaskMonitor } from '../components/tasks/TaskMonitor';

// SVG 图标
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  agents: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  skills: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  tasks: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  files: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  system: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  };

// 管理门户导航项
const adminNavItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: Icons.dashboard },
  { path: '/admin/chat', label: '实时对话', icon: Icons.chat },
  { path: '/admin/agents', label: '代理管理', icon: Icons.agents },
  { path: '/admin/skills', label: '技能管理', icon: Icons.skills },
  { path: '/admin/tasks', label: '任务中心', icon: Icons.tasks },
  { path: '/admin/files', label: '文件管理', icon: Icons.files },
  { path: '/admin/system', label: '系统运维', icon: Icons.system },
  { path: '/admin/settings', label: '系统设置', icon: Icons.settings },
];

// 侧边栏组件
function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-full flex flex-col" style={{ background: '#0F172A' }}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-slate-800 border border-red-500/50">
            🦞
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">OpenClaw</h1>
            <p className="text-xs" style={{ color: '#94A3B8' }}>管理控制台</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { background: 'rgba(6, 182, 212, 0.15)' } : {}}
            >
              <span className={isActive ? 'text-cyan-400' : ''}>{item.icon}</span>
              <span>{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" 
                     style={{ boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Agent Status */}
      <div className="p-3 border-t border-white/5">
        <div className="p-4 rounded-xl" style={{ background: '#1E293B' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #06B6D4, #A855F7)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">渔晓白</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full status-online" />
                <span className="text-xs" style={{ color: '#22C55E' }}>在线</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a1a] relative">
      {/* 科技感背景 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 网格背景 */}
        <div className="tech-grid" />
        
        {/* 扫描线效果 */}
        <div className="tech-scanline" />
        
        {/* 渐变光晕 */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* 顶部渐变 */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/5 to-transparent" />
      </div>

      {/* Header */}
      <Header />

      {/* 任务栏 */}
      <TaskBar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar - 桌面端显示 */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-transparent pb-20 md:pb-0">
          <div className="p-4 md:p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation - 移动端显示 */}
      <MobileNav />

      {/* 7x24 后台任务监控 */}
      <TaskMonitor />

      {/* 内嵌任务窗口容器 */}
      <TaskWindowsContainer />
    </div>
  );
}

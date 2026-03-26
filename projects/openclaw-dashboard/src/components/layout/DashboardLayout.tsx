/**
 * 未来科技感主布局
 */

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TaskBar } from '../task-window/TaskBar';
import { TaskWindowsContainer } from '../task-window/TaskWindowsContainer';
import { TaskMonitor } from '../tasks/TaskMonitor';
import { Outlet } from 'react-router-dom';

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
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
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-transparent pb-20 md:pb-0">
          <div className="p-4 md:p-6 h-full">
            {children || <Outlet />}
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
/**
 * 任务窗口容器 - 内嵌多窗口显示
 * 
 * 功能：
 * - 显示所有活跃的任务窗口
 * - 支持窗口切换、最小化、关闭
 * - 窗口层叠显示
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { windowService, TaskWindow } from '../../services/window-manager';
import { EmbeddedTaskWindow } from './EmbeddedTaskWindow';

interface TaskWindowsContainerProps {
  onWindowClose?: (windowId: string, result?: string) => void;
}

export function TaskWindowsContainer({ onWindowClose }: TaskWindowsContainerProps) {
  const [windows, setWindows] = useState<TaskWindow[]>([]);

  // 监听窗口变化
  useEffect(() => {
    const updateWindows = () => {
      setWindows(windowService.getAllWindows());
    };

    updateWindows();
    
    // 订阅窗口变化事件
    const unsubscribe = windowService.on('windows_change', updateWindows);
    
    return () => {
      unsubscribe();
    };
  }, []);

  // 关闭窗口
  const handleClose = useCallback((windowId: string) => {
    windowService.closeTaskWindow(windowId);
    onWindowClose?.(windowId);
  }, [onWindowClose]);

  // 最小化窗口
  const handleMinimize = useCallback((windowId: string) => {
    windowService.minimizeWindow(windowId);
  }, []);

  // 激活窗口
  const handleFocus = useCallback((windowId: string) => {
    windowService.focusWindow(windowId);
  }, []);

  // 只显示活跃窗口（最小化的不显示）
  const activeWindows = windows.filter(w => w.status === 'active');

  if (activeWindows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence>
        {activeWindows.map((win, index) => (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto"
            style={{
              zIndex: index + 1,
            }}
          >
            <EmbeddedTaskWindow
              windowId={win.id}
              agentId={win.agentId}
              title={win.title}
              initialMessage={win.initialMessage}
              isMinimized={false}
              onClose={() => handleClose(win.id)}
              onMinimize={() => handleMinimize(win.id)}
              onFocus={() => handleFocus(win.id)}
              onResult={(result) => {
                windowService.updateWindow(win.id, { result });
                windowService.notifyTaskComplete(win.id, result, win.agentId);
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default TaskWindowsContainer;
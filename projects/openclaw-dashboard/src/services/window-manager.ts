/**
 * 窗口管理服务 - 多任务窗口管理（面板内嵌版）
 * 
 * 功能：
 * 1. 创建和管理内嵌任务窗口
 * 2. 窗口状态同步
 * 3. 支持多窗口并行
 */

// 任务窗口定义
export interface TaskWindow {
  id: string;
  sessionId: string;
  agentId: string;
  title: string;
  status: 'active' | 'minimized' | 'closed';
  messageCount: number;
  createdAt: Date;
  initialMessage?: string;
  result?: string;
  pinned?: boolean;
}

// 存储键
const STORAGE_KEY = 'openclaw_task_windows';

// 事件类型
type WindowEventType = 'window_open' | 'window_close' | 'window_update' | 'windows_change' | 'task_complete';
type WindowEventListener = (data: any) => void;

class WindowService {
  private windows: Map<string, TaskWindow> = new Map();
  private listeners: Map<WindowEventType, Set<WindowEventListener>> = new Map();
  private mainWindowId: string | null = null;

  constructor() {
    this.init();
  }

  /**
   * 初始化服务
   */
  private init(): void {
    this.mainWindowId = `main-${Date.now()}`;
    console.log('[WindowService] 初始化 - 主窗口', this.mainWindowId);
    this.loadWindows();
    
    // 监听页面关闭
    window.addEventListener('beforeunload', () => {
      this.saveWindows();
    });
  }

  /**
   * 获取主窗口 ID
   */
  getMainWindowId(): string | null {
    return this.mainWindowId;
  }

  /**
   * 打开任务窗口（内嵌模式）
   */
  openTaskWindow(options: {
    agentId: string;
    title?: string;
    sessionId?: string;
    initialMessage?: string;
  }): string {
    const windowId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = options.sessionId || `session-${windowId}`;
    
    // 创建窗口记录
    const taskWindow: TaskWindow = {
      id: windowId,
      sessionId,
      agentId: options.agentId,
      title: options.title || `任务窗口`,
      status: 'active',
      messageCount: 0,
      createdAt: new Date(),
      initialMessage: options.initialMessage,
      pinned: false,
    };

    this.windows.set(windowId, taskWindow);
    this.saveWindows();
    
    console.log(`[WindowService] 创建内嵌窗口: ${windowId}, Agent: ${options.agentId}`);
    
    this.emit('window_open', taskWindow);
    this.emit('windows_change', this.getAllWindows());
    
    return windowId;
  }

  /**
   * 获取所有窗口
   */
  getAllWindows(): TaskWindow[] {
    return Array.from(this.windows.values())
      .filter(w => w.status !== 'closed');
  }

  /**
   * 获取活跃窗口
   */
  getActiveWindows(): TaskWindow[] {
    return Array.from(this.windows.values())
      .filter(w => w.status === 'active');
  }

  /**
   * 获取窗口
   */
  getWindow(windowId: string): TaskWindow | undefined {
    return this.windows.get(windowId);
  }

  /**
   * 激活窗口（置顶显示）
   */
  focusWindow(windowId: string): void {
    const win = this.windows.get(windowId);
    if (win) {
      // 将其他窗口设为 minimized
      for (const [id, w] of this.windows) {
        if (id !== windowId && w.status === 'active') {
          w.status = 'minimized';
          this.windows.set(id, w);
        }
      }
      
      win.status = 'active';
      this.windows.set(windowId, win);
      this.saveWindows();
      this.emit('window_update', { windowId, updates: { status: 'active' } });
      this.emit('windows_change', this.getAllWindows());
      console.log(`[WindowService] 激活窗口: ${windowId}`);
    }
  }

  /**
   * 最小化窗口
   */
  minimizeWindow(windowId: string): void {
    const win = this.windows.get(windowId);
    if (win) {
      win.status = 'minimized';
      this.windows.set(windowId, win);
      this.saveWindows();
      this.emit('window_update', { windowId, updates: { status: 'minimized' } });
      this.emit('windows_change', this.getAllWindows());
    }
  }

  /**
   * 恢复窗口
   */
  restoreWindow(windowId: string): void {
    this.focusWindow(windowId);
  }

  /**
   * 更新窗口
   */
  updateWindow(windowId: string, updates: Partial<TaskWindow>): void {
    const win = this.windows.get(windowId);
    if (win) {
      Object.assign(win, updates);
      this.windows.set(windowId, win);
      this.saveWindows();
      this.emit('window_update', { windowId, updates });
      this.emit('windows_change', this.getAllWindows());
    }
  }

  /**
   * 关闭任务窗口
   */
  closeTaskWindow(windowId: string): void {
    const win = this.windows.get(windowId);
    if (win) {
      win.status = 'closed';
      this.windows.set(windowId, win);
      this.saveWindows();
      this.emit('window_close', { windowId });
      this.emit('windows_change', this.getAllWindows());
      console.log(`[WindowService] 关闭窗口: ${windowId}`);
    }
  }

  /**
   * 保存窗口状态
   */
  private saveWindows(): void {
    try {
      const data = Array.from(this.windows.values())
        .filter(w => w.status !== 'closed')
        .map(w => ({
          ...w,
          createdAt: w.createdAt.toISOString(),
        }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[WindowService] 保存失败:', e);
    }
  }

  /**
   * 加载窗口状态
   */
  private loadWindows(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const windows = JSON.parse(data);
        for (const w of windows) {
          this.windows.set(w.id, {
            ...w,
            createdAt: new Date(w.createdAt),
          });
        }
        console.log(`[WindowService] 加载 ${this.windows.size} 个窗口`);
      }
    } catch (e) {
      console.error('[WindowService] 加载失败:', e);
    }
  }

  /**
   * 事件监听
   */
  on(event: WindowEventType, callback: WindowEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * 触发事件
   */
  private emit(event: WindowEventType, data: any): void {
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error('[WindowService] 监听器错误:', e);
      }
    });
  }

  /**
   * 检查是否有活跃窗口
   */
  hasActiveWindows(): boolean {
    return Array.from(this.windows.values()).some(w => w.status === 'active');
  }

  /**
   * 获取窗口数量
   */
  getWindowCount(): number {
    return this.windows.size;
  }

  /**
   * 清除所有窗口
   */
  clearAllWindows(): void {
    this.windows.clear();
    this.saveWindows();
    this.emit('windows_change', []);
  }

  /**
   * 通知任务完成（用于 ChatPage 监听）
   */
  notifyTaskComplete(windowId: string, result: string, agentId: string): void {
    console.log(`[WindowService] 任务完成: ${windowId}, Agent: ${agentId}`);
    this.emit('task_complete', { windowId, result, agentId });
  }
}

// 单例导出
export const windowService = new WindowService();
export default windowService;
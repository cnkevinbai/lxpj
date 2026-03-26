/**
 * Store 导出中心
 * 
 * 统一导出所有 Zustand Store，提供初始化函数
 */

// Store exports
export * from './agentStore';
export * from './authStore';
export * from './taskStore';
export * from './settingsStore';
export * from './uiStore';
export * from './session-factory';
export * from './sessionStore';

// 导出具体 hooks
export { useAgentStore } from './agentStore';
export { useAuthStore, initializeAuth, isTokenExpired } from './authStore';
export { useTaskStore } from './taskStore';
export { useSettingsStore } from './settingsStore';
export { useUIStore } from './uiStore';
export { sessionRegistry } from './session-factory';
export { useSessionStore } from './sessionStore';

// 类型导出
export type { Agent } from './agentStore';
export type { User, AuthState } from './authStore';
export type { Task, TaskFilter, TaskPriority, TaskStatus } from './taskStore';
export type { Settings, Theme, Language } from './settingsStore';
export type { Notification } from './uiStore';
export type { SessionState, CompressionState, SummaryState } from './sessionStore';
export type { AgentMemoryState, Memory } from './agentStore';

/**
 * 初始化所有 Store
 * 
 * 在应用启动时调用，加载持久化数据、设置默认值
 */
export async function initializeStores(): Promise<void> {
  console.log('[Store] 初始化所有 Store...');

  try {
    // 初始化认证状态
    const { initializeAuth } = await import('./authStore');
    await initializeAuth();

    // 初始化设置
    const settingsStore = await import('./settingsStore');
    await settingsStore.useSettingsStore.getState().loadSettings();

    // 初始化 UI 主题
    const uiStore = await import('./uiStore');
    const theme = uiStore.useUIStore.getState().theme;
    uiStore.useUIStore.getState().setTheme(theme);

    console.log('[Store] 所有 Store 初始化完成');
  } catch (error) {
    console.error('[Store] 初始化失败:', error);
    throw error;
  }
}

/**
 * 重置所有 Store 到默认状态
 */
export async function resetAllStores(): Promise<void> {
  console.log('[Store] 重置所有 Store...');

  try {
    // 重置 Agent Store
    const agentStore = await import('./agentStore');
    agentStore.useAgentStore.getState().resetToDefault();

    // 重置设置 Store
    const settingsStore = await import('./settingsStore');
    settingsStore.useSettingsStore.getState().resetToDefault();

    // 清除通知
    const uiStore = await import('./uiStore');
    uiStore.useUIStore.getState().clearNotifications();

    console.log('[Store] 所有 Store 已重置');
  } catch (error) {
    console.error('[Store] 重置失败:', error);
    throw error;
  }
}

export default {
  initializeStores,
  resetAllStores,
};
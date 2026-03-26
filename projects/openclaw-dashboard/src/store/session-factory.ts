/**
 * 会话状态工厂 - 支持多实例独立会话
 * 
 * 使用工厂模式创建独立的 Zustand Store 实例
 * 每个任务窗口拥有完全隔离的状态
 */

import { create, StoreApi, UseBoundStore } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface SessionState {
  // 会话标识
  sessionId: string;
  agentId: string;
  
  // 消息列表
  messages: Message[];
  
  // 连接状态
  isConnected: boolean;
  isTyping: boolean;
  
  // 输入状态
  input: string;
  
  // 会话信息
  title: string;
  createdAt: Date;
  lastActiveAt: Date;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  setAgentId: (agentId: string) => void;
  setInput: (input: string) => void;
  setIsConnected: (connected: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  setTitle: (title: string) => void;
  updateLastActive: () => void;
}

// 会话 Store 类型
type SessionStore = UseBoundStore<StoreApi<SessionState>>;

/**
 * 会话 Store 注册表
 * 管理所有独立的会话 Store 实例
 */
class SessionStoreRegistry {
  private stores: Map<string, SessionStore> = new Map();
  
  /**
   * 获取或创建会话 Store
   */
  getOrCreate(sessionId: string, agentId: string = 'main', title: string = '新会话'): SessionStore {
    let store = this.stores.get(sessionId);
    
    if (!store) {
      store = this.createSessionStore(sessionId, agentId, title);
      this.stores.set(sessionId, store);
      console.log(`[SessionRegistry] 创建新会话 Store [${sessionId}]`);
    }
    
    return store;
  }
  
  /**
   * 获取现有会话 Store
   */
  get(sessionId: string): SessionStore | undefined {
    return this.stores.get(sessionId);
  }
  
  /**
   * 移除会话 Store
   */
  remove(sessionId: string): void {
    this.stores.delete(sessionId);
    console.log(`[SessionRegistry] 移除会话 Store [${sessionId}]`);
  }
  
  /**
   * 获取所有会话 ID
   */
  getAllSessionIds(): string[] {
    return Array.from(this.stores.keys());
  }
  
  /**
   * 检查会话是否存在
   */
  has(sessionId: string): boolean {
    return this.stores.has(sessionId);
  }
  
  /**
   * 创建独立的会话 Store
   */
  private createSessionStore(sessionId: string, agentId: string, title: string): SessionStore {
    const now = new Date();
    
    return create<SessionState>((set) => ({
      // 初始状态
      sessionId,
      agentId,
      messages: [],
      isConnected: false,
      isTyping: false,
      input: '',
      title,
      createdAt: now,
      lastActiveAt: now,
      
      // Actions
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date(),
          status: 'sent',
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage],
          lastActiveAt: new Date(),
        }));
        
        console.log(`[SessionStore:${sessionId}] 添加消息 [${message.role}]`);
      },
      
      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },
      
      clearMessages: () => {
        set({ messages: [] });
        console.log(`[SessionStore:${sessionId}] 清空消息`);
      },
      
      setAgentId: (newAgentId) => {
        set({ agentId: newAgentId });
      },
      
      setInput: (input) => {
        set({ input });
      },
      
      setIsConnected: (connected) => {
        set({ isConnected: connected });
      },
      
      setIsTyping: (typing) => {
        set({ isTyping: typing });
      },
      
      setTitle: (newTitle) => {
        set({ title: newTitle });
      },
      
      updateLastActive: () => {
        set({ lastActiveAt: new Date() });
      },
    }));
  }
}

// 导出单例注册表
export const sessionRegistry = new SessionStoreRegistry();

/**
 * React Hook: 使用会话 Store
 */
export function useSessionStore(sessionId: string, agentId?: string, title?: string): SessionState {
  const store = sessionRegistry.getOrCreate(sessionId, agentId, title);
  return store();
}

/**
 * React Hook: 使用会话消息
 */
export function useSessionMessages(sessionId: string): Message[] {
  const store = sessionRegistry.getOrCreate(sessionId);
  return store((state) => state.messages);
}

/**
 * React Hook: 使用会话 Actions
 */
export function useSessionActions(sessionId: string) {
  const store = sessionRegistry.getOrCreate(sessionId);
  return store((state) => ({
    addMessage: state.addMessage,
    updateMessage: state.updateMessage,
    clearMessages: state.clearMessages,
    setAgentId: state.setAgentId,
    setInput: state.setInput,
    setIsConnected: state.setIsConnected,
    setIsTyping: state.setIsTyping,
    setTitle: state.setTitle,
    updateLastActive: state.updateLastActive,
  }));
}
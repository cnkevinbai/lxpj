/**
 * Chat API 服务 - 消息持久化集成
 */

import { get, post, del } from '../config/api-client';

// 消息类型
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  createdAt: string;
  updatedAt?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 会话类型
export interface Session {
  id: string;
  title: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
}

// Chat API 服务
export const chatApi = {
  // 获取会话列表
  getSessions: async (page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Session>> => {
    try {
      const response = await get<PaginatedResponse<Session>>(
        `/chat/sessions?page=${page}&limit=${pageSize}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      return { items: [], total: 0, page, pageSize, hasMore: false };
    }
  },

  // 创建新会话
  createSession: async (data: { title: string; agentId?: string }): Promise<Session> => {
    try {
      const response = await post<Session>('/chat/sessions', data);
      return response;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },

  // 删除会话
  deleteSession: async (sessionId: string): Promise<{ success: boolean }> => {
    try {
      const response = await del<{ success: boolean }>(`/chat/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  },

  // 更新会话标题
  updateSessionTitle: async (sessionId: string, title: string): Promise<Session> => {
    try {
      const response = await post<Session>(`/chat/sessions/${sessionId}`, { title });
      return response;
    } catch (error) {
      console.error('Failed to update session title:', error);
      throw error;
    }
  },

  // 获取消息列表
  getMessages: async (sessionId: string, page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Message>> => {
    try {
      const response = await get<PaginatedResponse<Message>>(
        `/chat/sessions/${sessionId}/messages?page=${page}&limit=${pageSize}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return { items: [], total: 0, page, pageSize, hasMore: false };
    }
  },

  // 发送消息
  sendMessage: async (sessionId: string, data: { content: string; agentId?: string }): Promise<Message> => {
    try {
      const response = await post<Message>(`/chat/sessions/${sessionId}/messages`, data);
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  // 删除消息
  deleteMessage: async (sessionId: string, messageId: string): Promise<{ success: boolean }> => {
    try {
      const response = await del<{ success: boolean }>(
        `/chat/sessions/${sessionId}/messages/${messageId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  // 本地缓存管理
  cache: {
    // 会话缓存
    sessions: new Map<string, Session>(),
    messages: new Map<string, Message[]>(),

    // 缓存会话
    cacheSession: (session: Session) => {
      chatApi.cache.sessions.set(session.id, session);
    },

    // 缓存消息
    cacheMessages: (sessionId: string, messages: Message[]) => {
      chatApi.cache.messages.set(sessionId, messages);
    },

    // 获取缓存的会话
    getCachedSession: (sessionId: string): Session | undefined => {
      return chatApi.cache.sessions.get(sessionId);
    },

    // 获取缓存的消息
    getCachedMessages: (sessionId: string): Message[] | undefined => {
      return chatApi.cache.messages.get(sessionId);
    },

    // 清除缓存
    clear: () => {
      chatApi.cache.sessions.clear();
      chatApi.cache.messages.clear();
    },

    // 清除特定会话的缓存
    clearSessionCache: (sessionId: string) => {
      chatApi.cache.sessions.delete(sessionId);
      chatApi.cache.messages.delete(sessionId);
    },
  },
};

export default chatApi;
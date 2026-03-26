/**
 * Chat API 服务 - 对接后端 REST API
 */

import { apiClient } from '../config/api-client';

// Types
export interface Session {
  id: string;
  title: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  messageCount: number;
  summary?: string;
  compressionSummary?: string;
  isCompressed?: boolean;
  autoCompressEnabled?: boolean;
  metadata?: {
    projectContext?: {
      projectId: string;
      projectName: string;
      projectPath: string;
      lastDiscussedAt: string;
    };
  };
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Session APIs
export const sessionApi = {
  // 获取会话列表
  async getSessions(page = 1, pageSize = 20): Promise<PaginatedResponse<Session>> {
    try {
      const response = await apiClient.get('/chat/sessions', {
        params: { page, limit: pageSize },
      });
      
      const data = response.data || response;
      const sessions = data.sessions || data.items || [];
      
      // 确保每个 session 都有正确的字段
      const items = sessions.map((s: any) => ({
        id: s.id,
        title: s.title || '新对话',
        agentId: s.agentId || 'main',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        lastMessageAt: s.lastMessageAt,
        messageCount: s.messageCount || 0,
      }));
      
      // 按 lastMessageAt 降序排序，有消息的排前面
      items.sort((a: any, b: any) => {
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        }
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        return 0;
      });
      
      console.log('[ChatAPI] Sessions sorted, first has messages:', !!items[0]?.lastMessageAt);
      
      return {
        items,
        total: data.total || items.length,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error('[ChatAPI] getSessions error:', error);
      throw error;
    }
  },

  // 创建新会话
  async createSession(data: { title?: string; agentId?: string }): Promise<Session> {
    try {
      console.log('[ChatAPI] createSession called with:', data);
      const response = await apiClient.post('/chat/sessions', data);
      console.log('[ChatAPI] createSession response:', response);
      // 确保返回正确的数据格式
      const session = response.data || response;
      return {
        id: session.id,
        title: session.title || '新对话',
        agentId: session.agentId || 'main',
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messageCount || 0,
      };
    } catch (error) {
      console.error('[ChatAPI] createSession error:', error);
      throw error;
    }
  },

  // 更新会话标题
  async updateSession(id: string, data: { title?: string; metadata?: any }): Promise<Session> {
    const response = await apiClient.patch(`/chat/sessions/${id}`, data);
    return response.data || response;
  },

  // 删除会话
  async deleteSession(id: string): Promise<void> {
    await apiClient.delete(`/chat/sessions/${id}`);
  },

  // 获取会话详情
  async getSession(id: string): Promise<Session> {
    const response = await apiClient.get(`/chat/sessions/${id}`);
    return response.data || response;
  },

  // 压缩会话上下文
  async compressSession(id: string): Promise<{ success: boolean; summary: string }> {
    try {
      const response = await apiClient.post(`/chat/sessions/${id}/compress`);
      return response.data || response;
    } catch (error) {
      console.error('[ChatAPI] compressSession error:', error);
      throw error;
    }
  },

  // 自动压缩会话上下文
  async autoCompressSession(id: string): Promise<{ success: boolean; summary: string }> {
    try {
      const response = await apiClient.post(`/chat/sessions/${id}/auto-compress`);
      return response.data || response;
    } catch (error) {
      console.error('[ChatAPI] autoCompressSession error:', error);
      throw error;
    }
  },

  // 生成会话摘要
  async generateSummary(id: string): Promise<{ success: boolean; summary: string }> {
    try {
      const response = await apiClient.post(`/chat/sessions/${id}/summary`);
      return response.data || response;
    } catch (error) {
      console.error('[ChatAPI] generateSummary error:', error);
      throw error;
    }
  },
};

// Message APIs
export const messageApi = {
  // 获取会话消息
  async getMessages(sessionId: string, page = 1, pageSize = 50): Promise<PaginatedResponse<Message>> {
    try {
      console.log('[ChatAPI] getMessages called for session:', sessionId);
      const response = await apiClient.get(`/chat/sessions/${sessionId}/messages`, {
        params: { page, limit: pageSize },
      });
      console.log('[ChatAPI] getMessages raw response:', response);
      
      // 后端返回 { messages: [...], total: number }
      const data = response.data || response;
      const messages = data.messages || data.items || [];
      
      console.log('[ChatAPI] getMessages parsed, messages count:', messages.length);
      
      // 确保每条消息都有正确的字段
      const items = messages.map((m: any) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.type || m.role || 'user',
        content: m.content,
        agentId: m.agentId,
        createdAt: m.createdAt,
      }));
      
      return {
        items,
        total: data.total || items.length,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error('[ChatAPI] getMessages error:', error);
      throw error;
    }
  },

  // 发送消息
  async sendMessage(sessionId: string, data: { content: string; agentId?: string }): Promise<Message> {
    const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
      sessionId,
      content: data.content,
      agentId: data.agentId,
    });
    return response.data || response;
  },

  // 删除消息
  async deleteMessage(sessionId: string, messageId: string): Promise<void> {
    await apiClient.delete(`/chat/sessions/${sessionId}/messages/${messageId}`);
  },
};

// Legacy compatibility
export const chatService = {
  getSessions: sessionApi.getSessions,
  createSession: sessionApi.createSession,
  deleteSession: sessionApi.deleteSession,
  sendMessage: (message: any) => apiClient.post('/chat/send', message),
  getSessionDetail: (id: string) => apiClient.get(`/chat/sessions/${id}`),
  compressSession: sessionApi.compressSession,
  autoCompressSession: sessionApi.autoCompressSession,
  generateSummary: sessionApi.generateSummary,
};

export default chatService;
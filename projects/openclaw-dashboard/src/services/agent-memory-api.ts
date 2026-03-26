/**
 * Agent Memory API 服务
 * 对接后端 Agent 记忆管理 API
 */

import { apiClient } from '../config/api-client';

// Types
export interface Memory {
  id: string;
  agentId: string;
  content: string;
  type: 'fact' | 'opinion' | 'experience' | 'recommendation';
  tags: string[];
  relevance: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    source?: string;
    confidence?: number;
  };
}

export interface MemorySearchParams {
  query: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Agent Memory API
export const memoryApi = {
  // 获取 Agent 记忆列表
  async getMemories(agentId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Memory>> {
    try {
      const response = await apiClient.get(`/agents/${agentId}/memories`, {
        params: { page, limit: pageSize },
      });
      
      const data = response.data || response;
      const items = data.memories || data.items || [];
      
      return {
        items,
        total: data.total || items.length,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error('[MemoryAPI] getMemories error:', error);
      throw error;
    }
  },

  // 创建记忆
  async createMemory(agentId: string, data: {
    content: string;
    type: Memory['type'];
    tags?: string[];
    metadata?: Memory['metadata'];
  }): Promise<Memory> {
    try {
      const response = await apiClient.post(`/agents/${agentId}/memories`, data);
      return response.data || response;
    } catch (error) {
      console.error('[MemoryAPI] createMemory error:', error);
      throw error;
    }
  },

  // 获取单条记忆
  async getMemory(agentId: string, memoryId: string): Promise<Memory> {
    try {
      const response = await apiClient.get(`/agents/${agentId}/memories/${memoryId}`);
      return response.data || response;
    } catch (error) {
      console.error('[MemoryAPI] getMemory error:', error);
      throw error;
    }
  },

  // 更新记忆
  async updateMemory(
    agentId: string, 
    memoryId: string, 
    data: Partial<{
      content: string;
      type: Memory['type'];
      tags: string[];
      metadata: Memory['metadata'];
    }>
  ): Promise<Memory> {
    try {
      const response = await apiClient.patch(`/agents/${agentId}/memories/${memoryId}`, data);
      return response.data || response;
    } catch (error) {
      console.error('[MemoryAPI] updateMemory error:', error);
      throw error;
    }
  },

  // 删除记忆
  async deleteMemory(agentId: string, memoryId: string): Promise<void> {
    try {
      await apiClient.delete(`/agents/${agentId}/memories/${memoryId}`);
    } catch (error) {
      console.error('[MemoryAPI] deleteMemory error:', error);
      throw error;
    }
  },

  // 搜索记忆
  async searchMemories(
    agentId: string, 
    params: MemorySearchParams
  ): Promise<PaginatedResponse<Memory>> {
    try {
      const response = await apiClient.get(`/agents/${agentId}/memories/search`, {
        params: {
          q: params.query,
          page: params.page || 1,
          limit: params.pageSize || 20,
        },
      });
      
      const data = response.data || response;
      const items = data.memories || data.items || [];
      
      return {
        items,
        total: data.total || items.length,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      };
    } catch (error) {
      console.error('[MemoryAPI] searchMemories error:', error);
      throw error;
    }
  },
};

// Legacy compatibility
export const memoryService = {
  getMemories: memoryApi.getMemories,
  createMemory: memoryApi.createMemory,
  getMemory: memoryApi.getMemory,
  updateMemory: memoryApi.updateMemory,
  deleteMemory: memoryApi.deleteMemory,
  searchMemories: memoryApi.searchMemories,
};

export default memoryService;

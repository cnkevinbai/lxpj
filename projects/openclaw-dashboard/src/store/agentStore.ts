/**
 * Agent Store - 管理 AI 代理状态
 * 
 * 支持多代理切换、代理配置、智能路由、记忆管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { memoryApi } from '../services/agent-memory-api';

// Agent 定义
export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  specialty: string[];
  keywords: string[];
  color: string;
  enabled: boolean;
}

// Agent Memory 状态
export interface AgentMemoryState {
  // Agent 记忆列表（按 Agent ID 分组）
  memories: Record<string, Memory[]>;
  
  // 搜索结果
  searchResults: Memory[];
  
  // 当前加载中
  loading: boolean;
  
  // 搜索中
  searching: boolean;
}

// Agent 记忆接口
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

// 预定义 Agent 列表
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'main',
    name: '渔晓白',
    avatar: '🦞',
    description: '全能型系统构建者，智能路由、子代理协调',
    specialty: ['系统构建', '架构设计', '代码开发', '问题诊断'],
    keywords: ['帮我', '设计', '开发', '构建', '系统', '架构', '功能'],
    color: '#06B6D4',
    enabled: true,
  },
  {
    id: 'architect',
    name: 'Morgan',
    avatar: '🏛️',
    description: '架构设计专家，微服务、系统设计、技术选型',
    specialty: ['架构设计', '微服务', 'DDD', '技术选型'],
    keywords: ['架构', '微服务', '设计', '技术选型', 'DDD', '系统设计'],
    color: '#8B5CF6',
    enabled: true,
  },
  {
    id: 'backend-dev',
    name: 'Ryan',
    avatar: '💻',
    description: '后端开发专家，NestJS、Spring Cloud、API设计',
    specialty: ['后端开发', 'API设计', '数据库', '微服务'],
    keywords: ['后端', 'API', '接口', 'NestJS', 'Spring', '数据库', '服务'],
    color: '#10B981',
    enabled: true,
  },
  {
    id: 'frontend-dev',
    name: 'Chloe',
    avatar: '🎨',
    description: '前端开发专家，React、Vue、UI组件开发',
    specialty: ['前端开发', 'React', 'Vue', 'UI组件', '样式'],
    keywords: ['前端', 'React', 'Vue', '组件', '页面', 'UI', '样式', 'CSS'],
    color: '#F59E0B',
    enabled: true,
  },
  {
    id: 'database-engineer',
    name: 'Diana',
    avatar: '🗄️',
    description: '数据库专家，SQL优化、索引设计、数据建模',
    specialty: ['数据库设计', 'SQL优化', '索引', '数据建模'],
    keywords: ['数据库', 'SQL', '索引', '表', '查询', '优化', 'Prisma'],
    color: '#EC4899',
    enabled: true,
  },
  {
    id: 'devops-engineer',
    name: 'Sam',
    avatar: '🚀',
    description: '运维专家，Docker、K8s、CI/CD、监控告警',
    specialty: ['部署运维', 'Docker', 'K8s', 'CI/CD', '监控'],
    keywords: ['部署', 'Docker', 'K8s', 'CI/CD', '运维', '监控', '发布'],
    color: '#EF4444',
    enabled: true,
  },
  {
    id: 'security-engineer',
    name: 'Sophia',
    avatar: '🔐',
    description: '安全专家，认证授权、加密、漏洞修复',
    specialty: ['安全', '认证', '授权', '加密', '漏洞'],
    keywords: ['安全', '认证', '授权', 'JWT', '加密', '漏洞', '权限'],
    color: '#6366F1',
    enabled: true,
  },
  {
    id: 'test-engineer',
    name: 'Taylor',
    avatar: '🧪',
    description: '测试专家，单元测试、E2E测试、测试自动化',
    specialty: ['测试', '单元测试', 'E2E', '测试自动化'],
    keywords: ['测试', '单元测试', 'E2E', '覆盖率', 'Jest', 'Playwright'],
    color: '#14B8A6',
    enabled: true,
  },
  {
    id: 'code-reviewer',
    name: 'Blake',
    avatar: '👁️',
    description: '代码审查专家，代码质量、重构、最佳实践',
    specialty: ['代码审查', '重构', '代码质量', '最佳实践'],
    keywords: ['代码审查', '重构', '优化', '代码质量', 'review'],
    color: '#F97316',
    enabled: true,
  },
  {
    id: 'ui-ux-designer',
    name: 'Maya',
    avatar: '✨',
    description: 'UI/UX设计师，界面设计、用户体验、设计系统',
    specialty: ['UI设计', 'UX设计', '用户体验', '设计系统'],
    keywords: ['UI', 'UX', '设计', '界面', '体验', '原型', 'Figma'],
    color: '#A855F7',
    enabled: true,
  },
  {
    id: 'product-manager',
    name: 'Alex',
    avatar: '📊',
    description: '产品经理，需求分析、PRD、用户故事',
    specialty: ['产品', '需求', 'PRD', '用户故事', '路线图'],
    keywords: ['产品', '需求', 'PRD', '用户故事', '功能', '路线图'],
    color: '#0EA5E9',
    enabled: true,
  },
  {
    id: 'coordinator',
    name: 'Casey',
    avatar: '🎯',
    description: '任务协调者，任务分发、进度追踪、风险管理',
    specialty: ['协调', '任务管理', '进度追踪', '风险管理'],
    keywords: ['协调', '分配', '进度', '任务', '管理'],
    color: '#84CC16',
    enabled: true,
  },
];

// Agent 状态
interface AgentState {
  // 代理列表
  agents: Agent[];
  
  // 当前激活的代理
  activeAgentId: string;
  
  // 代理配置
  config: {
    autoRoute: boolean;       // 自动路由
    showSuggestions: boolean; // 显示建议
    maxConcurrent: number;    // 最大并发任务
  };
  
  // Agent 记忆状态
  memory: AgentMemoryState;
  
  // 加载状态
  loading: boolean;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  setActiveAgent: (agentId: string) => void;
  switchAgent: (agentId: string) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  enableAgent: (id: string, enabled: boolean) => void;
  setConfig: (config: Partial<AgentState['config']>) => void;
  setLoading: (loading: boolean) => void;
  
  // Agent 记忆 Actions
  loadMemories: (agentId: string) => Promise<void>;
  addMemory: (agentId: string, memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMemory: (agentId: string, memoryId: string, updates: Partial<Memory>) => Promise<void>;
  deleteMemory: (agentId: string, memoryId: string) => Promise<void>;
  searchMemories: (agentId: string, query: string) => Promise<void>;
  
  // 根据关键词匹配代理
  matchAgent: (text: string) => Agent | null;
  
  // 获取所有匹配的代理
  getAllMatchingAgents: (text: string) => Agent[];
  
  // 重置为默认代理
  resetToDefault: () => void;
}

// 关键词匹配函数
function matchKeywords(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += 1;
    }
  }
  
  return score;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: DEFAULT_AGENTS,
      activeAgentId: 'main',
      config: {
        autoRoute: true,
        showSuggestions: true,
        maxConcurrent: 3,
      },
      memory: {
        memories: {},
        searchResults: [],
        loading: false,
        searching: false,
      },
      loading: false,

      setAgents: (agents) => set({ agents }),
      
      setActiveAgent: (agentId) => {
        const { agents } = get();
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          set({ activeAgentId: agentId });
          console.log(`[AgentStore] 切换到代理: ${agent.name} ${agent.avatar}`);
        }
      },
      
      switchAgent: (agentId) => {
        get().setActiveAgent(agentId);
      },
      
      updateAgent: (id, updates) => {
        set((state) => ({
          agents: state.agents.map(agent =>
            agent.id === id ? { ...agent, ...updates } : agent
          ),
        }));
      },
      
      enableAgent: (id, enabled) => {
        get().updateAgent(id, { enabled });
      },
      
      setConfig: (config) => {
        set((state) => ({
          config: { ...state.config, ...config },
        }));
      },
      
      setLoading: (loading) => set({ loading }),
      
      // 加载 Agent 记忆
      loadMemories: async (agentId) => {
        set({ memory: { ...get().memory, loading: true } });
        try {
          const response = await memoryApi.getMemories(agentId);
          set((state) => ({
            memory: {
              ...state.memory,
              loading: false,
              memories: {
                ...state.memory.memories,
                [agentId]: response.items,
              },
            },
          }));
        } catch (error) {
          console.error(`[AgentStore] Failed to load memories for agent ${agentId}:`, error);
          set({ memory: { ...get().memory, loading: false } });
          throw error;
        }
      },
      
      // 添加记忆
      addMemory: async (agentId, memory) => {
        set({ memory: { ...get().memory, loading: true } });
        try {
          await memoryApi.createMemory(agentId, memory);
          set((state) => ({
            memory: {
              ...state.memory,
              loading: false,
              memories: {
                ...state.memory.memories,
                [agentId]: [...(state.memory.memories[agentId] || [])],
              },
            },
          }));
        } catch (error) {
          console.error(`[AgentStore] Failed to add memory for agent ${agentId}:`, error);
          set({ memory: { ...get().memory, loading: false } });
          throw error;
        }
      },
      
      // 更新记忆
      updateMemory: async (agentId, memoryId, updates) => {
        set({ memory: { ...get().memory, loading: true } });
        try {
          await memoryApi.updateMemory(agentId, memoryId, updates);
          set((state) => ({
            memory: {
              ...state.memory,
              loading: false,
              memories: {
                ...state.memory.memories,
                [agentId]: (state.memory.memories[agentId] || []).map(m =>
                  m.id === memoryId ? { ...m, ...updates } : m
                ),
              },
            },
          }));
        } catch (error) {
          console.error(`[AgentStore] Failed to update memory ${memoryId}:`, error);
          set({ memory: { ...get().memory, loading: false } });
          throw error;
        }
      },
      
      // 删除记忆
      deleteMemory: async (agentId, memoryId) => {
        set({ memory: { ...get().memory, loading: true } });
        try {
          await memoryApi.deleteMemory(agentId, memoryId);
          set((state) => ({
            memory: {
              ...state.memory,
              loading: false,
              memories: {
                ...state.memory.memories,
                [agentId]: (state.memory.memories[agentId] || []).filter(m => m.id !== memoryId),
              },
            },
          }));
        } catch (error) {
          console.error(`[AgentStore] Failed to delete memory ${memoryId}:`, error);
          set({ memory: { ...get().memory, loading: false } });
          throw error;
        }
      },
      
      // 搜索记忆
      searchMemories: async (agentId, query) => {
        set({ memory: { ...get().memory, searching: true } });
        try {
          const response = await memoryApi.searchMemories(agentId, { query });
          set({
            memory: {
              ...get().memory,
              searching: false,
              searchResults: response.items,
            },
          });
        } catch (error) {
          console.error(`[AgentStore] Failed to search memories for agent ${agentId}:`, error);
          set({ memory: { ...get().memory, searching: false } });
          throw error;
        }
      },
      
      matchAgent: (text) => {
        const { agents, config } = get();
        if (!config.autoRoute) return null;
        
        let bestMatch: Agent | null = null;
        let bestScore = 0;
        
        for (const agent of agents) {
          if (!agent.enabled || agent.id === 'main') continue;
          
          const score = matchKeywords(text, agent.keywords);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = agent;
          }
        }
        
        // 需要至少匹配一个关键词
        return bestScore > 0 ? bestMatch : null;
      },
      
      getAllMatchingAgents: (text) => {
        const { agents, config } = get();
        if (!config.autoRoute) return [];
        
        const matches: Array<{ agent: Agent; score: number }> = [];
        
        for (const agent of agents) {
          if (!agent.enabled || agent.id === 'main') continue;
          
          const score = matchKeywords(text, agent.keywords);
          if (score > 0) {
            matches.push({ agent, score });
          }
        }
        
        // 按分数排序
        matches.sort((a, b) => b.score - a.score);
        
        return matches.map(m => m.agent);
      },
      
      resetToDefault: () => {
        set({
          agents: DEFAULT_AGENTS,
          activeAgentId: 'main',
          config: {
            autoRoute: true,
            showSuggestions: true,
            maxConcurrent: 3,
          },
        });
      },
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({
        activeAgentId: state.activeAgentId,
        config: state.config,
      }),
    }
  )
);

export default useAgentStore;
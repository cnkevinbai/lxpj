/**
 * 全局搜索服务
 * 
 * 支持：
 * - 会话搜索（调用真实 API）
 * - 消息搜索
 * - 文件搜索
 * - 任务搜索
 */

import { sessionApi } from './chat-api';

// 搜索结果类型
export type SearchResultType = 'session' | 'message' | 'file' | 'task' | 'agent' | 'setting';

// 搜索结果
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  highlight?: string;
  icon: string;
  path?: string;
  data?: any;
  score: number;
}

// 搜索选项
export interface SearchOptions {
  types?: SearchResultType[];
  limit?: number;
  fuzzy?: boolean;
}

class SearchService {
  private sessionsCache: any[] = [];
  private tasksCache: any[] = [];
  private filesCache: any[] = [];
  private lastCacheUpdate = 0;
  private cacheTTL = 30000; // 30秒缓存

  /**
   * 更新缓存
   */
  private async updateCache(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCacheUpdate < this.cacheTTL) return;
    
    try {
      // 获取真实数据
      const [sessionsRes, tasksRes, filesRes] = await Promise.all([
        sessionApi.getSessions().catch(() => ({ sessions: [] })),
        fetch('/api/tasks').then(r => r.json()).catch(() => []),
        fetch('/api/files').then(r => r.json()).catch(() => []),
      ]);
      
      this.sessionsCache = sessionsRes.sessions || sessionsRes || [];
      this.tasksCache = Array.isArray(tasksRes) ? tasksRes : (tasksRes.tasks || []);
      this.filesCache = Array.isArray(filesRes) ? filesRes : (filesRes.files || []);
      this.lastCacheUpdate = now;
    } catch (error) {
      console.error('[Search] Failed to update cache:', error);
    }
  }

  /**
   * 全局搜索
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const { types, limit = 20, fuzzy = true } = options;
    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    // 更新缓存
    await this.updateCache();

    // 搜索会话
    if (!types || types.includes('session')) {
      results.push(...this.searchSessions(normalizedQuery, fuzzy));
    }

    // 搜索任务
    if (!types || types.includes('task')) {
      results.push(...this.searchTasks(normalizedQuery, fuzzy));
    }

    // 搜索文件
    if (!types || types.includes('file')) {
      results.push(...this.searchFiles(normalizedQuery, fuzzy));
    }

    // 搜索代理
    if (!types || types.includes('agent')) {
      results.push(...this.searchAgents(normalizedQuery, fuzzy));
    }

    // 按分数排序并限制数量
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  /**
   * 搜索会话
   */
  private searchSessions(query: string, fuzzy: boolean): SearchResult[] {
    return this.sessionsCache
      .filter(s => this.matches(s.title || '', query, fuzzy))
      .map(s => ({
        id: s.id,
        type: 'session' as SearchResultType,
        title: s.title || '未命名会话',
        description: `会话 · ${s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('zh-CN') : ''}`,
        icon: '💬',
        path: `/chat?session=${s.id}`,
        score: this.calculateScore(s.title || '', query),
      }));
  }

  /**
   * 搜索任务
   */
  private searchTasks(query: string, fuzzy: boolean): SearchResult[] {
    const statusIcons: Record<string, string> = {
      pending: '⏳',
      in_progress: '🔄',
      completed: '✅',
    };

    return this.tasksCache
      .filter(t => this.matches(t.title || '', query, fuzzy))
      .map(t => ({
        id: t.id,
        type: 'task' as SearchResultType,
        title: t.title || '未命名任务',
        description: `任务 · ${t.status || 'pending'}`,
        icon: statusIcons[t.status] || '📋',
        path: `/tasks?id=${t.id}`,
        score: this.calculateScore(t.title || '', query),
      }));
  }

  /**
   * 搜索文件
   */
  private searchFiles(query: string, fuzzy: boolean): SearchResult[] {
    const typeIcons: Record<string, string> = {
      document: '📄',
      image: '🖼️',
      code: '💻',
    };

    return this.filesCache
      .filter(f => this.matches(f.name || f.fileName || '', query, fuzzy))
      .map(f => ({
        id: f.id,
        type: 'file' as SearchResultType,
        title: f.name || f.fileName || '未命名文件',
        description: `文件 · ${f.size ? (f.size / 1024).toFixed(1) + ' KB' : ''}`,
        icon: typeIcons[f.type] || '📁',
        path: `/files?id=${f.id}`,
        score: this.calculateScore(f.name || f.fileName || '', query),
      }));
  }

  /**
   * 搜索代理
   */
  private searchAgents(query: string, fuzzy: boolean): SearchResult[] {
    const agents = [
      { id: 'main', name: '渔晓白', description: '全能型系统构建者', avatar: '🦞' },
      { id: 'architect', name: 'Morgan', description: '架构设计专家', avatar: '🏛️' },
      { id: 'backend-dev', name: 'Ryan', description: '后端开发专家', avatar: '💻' },
      { id: 'frontend-dev', name: 'Chloe', description: '前端开发专家', avatar: '🎨' },
      { id: 'database-engineer', name: 'Diana', description: '数据库工程师', avatar: '🗄️' },
      { id: 'devops-engineer', name: 'Sam', description: 'DevOps工程师', avatar: '🚀' },
      { id: 'security-engineer', name: 'Sophia', description: '安全工程师', avatar: '🔐' },
      { id: 'test-engineer', name: 'Taylor', description: '测试工程师', avatar: '🧪' },
      { id: 'code-reviewer', name: 'Blake', description: '代码审查员', avatar: '👁️' },
      { id: 'ui-ux-designer', name: 'Maya', description: 'UI/UX设计师', avatar: '✨' },
      { id: 'product-manager', name: 'Alex', description: '产品经理', avatar: '📊' },
      { id: 'coordinator', name: 'Casey', description: '协调员', avatar: '🎯' },
    ];

    return agents
      .filter(a => this.matches(a.name, query, fuzzy) || this.matches(a.description, query, fuzzy))
      .map(a => ({
        id: a.id,
        type: 'agent' as SearchResultType,
        title: a.name,
        description: a.description,
        icon: a.avatar,
        path: `/agents?id=${a.id}`,
        score: this.calculateScore(a.name + ' ' + a.description, query),
      }));
  }

  /**
   * 匹配检查
   */
  private matches(text: string, query: string, fuzzy: boolean): boolean {
    const normalizedText = text.toLowerCase();
    if (fuzzy) {
      return normalizedText.includes(query);
    }
    return normalizedText === query;
  }

  /**
   * 计算匹配分数
   */
  private calculateScore(text: string, query: string): number {
    const normalizedText = text.toLowerCase();
    let score = 0;

    if (normalizedText === query) score += 100;
    else if (normalizedText.startsWith(query)) score += 80;
    else if (normalizedText.includes(query)) score += 60;

    const words = query.split(/\s+/);
    for (const word of words) {
      if (normalizedText.includes(word)) score += 10;
    }

    return score;
  }

  /**
   * 快捷命令搜索
   */
  getCommands(): SearchResult[] {
    return [
      { id: 'cmd-new-chat', type: 'setting', title: '新对话', icon: '💬', path: '/chat?new=true', score: 100 },
      { id: 'cmd-new-task', type: 'setting', title: '新建任务', icon: '📋', path: '/tasks?new=true', score: 100 },
      { id: 'cmd-settings', type: 'setting', title: '设置', icon: '⚙️', path: '/settings', score: 100 },
      { id: 'cmd-agents', type: 'setting', title: '代理管理', icon: '🤖', path: '/agents', score: 100 },
      { id: 'cmd-files', type: 'setting', title: '文件管理', icon: '📁', path: '/files', score: 100 },
    ];
  }
}

export const searchService = new SearchService();
export default searchService;
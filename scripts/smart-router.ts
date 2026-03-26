/**
 * 智能路由服务
 * 根据任务关键词自动匹配最合适的专业代理
 */

interface AutoRoute {
  keywords: string[];
  taskTypes: string[];
  priority: number;
  isDefault?: boolean;
}

interface Agent {
  id: string;
  name: string;
  skills: string[];
  params?: {
    autoRoute?: AutoRoute;
  };
}

interface RouteResult {
  agentId: string;
  agentName: string;
  score: number;
  matchedKeywords: string[];
}

class SmartRouter {
  private agents: Agent[] = [];
  
  /**
   * 初始化路由器
   */
  async initialize(): Promise<void> {
    // 从配置加载代理列表
    const config = await this.loadConfig();
    this.agents = config.agents?.list || [];
  }
  
  /**
   * 智能路由 - 根据任务文本匹配最佳代理
   */
  route(taskText: string): RouteResult {
    const results: RouteResult[] = [];
    
    for (const agent of this.agents) {
      const autoRoute = agent.params?.autoRoute;
      if (!autoRoute) continue;
      
      // 计算关键词匹配分数
      const matchedKeywords = autoRoute.keywords.filter(kw => 
        taskText.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (matchedKeywords.length > 0) {
        results.push({
          agentId: agent.id,
          agentName: agent.name,
          score: matchedKeywords.length * (autoRoute.priority || 1),
          matchedKeywords
        });
      }
    }
    
    // 按分数排序
    results.sort((a, b) => b.score - a.score);
    
    // 返回最佳匹配，无匹配则返回默认代理
    if (results.length > 0) {
      return results[0];
    }
    
    // 返回默认代理 (main)
    const defaultAgent = this.agents.find(a => a.params?.autoRoute?.isDefault);
    return {
      agentId: defaultAgent?.id || 'main',
      agentName: defaultAgent?.name || '渔晓白',
      score: 0,
      matchedKeywords: []
    };
  }
  
  /**
   * 批量路由 - 分析任务并返回所有匹配的代理
   */
  routeAll(taskText: string): RouteResult[] {
    const results: RouteResult[] = [];
    
    for (const agent of this.agents) {
      const autoRoute = agent.params?.autoRoute;
      if (!autoRoute) continue;
      
      const matchedKeywords = autoRoute.keywords.filter(kw => 
        taskText.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (matchedKeywords.length > 0) {
        results.push({
          agentId: agent.id,
          agentName: agent.name,
          score: matchedKeywords.length * (autoRoute.priority || 1),
          matchedKeywords
        });
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  /**
   * 获取代理技能标签
   */
  getAgentSkills(agentId: string): string[] {
    const agent = this.agents.find(a => a.id === agentId);
    return agent?.skills || [];
  }
  
  /**
   * 根据技能查找代理
   */
  findBySkill(skill: string): Agent[] {
    return this.agents.filter(a => 
      a.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }
  
  private async loadConfig(): Promise<any> {
    // 从 OpenClaw 配置文件加载
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(process.env.HOME || '', '.openclaw', 'openclaw.json');
    
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to load config:', error);
      return {};
    }
  }
}

// 导出单例
export const smartRouter = new SmartRouter();

// 使用示例
/*
import { smartRouter } from './smart-router';

// 初始化
await smartRouter.initialize();

// 智能路由
const result = smartRouter.route("帮我设计一个微服务架构");
// → { agentId: "architect", agentName: "架构师 Morgan", score: 45, matchedKeywords: ["架构", "设计", "微服务"] }

const result2 = smartRouter.route("实现用户登录API接口");
// → { agentId: "backend-dev", agentName: "后端开发 Ryan", score: 40, matchedKeywords: ["API", "接口"] }

const result3 = smartRouter.route("优化这个SQL查询性能");
// → { agentId: "database-engineer", agentName: "数据库工程师 Diana", score: 28, matchedKeywords: ["SQL", "查询优化"] }
*/
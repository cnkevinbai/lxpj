/**
 * 流式响应服务 - 通过 OpenClaw Gateway 调用 AI API
 * 
 * 支持：
 * - 真实 AI 流式响应
 * - Function/Tools 传递
 * - 心跳保持连接
 * - 自动重连
 */

import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

// OpenClaw Gateway 配置
const GATEWAY_CONFIG = {
  baseUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789',
  token: process.env.OPENCLAW_GATEWAY_TOKEN || '77784ff3d8dec1f92514d785195227cdfda0b15867416fd0',
};

// Agent 到模型的映射（基于模型特点优化）
// qwen3-max: 最强推理，适合架构、安全、审查
// qwen3-coder-next: 最强代码，适合开发任务
// qwen3-coder-plus: 代码+1M上下文，适合DevOps、测试
// kimi-k2.5: 综合+多模态，适合主对话、设计、产品
const AGENT_MODEL_MAP: Record<string, string> = {
  main: 'kimi-k2.5',                    // 主Agent：综合能力+多模态
  architect: 'qwen3-max-2026-01-23',    // 架构师：最强推理
  'backend-dev': 'qwen3-coder-next',    // 后端开发：最强代码
  'frontend-dev': 'qwen3-coder-next',   // 前端开发：最强代码
  'database-engineer': 'qwen3-max-2026-01-23', // 数据库：强推理
  'devops-engineer': 'qwen3-coder-plus', // DevOps：代码+大上下文
  'security-engineer': 'qwen3-max-2026-01-23', // 安全：强推理
  'test-engineer': 'qwen3-coder-plus',  // 测试：代码+大上下文
  'code-reviewer': 'qwen3-max-2026-01-23', // 代码审查：强推理
  'ui-ux-designer': 'kimi-k2.5',        // UI/UX：创意+多模态
  'product-manager': 'kimi-k2.5',       // 产品：综合分析
  coordinator: 'kimi-k2.5',             // 协调：综合能力
};

// Agent 系统提示词
const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  main: `你是渔晓白，一个全能型 AI 系统构建者。你精通架构设计、善解需求、落笔成码。
你的任务是理解用户需求，并根据任务类型智能分配给专业 Agent。

当检测到专业任务时，你会告诉用户需要分配给哪个专业 Agent。
专业 Agent 列表：
- 🏛️ Morgan (architect) - 架构设计、系统设计
- 💻 Ryan (backend-dev) - 后端开发、API
- 🎨 Chloe (frontend-dev) - 前端开发、React
- 🗄️ Diana (database-engineer) - 数据库设计、SQL
- 🚀 Sam (devops-engineer) - 部署、DevOps
- 🔐 Sophia (security-engineer) - 安全、认证
- 🧪 Taylor (test-engineer) - 测试、QA
- 👁️ Blake (code-reviewer) - 代码审查
- ✨ Maya (ui-ux-designer) - UI/UX 设计
- 📊 Alex (product-manager) - 产品、需求
- 🎯 Casey (coordinator) - 协调、进度

请用中文回复，保持专业、高效、可靠的风格。`,

  architect: `你是 Morgan，一位资深架构师。你精通微服务架构、系统设计、技术选型。
你的专长：架构设计、DDD、技术方案、模块划分、系统优化。
请用中文回复，提供详细的技术方案和架构图建议。`,

  'backend-dev': `你是 Ryan，一位资深后端开发工程师。你精通 NestJS、TypeScript、PostgreSQL、Redis。
你的专长：API 开发、数据库操作、服务实现、性能优化。
请用中文回复，提供可运行的代码示例。`,

  'frontend-dev': `你是 Chloe，一位资深前端开发工程师。你精通 React、TypeScript、Ant Design、状态管理。
你的专长：组件开发、页面实现、UI 交互、性能优化。
请用中文回复，提供可运行的代码示例。`,

  'database-engineer': `你是 Diana，一位资深数据库工程师。你精通 PostgreSQL、SQL、Prisma、数据建模。
你的专长：表结构设计、索引优化、查询优化、数据迁移。
请用中文回复，提供 SQL 和 Prisma schema 示例。`,

  'devops-engineer': `你是 Sam，一位资深 DevOps 工程师。你精通 Docker、Kubernetes、CI/CD、监控。
你的专长：容器化部署、自动化流水线、监控告警、运维优化。
请用中文回复，提供详细的部署方案。`,

  'security-engineer': `你是 Sophia，一位资深安全工程师。你精通认证授权、加密、安全审计。
你的专长：JWT/OAuth、权限设计、安全加固、漏洞修复。
请用中文回复，提供安全方案和代码示例。`,

  'test-engineer': `你是 Taylor，一位资深测试工程师。你精通 Jest、Playwright、测试策略。
你的专长：单元测试、集成测试、E2E 测试、测试覆盖率。
请用中文回复，提供完整的测试用例和代码。`,

  'code-reviewer': `你是 Blake，一位资深代码审查员。你精通代码质量、最佳实践、重构。
你的专长：代码审查、重构建议、性能优化、设计模式。
请用中文回复，提供详细的审查意见和改进建议。`,

  'ui-ux-designer': `你是 Maya，一位资深 UI/UX 设计师。你精通用户研究、交互设计、设计系统。
你的专长：界面设计、用户体验、原型设计、设计规范。
请用中文回复，提供设计建议和交互方案。`,

  'product-manager': `你是 Alex，一位资深产品经理。你精通需求分析、产品规划、用户故事。
你的专长：PRD 编写、需求优先级、产品路线图、数据分析。
请用中文回复，提供详细的产品方案。`,

  coordinator: `你是 Casey，一位资深项目协调员。你精通任务管理、进度追踪、沟通协调。
你的专长：任务分配、进度汇报、资源协调、风险管理。
请用中文回复，提供清晰的协调方案。`,
};

// 流式事件类型
export interface StreamEvent {
  type: 'start' | 'chunk' | 'end' | 'error' | 'heartbeat' | 'connected';
  data: any;
  timestamp: string;
}

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name);

  /**
   * 创建 SSE 流
   */
  createStream(response: Response): void {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no');

    this.sendEvent(response, 'connected', { message: 'Stream connected' });

    const heartbeatInterval = setInterval(() => {
      this.sendEvent(response, 'heartbeat', { timestamp: new Date().toISOString() });
    }, 15000);

    response.on('close', () => {
      clearInterval(heartbeatInterval);
      response.end();
    });
  }

  /**
   * 发送流式事件
   */
  sendEvent(response: Response, event: string, data: any): void {
    const eventData = JSON.stringify({
      type: event,
      data,
      timestamp: new Date().toISOString(),
    });

    response.write(`event: ${event}\n`);
    response.write(`data: ${eventData}\n\n`);
  }

  /**
   * 流式发送文本
   */
  async streamText(
    response: Response,
    content: string,
    options: { chunkSize?: number; delay?: number; agentId?: string } = {}
  ): Promise<void> {
    const { chunkSize = 5, delay = 30, agentId = 'main' } = options;

    this.sendEvent(response, 'start', { agentId });

    const chunks = this.splitIntoChunks(content, chunkSize);
    for (const chunk of chunks) {
      await this.delay(delay);
      this.sendEvent(response, 'chunk', { content: chunk, agentId });
    }

    this.sendEvent(response, 'end', { agentId, totalLength: content.length });
  }

  /**
   * AI 流式响应 - 通过 OpenClaw Gateway
   */
  async streamAI(
    response: Response,
    prompt: string,
    options: {
      agentId?: string;
      sessionId?: string;
      tools?: any[];
    } = {}
  ): Promise<void> {
    const { agentId = 'main', sessionId, tools } = options;
    const model = AGENT_MODEL_MAP[agentId] || 'glm-5';
    const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || AGENT_SYSTEM_PROMPTS.main;

    this.logger.log(`[AI Stream] Agent: ${agentId}, Model: ${model}`);

    try {
      // 构建请求体
      const requestBody: any = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      };

      // 如果有工具，添加到请求
      if (tools && tools.length > 0) {
        requestBody.tools = tools;
        requestBody.tool_choice = 'auto';
      }

      // 调用 Gateway API
      const apiResponse = await fetch(`${GATEWAY_CONFIG.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_CONFIG.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        throw new Error(`Gateway API error: ${apiResponse.status}`);
      }

      if (!apiResponse.body) {
        throw new Error('No response body');
      }

      // 发送开始事件
      this.sendEvent(response, 'start', { agentId, model });

      // 处理流式响应 - Node.js Readable stream
      const stream = apiResponse.body;
      let buffer = '';

      stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString('utf-8');
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            this.sendEvent(response, 'end', { agentId });
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              this.sendEvent(response, 'chunk', { content, agentId });
            }

            // 处理工具调用
            const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;
            if (toolCalls) {
              this.sendEvent(response, 'tool_call', { toolCalls, agentId });
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      });

      // 等待流结束
      await new Promise<void>((resolve, reject) => {
        stream.on('end', () => {
          this.sendEvent(response, 'end', { agentId });
          resolve();
        });
        stream.on('error', (error: Error) => {
          this.logger.error('[AI Stream] Stream error:', error);
          this.sendEvent(response, 'error', { message: error.message });
          reject(error);
        });
      });

    } catch (error: any) {
      this.logger.error('[AI Stream] Failed:', error);
      this.sendEvent(response, 'error', { message: error.message });
      
      // 回退到模拟响应
      await this.simulateAIStream(response, prompt, { agentId });
    }
  }

  /**
   * 模拟 AI 流式响应 (回退方案)
   */
  async simulateAIStream(
    response: Response,
    prompt: string,
    options: { agentId?: string; thinkTime?: number } = {}
  ): Promise<void> {
    const { agentId = 'main', thinkTime = 500 } = options;
    await this.delay(thinkTime);
    const responseText = this.generateAIResponse(prompt, agentId);
    await this.streamText(response, responseText, { agentId });
  }

  /**
   * 生成模拟 AI 响应
   */
  private generateAIResponse(prompt: string, agentId: string): string {
    const responses: Record<string, string[]> = {
      main: ['收到！让我来分析你的问题。', '好的，这是一个很好的想法！'],
      architect: ['从架构角度来看，我建议采用以下方案...', '这是一个典型的分布式系统设计问题。'],
      'backend-dev': ['我来帮你实现这个后端功能。', '这个 API 设计需要考虑以下几点...'],
      'frontend-dev': ['这是一个很好的前端需求！', '从用户体验角度，我建议...'],
    };

    const agentResponses = responses[agentId] || responses.main;
    const baseResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

    return `${baseResponse}\n\n关于"${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"，我的建议是：\n\n1. **明确需求目标** - 确保理解核心问题\n2. **设计方案** - 选择合适的技术方案\n3. **实现验证** - 逐步实现并测试\n\n如果你需要更多细节，请告诉我！\n\n---\n*由 ${agentId} 代理生成*`;
  }

  /**
   * 分割文本为块
   */
  private splitIntoChunks(text: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default StreamService;
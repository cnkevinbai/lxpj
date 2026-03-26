/**
 * AI 聊天服务 - 真实流式响应
 * 
 * 支持：
 * - 流式响应（通过后端 SSE API）
 * - 多 Agent 切换
 * - 消息缓存
 */

// 消息类型
export interface AIResponse {
  id: string;
  content: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  isComplete: boolean;
}

// 回调类型
type StreamCallback = (chunk: string, isComplete: boolean) => void;
type CompleteCallback = (response: AIResponse) => void;

// Agent 配置
const AGENTS = {
  main: { name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  architect: { name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  'backend-dev': { name: 'Ryan', avatar: '💻', color: '#10B981' },
  'frontend-dev': { name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  'database-engineer': { name: 'Diana', avatar: '🗄️', color: '#EC4899' },
  'devops-engineer': { name: 'Sam', avatar: '🚀', color: '#EF4444' },
  'security-engineer': { name: 'Sophia', avatar: '🔐', color: '#6366F1' },
  'test-engineer': { name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  'code-reviewer': { name: 'Blake', avatar: '👁️', color: '#F97316' },
  'ui-ux-designer': { name: 'Maya', avatar: '✨', color: '#A855F7' },
};

// API 基础 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// AI 服务类
class AIChatService {
  private pendingRequests: Map<string, AbortController> = new Map();
  private messageCache: Map<string, AIResponse[]> = new Map();

  /**
   * 发送消息并获取流式响应
   */
  async sendMessage(
    sessionId: string,
    content: string,
    agentId: string = 'main',
    onStream?: StreamCallback,
    onComplete?: CompleteCallback
  ): Promise<AIResponse> {
    // 取消之前的请求
    this.cancelPending(sessionId);

    // 创建新的 AbortController
    const controller = new AbortController();
    this.pendingRequests.set(sessionId, controller);

    const agent = AGENTS[agentId as keyof typeof AGENTS] || AGENTS.main;
    const responseId = `msg-${Date.now()}`;

    try {
      // 调用真实后端 API
      const response = await fetch(`${API_URL}/stream/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          prompt: content,
          agentId,
          sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // 读取流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      // 通知开始
      onStream?.('', false);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        if (controller.signal.aborted) {
          reader.cancel();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.data?.content) {
                fullContent += data.data.content;
                onStream?.(fullContent, false);
              } else if (data.type === 'end') {
                // 完成
                const aiResponse: AIResponse = {
                  id: responseId,
                  content: fullContent,
                  agentId,
                  agentName: agent.name,
                  timestamp: new Date().toISOString(),
                  isComplete: true,
                };

                this.cacheResponse(sessionId, aiResponse);
                onStream?.(fullContent, true);
                onComplete?.(aiResponse);
                this.pendingRequests.delete(sessionId);

                return aiResponse;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 如果到这里还没有结束，也返回结果
      const aiResponse: AIResponse = {
        id: responseId,
        content: fullContent,
        agentId,
        agentName: agent.name,
        timestamp: new Date().toISOString(),
        isComplete: true,
      };

      this.cacheResponse(sessionId, aiResponse);
      onStream?.(fullContent, true);
      onComplete?.(aiResponse);
      this.pendingRequests.delete(sessionId);

      return aiResponse;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // 用户取消，不报错
        throw error;
      }

      console.error('[AIChat] Error:', error);
      throw error;
    }
  }

  /**
   * 缓存响应
   */
  private cacheResponse(sessionId: string, response: AIResponse) {
    const cached = this.messageCache.get(sessionId) || [];
    cached.push(response);
    this.messageCache.set(sessionId, cached);
  }

  /**
   * 获取缓存的响应
   */
  getCachedResponses(sessionId: string): AIResponse[] {
    return this.messageCache.get(sessionId) || [];
  }

  /**
   * 取消待处理请求
   */
  cancelPending(sessionId: string) {
    const controller = this.pendingRequests.get(sessionId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(sessionId);
    }
  }
}

// 导出单例
export const aiChatService = new AIChatService();
export default aiChatService;
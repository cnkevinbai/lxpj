/**
 * 聊天服务 - Gateway WebSocket 版本
 * 
 * 支持两种模式：
 * 1. Gateway WebSocket（推荐，支持完整工具能力）
 * 2. 后端 SSE（备用，仅基础对话）
 */

import gatewayWS, { GatewayMessage, GatewaySession, ToolCall } from './gateway-ws';
import { smartRouter } from './smart-router';

// 消息类型
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  agentId?: string;
  toolCalls?: ToolCall[];
  createdAt: string;
}

// 回调类型
type MessageCallback = (message: ChatMessage) => void;
type StreamCallback = (chunk: string, done: boolean) => void;
type ToolCallback = (toolCall: ToolCall) => void;

class ChatService {
  private useGateway = true; // 优先使用 Gateway
  private sessionMap: Map<string, string> = new Map(); // localSessionId -> gatewaySessionKey
  
  /**
   * 初始化服务
   */
  async init(): Promise<void> {
    if (this.useGateway) {
      try {
        await gatewayWS.connect();
        console.log('[ChatService] 已连接 Gateway');
      } catch (error) {
        console.error('[ChatService] Gateway 连接失败，使用后端 SSE:', error);
        this.useGateway = false;
      }
    }
  }

  /**
   * 发送消息
   */
  async sendMessage(
    sessionId: string,
    content: string,
    options?: {
      agentId?: string;
      onMessage?: MessageCallback;
      onStream?: StreamCallback;
      onTool?: ToolCallback;
    }
  ): Promise<void> {
    if (this.useGateway && gatewayWS.isConnected()) {
      await this.sendViaGateway(sessionId, content, options);
    } else {
      await this.sendViaSSE(sessionId, content, options);
    }
  }

  /**
   * 通过 Gateway 发送
   */
  private async sendViaGateway(
    sessionId: string,
    content: string,
    options?: {
      agentId?: string;
      onMessage?: MessageCallback;
      onStream?: StreamCallback;
      onTool?: ToolCallback;
    }
  ): Promise<void> {
    // 获取或创建 Gateway 会话
    let sessionKey = this.sessionMap.get(sessionId);
    if (!sessionKey) {
      const session = await gatewayWS.createSession(options?.agentId || 'main');
      sessionKey = session.sessionKey;
      this.sessionMap.set(sessionId, sessionKey);
    }

    // 注册回调
    let fullContent = '';
    const unsubscribers: (() => void)[] = [];

    if (options?.onStream) {
      unsubscribers.push(
        gatewayWS.onStream((chunk, done) => {
          fullContent += chunk;
          options.onStream!(fullContent, done);
        })
      );
    }

    if (options?.onTool) {
      unsubscribers.push(gatewayWS.onTool(options.onTool));
    }

    // 发送消息
    const result = await gatewayWS.sendMessage(content, {
      sessionKey,
      agentId: options?.agentId,
    });

    console.log('[ChatService] 发送结果:', result);

    // 清理回调
    unsubscribers.forEach(unsub => unsub());
  }

  /**
   * 通过后端 SSE 发送（备用）
   */
  private async sendViaSSE(
    sessionId: string,
    content: string,
    options?: {
      agentId?: string;
      onMessage?: MessageCallback;
      onStream?: StreamCallback;
      onTool?: ToolCallback;
    }
  ): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const agentId = options?.agentId || 'main';

    try {
      const response = await fetch(`${apiUrl}/stream/ai`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'text/event-stream' 
        },
        body: JSON.stringify({ 
          prompt: content, 
          agentId, 
          sessionId 
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (buffer.trim()) {
            this.processSSEBuffer(buffer, options?.onStream, fullContent);
          }
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
                if (options?.onStream) {
                  options.onStream(fullContent, false);
                }
              }
            } catch (e) {}
          }
        }
      }

      if (options?.onStream) {
        options.onStream(fullContent, true);
      }

    } catch (error) {
      console.error('[ChatService] SSE 发送失败:', error);
      throw error;
    }
  }

  /**
   * 处理 SSE 缓冲区
   */
  private processSSEBuffer(
    buffer: string,
    onStream?: StreamCallback,
    currentContent: string = ''
  ): void {
    const lines = buffer.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk' && data.data?.content && onStream) {
            currentContent += data.data.content;
            onStream(currentContent, false);
          }
        } catch (e) {}
      }
    }
  }

  /**
   * 中止当前运行
   */
  async abort(sessionId: string): Promise<void> {
    const sessionKey = this.sessionMap.get(sessionId);
    if (sessionKey && gatewayWS.isConnected()) {
      await gatewayWS.abort(sessionKey);
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.useGateway && gatewayWS.isConnected();
  }

  /**
   * 获取连接模式
   */
  getMode(): 'gateway' | 'sse' {
    return this.useGateway && gatewayWS.isConnected() ? 'gateway' : 'sse';
  }
}

// 单例导出
export const chatService = new ChatService();
export default chatService;
/**
 * Gateway WebSocket 客户端服务
 * 
 * 功能：
 * 1. 直连 OpenClaw Gateway WebSocket
 * 2. 支持完整工具能力
 * 3. 实时双向通信
 * 4. Agent 智能路由
 */

// Gateway 配置
const GATEWAY_WS_URL = import.meta.env.VITE_GATEWAY_WS_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = import.meta.env.VITE_GATEWAY_TOKEN || '77784ff3d8dec1f92514d785195227cdfda0b15867416fd0';

// 消息类型
export interface GatewayMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

// RPC 请求
interface RpcRequest {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params: any;
}

// RPC 响应
interface RpcResponse {
  jsonrpc: '2.0';
  id: string;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

// 事件类型
interface GatewayEvent {
  type: string;
  data: any;
}

// 会话信息
export interface GatewaySession {
  sessionKey: string;
  label?: string;
  model?: string;
  agentId?: string;
  thinking?: boolean;
  reasoning?: boolean;
}

// 工具调用
export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

// 回调类型
type MessageCallback = (message: GatewayMessage) => void;
type StreamCallback = (chunk: string, done: boolean) => void;
type ToolCallback = (toolCall: ToolCall) => void;
type StatusCallback = (status: 'connected' | 'disconnected' | 'error') => void;

class GatewayWebSocketService {
  private ws: WebSocket | null = null;
  private requestId = 0;
  private pendingRequests: Map<string, { resolve: Function; reject: Function }> = new Map();
  private messageCallbacks: Set<MessageCallback> = new Set();
  private streamCallbacks: Set<StreamCallback> = new Set();
  private toolCallbacks: Set<ToolCallback> = new Set();
  private statusCallbacks: Set<StatusCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentSessionKey: string | null = null;
  
  // 认证 Promise
  private authResolve?: (value: any) => void;
  private authReject?: (reason: any) => void;

  /**
   * 连接 Gateway
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(GATEWAY_WS_URL);

        this.ws.onopen = () => {
          console.log('[GatewayWS] 连接成功，等待认证挑战...');
          this.reconnectAttempts = 0;
          this.notifyStatus('connected');
          
          // 设置认证 Promise
          this.authResolve = resolve;
          this.authReject = reject;
          
          // Gateway 会主动发送 connect.challenge，在 handleEvent 中处理
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          console.log('[GatewayWS] 连接关闭:', event.code, event.reason);
          this.notifyStatus('disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[GatewayWS] 连接错误:', error);
          this.notifyStatus('error');
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送 RPC 调用
   */
  private async call(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `req-${++this.requestId}`;
      
      const request: RpcRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      this.pendingRequests.set(id, { resolve, reject });

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(request));
      } else {
        reject(new Error('WebSocket not connected'));
      }
    });
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const parsed = JSON.parse(data);

      // 事件类型（包含挑战响应）
      if (parsed.type === 'event') {
        this.handleEvent(parsed);
        return;
      }

      // RPC 响应
      if (parsed.jsonrpc === '2.0' && parsed.id) {
        const pending = this.pendingRequests.get(parsed.id);
        if (pending) {
          this.pendingRequests.delete(parsed.id);
          if (parsed.error) {
            pending.reject(parsed.error);
          } else {
            pending.resolve(parsed.result);
          }
        }
        return;
      }

      // 事件（旧格式）
      if (parsed.type) {
        this.handleEvent(parsed as GatewayEvent);
      }

    } catch (error) {
      console.error('[GatewayWS] 解析消息错误:', error);
    }
  }

  /**
   * 处理事件
   */
  private handleEvent(event: GatewayEvent): void {
    const { type, event: eventName, payload } = event as any;
    
    // 处理挑战-响应认证
    if (eventName === 'connect.challenge' || type === 'connect.challenge') {
      console.log('[GatewayWS] 收到认证挑战，发送响应...');
      // 发送挑战响应
      this.call('connect.response', {
        params: {
          challenge: payload?.nonce || payload?.challenge,
          token: GATEWAY_TOKEN,
        },
      }).then((result: any) => {
        console.log('[GatewayWS] 认证成功:', result);
        this.authResolve?.(true);
      }).catch((err: any) => {
        console.error('[GatewayWS] 认证失败:', err);
        this.authReject?.(err);
      });
      return;
    }
    
    const data = payload || (event as any).data;

    switch (type || eventName) {
      case 'chat':
        // 聊天消息
        if (data.role === 'assistant' && data.content) {
          const isPartial = data.partial === true;
          this.messageCallbacks.forEach(cb => {
            cb({
              role: 'assistant',
              content: data.content,
              timestamp: data.timestamp,
            });
          });
          this.streamCallbacks.forEach(cb => {
            cb(data.content, !isPartial);
          });
        }
        break;

      case 'tool_call':
        // 工具调用
        this.toolCallbacks.forEach(cb => {
          cb({
            id: data.id,
            name: data.name,
            arguments: data.arguments,
            status: data.status || 'running',
            result: data.result,
          });
        });
        break;

      case 'tool_result':
        // 工具结果
        this.toolCallbacks.forEach(cb => {
          cb({
            id: data.toolCallId,
            name: data.name,
            arguments: {},
            status: 'completed',
            result: data.result,
          });
        });
        break;

      case 'session.started':
        this.currentSessionKey = data.sessionKey;
        break;

      case 'session.ended':
        if (this.currentSessionKey === data.sessionKey) {
          this.currentSessionKey = null;
        }
        break;

      default:
        console.log('[GatewayWS] 事件:', type || eventName, data);
    }
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[GatewayWS] 重连失败，已达到最大尝试次数');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[GatewayWS] ${delay}ms 后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(err => {
        console.error('[GatewayWS] 重连失败:', err);
      });
    }, delay);
  }

  /**
   * 通知状态变化
   */
  private notifyStatus(status: 'connected' | 'disconnected' | 'error'): void {
    this.statusCallbacks.forEach(cb => cb(status));
  }

  // ========== 公共 API ==========

  /**
   * 获取会话列表
   */
  async getSessions(): Promise<GatewaySession[]> {
    const result = await this.call('sessions.list', {});
    return result.sessions || [];
  }

  /**
   * 创建会话
   */
  async createSession(agentId?: string): Promise<GatewaySession> {
    const result = await this.call('sessions.spawn', {
      runtime: 'subagent',
      agentId: agentId || 'main',
      mode: 'session',
    });
    return result;
  }

  /**
   * 发送消息
   */
  async sendMessage(
    content: string,
    options?: {
      sessionKey?: string;
      agentId?: string;
    }
  ): Promise<{ runId: string; status: string }> {
    const result = await this.call('chat.send', {
      sessionKey: options?.sessionKey || this.currentSessionKey,
      message: content,
      agentId: options?.agentId || 'main',
    });
    return result;
  }

  /**
   * 获取聊天历史
   */
  async getHistory(sessionKey?: string): Promise<GatewayMessage[]> {
    const result = await this.call('chat.history', {
      sessionKey: sessionKey || this.currentSessionKey,
    });
    return result.messages || [];
  }

  /**
   * 中止当前运行
   */
  async abort(sessionKey?: string): Promise<void> {
    await this.call('chat.abort', {
      sessionKey: sessionKey || this.currentSessionKey,
    });
  }

  /**
   * 监听消息
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  /**
   * 监听流式响应
   */
  onStream(callback: StreamCallback): () => void {
    this.streamCallbacks.add(callback);
    return () => this.streamCallbacks.delete(callback);
  }

  /**
   * 监听工具调用
   */
  onTool(callback: ToolCallback): () => void {
    this.toolCallbacks.add(callback);
    return () => this.toolCallbacks.delete(callback);
  }

  /**
   * 监听状态变化
   */
  onStatus(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * 获取当前会话
   */
  getCurrentSession(): string | null {
    return this.currentSessionKey;
  }
}

// 单例导出
export const gatewayWS = new GatewayWebSocketService();
export default gatewayWS;
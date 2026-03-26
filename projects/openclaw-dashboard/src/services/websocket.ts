/**
 * WebSocket 服务 - 实时通信
 */

import { io, Socket } from 'socket.io-client';

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;
type DisconnectionHandler = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentSessionId: string | null = null;

  // Event handlers
  private messageHandlers: Set<MessageHandler> = new Set();
  private typingHandlers: Set<MessageHandler> = new Set();
  private streamHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<DisconnectionHandler> = new Set();
  private metricsHandlers: Set<MessageHandler> = new Set();
  private logHandlers: Set<MessageHandler> = new Set();

  /**
   * 连接 WebSocket
   */
  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

    return new Promise((resolve, reject) => {
      this.socket = io(wsUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.socket.on('connect', () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('[WebSocket] Connected');
        this.connectionHandlers.forEach(handler => handler());
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        this.connected = false;
        console.log('[WebSocket] Disconnected:', reason);
        this.disconnectionHandlers.forEach(handler => handler({ reason }));
      });

      this.socket.on('connect_error', (error) => {
        console.error('[WebSocket] Connection error:', error);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(error);
        }
      });

      // 消息事件
      this.socket.on('message', (data: any) => {
        this.messageHandlers.forEach(handler => handler(data));
      });

      // 打字状态
      this.socket.on('typing', (data: any) => {
        this.typingHandlers.forEach(handler => handler(data));
      });

      // 流式消息事件
      this.socket.on('stream_start', (data: any) => {
        this.streamHandlers.forEach(handler => handler({ type: 'start', ...data }));
      });

      this.socket.on('stream_chunk', (data: any) => {
        this.streamHandlers.forEach(handler => handler({ type: 'chunk', ...data }));
      });

      this.socket.on('stream_end', (data: any) => {
        this.streamHandlers.forEach(handler => handler({ type: 'end', ...data }));
      });

      // 会话关联确认
      this.socket.on('session_associated', (data: any) => {
        console.log('[WebSocket] Session associated:', data);
      });

      // 用户事件
      this.socket.on('user_connected', (data: any) => {
        console.log('[WebSocket] User connected:', data);
      });

      this.socket.on('user_disconnected', (data: any) => {
        console.log('[WebSocket] User disconnected:', data);
      });

      // 系统指标更新
      this.socket.on('metrics_update', (data: any) => {
        this.metricsHandlers.forEach(handler => handler(data));
      });

      // 日志条目
      this.socket.on('log_entry', (data: any) => {
        this.logHandlers.forEach(handler => handler(data));
      });

      // 订阅确认
      this.socket.on('metrics_subscribed', (data: any) => {
        console.log('[WebSocket] Metrics subscribed:', data);
      });

      this.socket.on('logs_subscribed', (data: any) => {
        console.log('[WebSocket] Logs subscribed:', data);
      });
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.currentSessionId = null;
    }
  }

  /**
   * 关联会话
   */
  associateSession(sessionId: string): void {
    if (this.socket && this.connected) {
      this.currentSessionId = sessionId;
      this.socket.emit('associate_session', { sessionId });
    }
  }

  /**
   * 发送聊天消息
   */
  sendChatMessage(content: string, sessionId?: string, agentId?: string): void {
    if (!this.socket || !this.connected) {
      console.warn('[WebSocket] Not connected');
      return;
    }

    const targetSessionId = sessionId || this.currentSessionId;
    if (!targetSessionId) {
      console.warn('[WebSocket] No session associated');
      return;
    }

    this.socket.emit('message', {
      sessionId: targetSessionId,
      content,
      agentId: agentId || 'main',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 发送打字状态
   */
  sendTypingStatus(isTyping: boolean, sessionId?: string): void {
    if (!this.socket || !this.connected) return;

    const targetSessionId = sessionId || this.currentSessionId;
    if (!targetSessionId) return;

    this.socket.emit('typing', {
      sessionId: targetSessionId,
      isTyping,
    });
  }

  /**
   * 注册消息处理器
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * 注册打字状态处理器
   */
  onTyping(handler: MessageHandler): () => void {
    this.typingHandlers.add(handler);
    return () => this.typingHandlers.delete(handler);
  }

  /**
   * 注册流式消息处理器
   */
  onStream(handler: MessageHandler): () => void {
    this.streamHandlers.add(handler);
    return () => this.streamHandlers.delete(handler);
  }

  /**
   * 注册连接处理器
   */
  onConnected(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  /**
   * 注册断开处理器
   */
  onDisconnected(handler: DisconnectionHandler): () => void {
    this.disconnectionHandlers.add(handler);
    return () => this.disconnectionHandlers.delete(handler);
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * 获取当前会话 ID
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * 订阅系统指标
   */
  subscribeMetrics(): void {
    if (this.socket && this.connected) {
      this.socket.emit('subscribe_metrics');
    }
  }

  /**
   * 取消订阅系统指标
   */
  unsubscribeMetrics(): void {
    if (this.socket && this.connected) {
      this.socket.emit('unsubscribe_metrics');
    }
  }

  /**
   * 订阅日志流
   */
  subscribeLogs(options?: { service?: string; level?: string }): void {
    if (this.socket && this.connected) {
      this.socket.emit('subscribe_logs', options || {});
    }
  }

  /**
   * 取消订阅日志流
   */
  unsubscribeLogs(): void {
    if (this.socket && this.connected) {
      this.socket.emit('unsubscribe_logs');
    }
  }

  /**
   * 注册指标处理器
   */
  onMetrics(handler: MessageHandler): () => void {
    this.metricsHandlers.add(handler);
    return () => this.metricsHandlers.delete(handler);
  }

  /**
   * 注册日志处理器
   */
  onLogs(handler: MessageHandler): () => void {
    this.logHandlers.add(handler);
    return () => this.logHandlers.delete(handler);
  }
}

// 导出单例
export const wsService = new WebSocketService();
export default wsService;
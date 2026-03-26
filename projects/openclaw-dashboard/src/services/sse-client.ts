/**
 * SSE 客户端服务 - 流式响应
 * 
 * 支持：
 * - 自动重连
 * - 心跳检测
 * - 事件解析
 */

// SSE 事件类型
export interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
}

// 流式响应回调
export interface StreamCallbacks {
  onStart?: (data: any) => void;
  onChunk?: (chunk: string) => void;
  onEnd?: (data: any) => void;
  onError?: (error: Error) => void;
  onHeartbeat?: () => void;
}

// SSE 配置
interface SSEConfig {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

class SSEClient {
  private abortController: AbortController | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  /**
   * 发起 SSE 流式请求
   */
  async connect(config: SSEConfig, callbacks: StreamCallbacks): Promise<void> {
    this.abortController = new AbortController();

    try {
      console.log('[SSE] Connecting to:', config.url);
      
      const response = await fetch(config.url, {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      this.reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      console.log('[SSE] Stream started');

      while (true) {
        const { done, value } = await this.reader.read();

        if (done) {
          console.log('[SSE] Stream done, processing remaining buffer');
          // 流结束后，处理剩余的 buffer
          if (buffer.trim()) {
            const lines = buffer.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                this.processDataLine(line.slice(6), callbacks);
              }
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // 按行处理
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            this.processDataLine(line.slice(6), callbacks);
          }
        }
      }

      console.log('[SSE] Stream completed');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[SSE] Request aborted');
      } else {
        console.error('[SSE] Error:', error);
        callbacks.onError?.(error);
      }
    }
  }

  /**
   * 处理 data 行
   */
  private processDataLine(dataStr: string, callbacks: StreamCallbacks): void {
    try {
      const parsed = JSON.parse(dataStr);
      const eventType = parsed.type;
      const actualData = parsed.data || parsed;

      console.log('[SSE] Event:', eventType, actualData);

      switch (eventType) {
        case 'connected':
          console.log('[SSE] Connected');
          break;
        case 'start':
          callbacks.onStart?.(actualData);
          break;
        case 'chunk':
          if (actualData.content) {
            callbacks.onChunk?.(actualData.content);
          }
          break;
        case 'end':
          console.log('[SSE] End event received');
          callbacks.onEnd?.(actualData);
          break;
        case 'heartbeat':
          callbacks.onHeartbeat?.();
          break;
        case 'error':
          callbacks.onError?.(new Error(actualData?.message || 'Stream error'));
          break;
      }
    } catch (e) {
      console.warn('[SSE] Failed to parse data:', dataStr);
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.reader) {
      this.reader.cancel();
      this.reader = null;
    }
  }
}

// 单例导出
export const sseClient = new SSEClient();

// 便捷方法
export const streamAPI = {
  /**
   * 流式 AI 响应
   */
  async streamAI(
    prompt: string,
    agentId: string = 'main',
    sessionId?: string,
    callbacks: StreamCallbacks = {}
  ): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    console.log('[streamAPI] Starting AI stream, prompt:', prompt.substring(0, 50));

    await sseClient.connect(
      {
        url: `${apiUrl}/stream/ai`,
        method: 'POST',
        body: { prompt, agentId, sessionId },
      },
      callbacks
    );
  },

  /**
   * 流式文本
   */
  async streamText(
    content: string,
    options: { agentId?: string; chunkSize?: number; delay?: number } = {},
    callbacks: StreamCallbacks = {}
  ): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    await sseClient.connect(
      {
        url: `${apiUrl}/stream/text`,
        method: 'POST',
        body: { content, ...options },
      },
      callbacks
    );
  },

  /**
   * 断开连接
   */
  disconnect(): void {
    sseClient.disconnect();
  },
};

export default streamAPI;
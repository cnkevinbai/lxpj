/**
 * WebSocket Hook
 * 
 * @description WebSocket 连接管理
 * @author daod-team
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WsMessage, WsConnectionState, WsEventType } from '@/types';

interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: WsMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketReturn {
  connected: boolean;
  connectionState: WsConnectionState;
  error: Error | null;
  send: (event: string, data: any) => void;
  subscribe: (event: WsEventType, callback: (data: any) => void) => () => void;
  connect: () => void;
  disconnect: () => void;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    autoConnect = true,
    reconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const reconnectCountRef = useRef(0);
  const subscriptionsRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  const [connected, setConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<WsConnectionState>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  // 连接
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setConnectionState('connecting');

    const socket = io(url, {
      transports: ['websocket'],
      reconnection: false, // 手动控制重连
      auth: {
        token: localStorage.getItem('iov_token'),
      },
    });

    socket.on('connect', () => {
      setConnected(true);
      setConnectionState('connected');
      setError(null);
      reconnectCountRef.current = 0;
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      setConnected(false);
      setConnectionState('disconnected');
      onDisconnect?.();

      // 自动重连
      if (reconnect && reconnectCountRef.current < reconnectAttempts) {
        reconnectCountRef.current++;
        setTimeout(connect, reconnectInterval);
      }
    });

    socket.on('connect_error', (err) => {
      setConnectionState('error');
      setError(err);
      onError?.(err);
    });

    socket.on('message', (data: WsMessage) => {
      // 调用全局消息处理
      onMessage?.(data);

      // 分发到订阅者
      const callbacks = subscriptionsRef.current.get(data.type);
      if (callbacks) {
        callbacks.forEach(cb => cb(data.payload));
      }
    });

    socketRef.current = socket;
  }, [url, reconnect, reconnectAttempts, reconnectInterval, onMessage, onConnect, onDisconnect, onError]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnected(false);
    setConnectionState('disconnected');
  }, []);

  // 发送消息
  const send = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // 订阅事件
  const subscribe = useCallback((event: WsEventType, callback: (data: any) => void) => {
    if (!subscriptionsRef.current.has(event)) {
      subscriptionsRef.current.set(event, new Set());
    }
    subscriptionsRef.current.get(event)!.add(callback);

    // 返回取消订阅函数
    return () => {
      subscriptionsRef.current.get(event)?.delete(callback);
    };
  }, []);

  // 自动连接
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connected,
    connectionState,
    error,
    send,
    subscribe,
    connect,
    disconnect,
  };
}
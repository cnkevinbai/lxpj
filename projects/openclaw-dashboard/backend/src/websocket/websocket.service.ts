import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface TypingEvent {
  sessionId: string;
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

interface MetricsSubscription {
  interval: NodeJS.Timeout;
  clients: Set<string>;
}

// 系统指标获取函数
const getSystemMetrics = () => {
  const used = process.memoryUsage();
  return {
    memory: {
      used: Math.round(used.heapUsed / 1024 / 1024),
      total: Math.round(used.heapTotal / 1024 / 1024),
    },
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
};

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebSocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebSocketService.name);
  private clients: Map<string, { sessionId?: string; userId?: string }> = new Map();
  private metricsSubscriptions: Map<string, MetricsSubscription> = new Map();

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, {});
    
    client.emit('connected', { socketId: client.id, timestamp: Date.now() });
    this.server.emit('user_connected', { socketId: client.id, timestamp: Date.now() });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
    this.server.emit('user_disconnected', { socketId: client.id, timestamp: Date.now() });
    
    // Clean up metrics subscription
    const subscription = this.metricsSubscriptions.get(client.id);
    if (subscription) {
      clearInterval(subscription.interval);
      this.metricsSubscriptions.delete(client.id);
    }
  }

  @SubscribeMessage('associate_session')
  handleAssociateSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId?: string },
  ) {
    this.logger.log(`Client ${client.id} associated with session ${data.sessionId}`);
    this.clients.set(client.id, { sessionId: data.sessionId, userId: data.userId });
    client.emit('session_associated', { sessionId: data.sessionId, socketId: client.id });
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const clientData = this.clients.get(client.id);
    this.server.emit('message', { ...data, timestamp: Date.now(), senderId: client.id });
    
    if (clientData?.sessionId) {
      this.server.to(`session:${clientData.sessionId}`).emit('message', { ...data, timestamp: Date.now() });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: TypingEvent) {
    if (data.sessionId) {
      this.server.to(`session:${data.sessionId}`).emit('typing', { ...data, timestamp: Date.now() });
    }
  }

  @SubscribeMessage('stream_start')
  handleStreamStart(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.server.to(`session:${data.sessionId}`).emit('stream_start', { ...data, timestamp: Date.now() });
  }

  @SubscribeMessage('stream_chunk')
  handleStreamChunk(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.server.to(`session:${data.sessionId}`).emit('stream_chunk', { ...data, timestamp: Date.now() });
  }

  @SubscribeMessage('stream_end')
  handleStreamEnd(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.server.to(`session:${data.sessionId}`).emit('stream_end', { ...data, timestamp: Date.now() });
  }

  @SubscribeMessage('subscribe_metrics')
  handleSubscribeMetrics(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} subscribed to metrics`);
    
    // Send initial metrics
    client.emit('metrics_update', getSystemMetrics());
    
    // Set up periodic updates
    const interval = setInterval(() => {
      client.emit('metrics_update', getSystemMetrics());
    }, 5000);
    
    this.metricsSubscriptions.set(client.id, { interval, clients: new Set([client.id]) });
    client.emit('metrics_subscribed', { success: true });
  }

  @SubscribeMessage('unsubscribe_metrics')
  handleUnsubscribeMetrics(@ConnectedSocket() client: Socket) {
    const subscription = this.metricsSubscriptions.get(client.id);
    if (subscription) {
      clearInterval(subscription.interval);
      this.metricsSubscriptions.delete(client.id);
    }
    client.emit('metrics_unsubscribed', { success: true });
  }

  // Utility methods
  sendMessageToClient(clientId: string, data: any): boolean {
    this.server.to(clientId).emit('message', data);
    return true;
  }

  broadcast(data: any): void {
    this.server.emit('message', data);
  }

  broadcastToSession(sessionId: string, data: any): void {
    this.server.to(`session:${sessionId}`).emit('message', data);
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
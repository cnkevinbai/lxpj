/**
 * WebSocket 网关 - 实时推送
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private clients: Map<string, Socket> = new Map()
  private subscriptions: Map<string, string[]> = new Map()

  /**
   * 客户端连接
   */
  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string
    const userId = this.verifyToken(token)

    if (userId) {
      this.clients.set(userId, client)
      console.log(`Client connected: ${userId}`)
    } else {
      client.disconnect()
    }
  }

  /**
   * 客户端断开
   */
  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.clients.entries()) {
      if (socket === client) {
        this.clients.delete(userId)
        this.subscriptions.delete(userId)
        console.log(`Client disconnected: ${userId}`)
        break
      }
    }
  }

  /**
   * 订阅频道
   */
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { channels: string[] }) {
    const userId = this.getClientUserId(client)
    if (userId) {
      this.subscriptions.set(userId, payload.channels)
      return { success: true }
    }
    return { success: false }
  }

  /**
   * 取消订阅
   */
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { channels: string[] }) {
    const userId = this.getClientUserId(client)
    if (userId) {
      const subs = this.subscriptions.get(userId) || []
      const newSubs = subs.filter(c => !payload.channels.includes(c))
      this.subscriptions.set(userId, newSubs)
      return { success: true }
    }
    return { success: false }
  }

  /**
   * 发送通知
   */
  sendNotification(userId: string, type: string, data: any) {
    const client = this.clients.get(userId)
    if (client) {
      client.emit('notification', { type, data })
    }
  }

  /**
   * 广播消息
   */
  broadcast(channel: string, data: any) {
    for (const [userId, subscriptions] of this.subscriptions.entries()) {
      if (subscriptions.includes(channel)) {
        const client = this.clients.get(userId)
        if (client) {
          client.emit(channel, data)
        }
      }
    }
  }

  /**
   * 发送工单通知
   */
  sendTicketNotification(userId: string, ticket: any) {
    this.sendNotification(userId, 'new_ticket', {
      ticketId: ticket.id,
      ticketNo: ticket.ticketNo,
      type: ticket.type,
      createdAt: ticket.createdAt
    })
  }

  /**
   * 发送审批通知
   */
  sendApprovalNotification(userId: string, approval: any) {
    this.sendNotification(userId, 'new_approval', {
      approvalId: approval.id,
      approvalNo: approval.approvalNo,
      type: approval.type,
      amount: approval.amount,
      createdAt: approval.createdAt
    })
  }

  /**
   * 发送消息通知
   */
  sendMessageNotification(userId: string, message: any) {
    this.sendNotification(userId, 'new_message', {
      messageId: message.id,
      from: message.from,
      content: message.content,
      createdAt: message.createdAt
    })
  }

  /**
   * 获取客户端用户 ID
   */
  private getClientUserId(client: Socket): string | null {
    for (const [userId, socket] of this.clients.entries()) {
      if (socket === client) {
        return userId
      }
    }
    return null
  }

  /**
   * 验证 Token
   */
  private verifyToken(token: string): string | null {
    // TODO: 实现 Token 验证
    if (token) {
      return 'user_' + token.slice(0, 8)
    }
    return null
  }
}

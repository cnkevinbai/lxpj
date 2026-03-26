/**
 * Chat 数据仓库 - 使用 Prisma 数据库
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Session } from './entities/session.entity';
import { Message, MessageType } from './entities/message.entity';
import { ContextCompression } from './entities/context-compression.entity';
import { AgentMemory } from './entities/agent-memory.entity';

@Injectable()
export class ChatRepository {
  private readonly logger = new Logger(ChatRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  // ========== Session 方法 ==========

  /**
   * 创建会话
   */
  async createSession(session: Session): Promise<Session> {
    const created = await this.prisma.session.create({
      data: {
        id: session.id,
        title: session.title || '新对话',
        agentId: session.agentId,
        lastMessageAt: session.lastMessageAt ? new Date(session.lastMessageAt) : null,
      },
    });

    return {
      id: created.id,
      title: created.title,
      agentId: created.agentId || undefined,
      lastMessageAt: created.lastMessageAt?.toISOString(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  /**
   * 根据 ID 查找会话
   */
  async findSessionById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) return null;

    return {
      id: session.id,
      title: session.title,
      agentId: session.agentId || undefined,
      lastMessageAt: session.lastMessageAt?.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  /**
   * 分页查询会话
   */
  async findSessions(page: number = 1, limit: number = 10): Promise<{ sessions: Session[]; total: number }> {
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.session.count(),
    ]);

    return {
      sessions: sessions.map(s => ({
        id: s.id,
        title: s.title,
        agentId: s.agentId || undefined,
        lastMessageAt: s.lastMessageAt?.toISOString(),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
      total,
    };
  }

  /**
   * 更新会话
   */
  async updateSession(id: string, updateData: Partial<Session>): Promise<Session | null> {
    try {
      const updated = await this.prisma.session.update({
        where: { id },
        data: {
          title: updateData.title,
          agentId: updateData.agentId,
          lastMessageAt: updateData.lastMessageAt ? new Date(updateData.lastMessageAt) : undefined,
        },
      });

      return {
        id: updated.id,
        title: updated.title,
        agentId: updated.agentId || undefined,
        lastMessageAt: updated.lastMessageAt?.toISOString(),
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除会话
   */
  async deleteSession(id: string): Promise<boolean> {
    try {
      await this.prisma.session.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 删除会话的所有消息
   */
  async deleteMessagesBySession(sessionId: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { sessionId },
    });
  }

  // ========== Message 方法 ==========

  /**
   * 创建消息
   */
  async createMessage(message: Message): Promise<Message> {
    const created = await this.prisma.message.create({
      data: {
        id: message.id,
        sessionId: message.sessionId,
        role: message.type, // 数据库用 role 存储 type
        content: message.content,
        agentId: message.agentId,
      },
    });

    // 更新会话的 lastMessageAt
    await this.prisma.session.update({
      where: { id: message.sessionId },
      data: { lastMessageAt: new Date() },
    });

    return {
      id: created.id,
      sessionId: created.sessionId,
      type: created.role as MessageType,
      content: created.content,
      agentId: created.agentId || undefined,
      createdAt: created.createdAt.toISOString(),
    };
  }

  /**
   * 分页查询会话消息
   */
  async findMessagesBySession(sessionId: string, page: number = 1, limit: number = 50): Promise<{ messages: Message[]; total: number }> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { sessionId },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where: { sessionId } }),
    ]);

    return {
      messages: messages.map(m => ({
        id: m.id,
        sessionId: m.sessionId,
        type: m.role as MessageType,
        content: m.content,
        agentId: m.agentId || undefined,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
    };
  }

  /**
   * 根据 ID 查找消息
   */
  async findMessageById(sessionId: string, messageId: string): Promise<Message | null> {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, sessionId },
    });

    if (!message) return null;

    return {
      id: message.id,
      sessionId: message.sessionId,
      type: message.role as MessageType,
      content: message.content,
      agentId: message.agentId || undefined,
      createdAt: message.createdAt.toISOString(),
    };
  }

  /**
   * 更新消息
   */
  async updateMessage(sessionId: string, messageId: string, updateData: Partial<Message>): Promise<Message | null> {
    try {
      const updated = await this.prisma.message.update({
        where: { id: messageId },
        data: {
          content: updateData.content,
        },
      });

      return {
        id: updated.id,
        sessionId: updated.sessionId,
        type: updated.role as MessageType,
        content: updated.content,
        agentId: updated.agentId || undefined,
        createdAt: updated.createdAt.toISOString(),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除消息
   */
  async deleteMessage(sessionId: string, messageId: string): Promise<boolean> {
    try {
      await this.prisma.message.delete({
        where: { id: messageId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 搜索消息
   */
  async searchMessages(
    query: string,
    sessionId?: string,
    page = 1,
    limit = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    const skip = (page - 1) * limit;
    const takeLimit = Math.max(1, Math.min(200, limit));
    const where: any = {
      content: {
        contains: query,
        mode: 'insensitive',
      },
    };

    if (sessionId) {
      where.sessionId = sessionId;
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      messages: messages.map(m => ({
        id: m.id,
        sessionId: m.sessionId,
        type: m.role as MessageType,
        content: m.content,
        agentId: m.agentId || undefined,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
    };
  }

  // ========== Context Compression Methods ==========

  /**
   * 创建上下文压缩记录
   */
  async createContextCompression(compression: {
    id: string;
    sessionId: string;
    summary: string;
    startMessageId: string;
    endMessageId: string;
    messageCount: number;
    createdAt: string;
  }): Promise<ContextCompression> {
    const created = await this.prisma.contextCompression.create({
      data: {
        id: compression.id,
        sessionId: compression.sessionId,
        summary: compression.summary,
        startMessageId: compression.startMessageId,
        endMessageId: compression.endMessageId,
        messageCount: compression.messageCount,
        createdAt: new Date(compression.createdAt),
      },
    });

    return {
      id: created.id,
      sessionId: created.sessionId,
      summary: created.summary,
      startMessageId: created.startMessageId,
      endMessageId: created.endMessageId,
      messageCount: created.messageCount,
      createdAt: created.createdAt.toISOString(),
    };
  }

  /**
   * 获取会话的压缩记录
   */
  async getCompressionHistory(sessionId: string): Promise<ContextCompression[]> {
    const compressions = await this.prisma.contextCompression.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });

    return compressions.map(c => ({
      id: c.id,
      sessionId: c.sessionId,
      summary: c.summary,
      startMessageId: c.startMessageId,
      endMessageId: c.endMessageId,
      messageCount: c.messageCount,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  // ========== Agent Memory Methods ==========

  /**
   * 创建 Agent 记忆
   */
  async createAgentMemory(memory: {
    id: string;
    agentId?: string;
    sessionId?: string;
    type: string;
    key: string;
    value: string;
    metadata?: Record<string, any>;
    expiresAt?: string;
    createdAt: string;
  }): Promise<AgentMemory> {
    const created = await this.prisma.agentMemory.create({
      data: {
        id: memory.id,
        agentId: memory.agentId,
        sessionId: memory.sessionId,
        type: memory.type,
        key: memory.key,
        value: memory.value,
        metadata: memory.metadata,
        expiresAt: memory.expiresAt ? new Date(memory.expiresAt) : null,
        createdAt: new Date(memory.createdAt),
      },
    });

    return {
      id: created.id,
      agentId: created.agentId || undefined,
      sessionId: created.sessionId || undefined,
      type: created.type as any,
      key: created.key,
      value: created.value,
      metadata: created.metadata as any,
      expiresAt: created.expiresAt?.toISOString(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  /**
   * 查询 Agent 记忆
   */
  async findAgentMemories(
    agentId?: string,
    sessionId?: string,
    type?: string,
    key?: string,
    search?: string,
    page = 1,
    limit = 20,
  ): Promise<{ memories: AgentMemory[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (agentId) where.agentId = agentId;
    if (sessionId) where.sessionId = sessionId;
    if (type) where.type = type;
    if (key) where.key = key;
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { value: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [memories, total] = await Promise.all([
      this.prisma.agentMemory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.agentMemory.count({ where }),
    ]);

    return {
      memories: memories.map(m => ({
        id: m.id,
        agentId: m.agentId || undefined,
        sessionId: m.sessionId || undefined,
        type: m.type as any,
        key: m.key,
        value: m.value,
        metadata: m.metadata as any,
        expiresAt: m.expiresAt?.toISOString(),
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
      total,
    };
  }

  /**
   * 根据 agentId 和 key 查找记忆
   */
  async findAgentMemory(
    agentId: string,
    key: string,
    sessionId?: string,
  ): Promise<AgentMemory | null> {
    const where: any = { agentId, key };
    if (sessionId) where.sessionId = sessionId;

    const memory = await this.prisma.agentMemory.findFirst({
      where,
    });

    if (!memory) return null;

    return {
      id: memory.id,
      agentId: memory.agentId || undefined,
      sessionId: memory.sessionId || undefined,
      type: memory.type as any,
      key: memory.key,
      value: memory.value,
      metadata: memory.metadata as any,
      expiresAt: memory.expiresAt?.toISOString(),
      createdAt: memory.createdAt.toISOString(),
      updatedAt: memory.updatedAt.toISOString(),
    };
  }

  /**
   * 根据 ID 查找记忆
   */
  async findAgentMemoryById(id: string): Promise<AgentMemory | null> {
    const memory = await this.prisma.agentMemory.findUnique({
      where: { id },
    });

    if (!memory) return null;

    return {
      id: memory.id,
      agentId: memory.agentId || undefined,
      sessionId: memory.sessionId || undefined,
      type: memory.type as any,
      key: memory.key,
      value: memory.value,
      metadata: memory.metadata as any,
      expiresAt: memory.expiresAt?.toISOString(),
      createdAt: memory.createdAt.toISOString(),
      updatedAt: memory.updatedAt.toISOString(),
    };
  }

  /**
   * 更新 Agent 记忆
   */
  async updateAgentMemory(
    id: string,
    updateData: Partial<AgentMemory>,
  ): Promise<AgentMemory | null> {
    try {
      const updated = await this.prisma.agentMemory.update({
        where: { id },
        data: {
          value: updateData.value,
          metadata: updateData.metadata as any,
          expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
        },
      });

      return {
        id: updated.id,
        agentId: updated.agentId || undefined,
        sessionId: updated.sessionId || undefined,
        type: updated.type as any,
        key: updated.key,
        value: updated.value,
        metadata: updated.metadata as any,
        expiresAt: updated.expiresAt?.toISOString(),
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除 Agent 记忆
   */
  async deleteAgentMemory(id: string): Promise<boolean> {
    try {
      await this.prisma.agentMemory.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 删除过期的记忆
   */
  async deleteExpiredMemories(): Promise<number> {
    const result = await this.prisma.agentMemory.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    return result.count;
  }
}
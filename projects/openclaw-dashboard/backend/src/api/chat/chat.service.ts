import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OpenClawService } from '../../cli/openclaw.service';
import { ChatRepository } from './chat.repository';
import { Session } from './entities/session.entity';
import { Message, MessageType } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ContextCompressDto, ContextCompressResponse } from './dto/context-compress.dto';
import { SessionSummaryDto, SessionSummaryResponse } from './dto/session-summary.dto';
import { CreateAgentMemoryDto, QueryAgentMemoryDto, AgentMemoryResponse, AgentMemoryListResponse, MemoryType } from './dto/agent-memory.dto';
import { ContextCompression } from './entities/context-compression.entity';
import { AgentMemory } from './entities/agent-memory.entity';
import { v4 as uuidv4 } from 'uuid';

// Gateway 配置
const GATEWAY_CONFIG = {
  baseUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789',
  token: process.env.OPENCLAW_GATEWAY_TOKEN || '77784ff3d8dec1f92514d785195227cdfda0b15867416fd0',
};

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  
  constructor(
    private readonly openClawService: OpenClawService,
    private readonly chatRepository: ChatRepository,
  ) {}

  // Session CRUD Operations

  async createSession(createDto: CreateSessionDto): Promise<Session> {
    const id = uuidv4();
    const session: Session = {
      id,
      title: createDto.title,
      agentId: createDto.agentId,
      metadata: createDto.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.chatRepository.createSession(session);
    return session;
  }

  async getSessionList(pageQuery: PaginationQueryDto) {
    const page = Number(pageQuery.page) || 1;
    const limit = Number(pageQuery.limit) || 10;
    return this.chatRepository.findSessions(page, limit);
  }

  async getSessionDetail(id: string): Promise<Session | null> {
    const session = await this.chatRepository.findSessionById(id);
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async updateSessionTitle(id: string, updateDto: UpdateSessionDto): Promise<Session | null> {
    const session = await this.chatRepository.findSessionById(id);
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    const updated = await this.chatRepository.updateSession(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Failed to update session ${id}`);
    }
    
    return updated;
  }

  async deleteSession(id: string): Promise<{ success: boolean; sessionId: string }> {
    const exists = await this.chatRepository.findSessionById(id);
    if (!exists) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    await this.chatRepository.deleteSession(id);
    await this.chatRepository.deleteMessagesBySession(id);
    
    return { success: true, sessionId: id };
  }

  // Message CRUD Operations

  async createMessage(createDto: CreateMessageDto): Promise<Message> {
    // First verify session exists
    const sessionId = createDto.sessionId || '';
    if (!sessionId) {
      throw new NotFoundException('Session ID is required');
    }
    
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const id = uuidv4();
    const message: Message = {
      id,
      sessionId: sessionId,
      content: createDto.content,
      type: createDto.agentId ? MessageType.AGENT : MessageType.USER,
      agentId: createDto.agentId,
      createdAt: new Date().toISOString(),
    };

    await this.chatRepository.createMessage(message);
    return message;
  }

  async getMessagesBySession(
    sessionId: string,
    pageQuery: PaginationQueryDto,
  ): Promise<{ messages: Message[]; total: number }> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const page = Number(pageQuery.page) || 1;
    const limit = Number(pageQuery.limit) || 50;
    return this.chatRepository.findMessagesBySession(sessionId, page, limit);
  }

  async getMessageById(sessionId: string, messageId: string): Promise<Message | null> {
    const message = await this.chatRepository.findMessageById(sessionId, messageId);
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  async updateMessage(
    sessionId: string,
    messageId: string,
    updateDto: UpdateMessageDto,
  ): Promise<Message | null> {
    const existing = await this.chatRepository.findMessageById(sessionId, messageId);
    if (!existing) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    const updated = await this.chatRepository.updateMessage(sessionId, messageId, updateDto);
    if (!updated) {
      throw new NotFoundException(`Failed to update message ${messageId}`);
    }

    return updated;
  }

  async deleteMessage(sessionId: string, messageId: string): Promise<{ success: boolean; messageId: string }> {
    const exists = await this.chatRepository.findMessageById(sessionId, messageId);
    if (!exists) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    const deleted = await this.chatRepository.deleteMessage(sessionId, messageId);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete message ${messageId}`);
    }

    return { success: true, messageId };
  }

  // Legacy methods (for backward compatibility)

  async sendMessage(message: { content: string; sessionId?: string; agentId?: string }) {
    if (!message.sessionId) {
      // Create a new session if none provided
      const session: Session = {
        id: uuidv4(),
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        agentId: message.agentId,
      };
      await this.chatRepository.createSession(session);
      message.sessionId = session.id;
    }

    return this.createMessage({
      content: message.content,
      sessionId: message.sessionId,
      agentId: message.agentId,
    });
  }

  async getSessionListLegacy() {
    const result = await this.chatRepository.findSessions(1, 100);
    return result.sessions;
  }

  async getSessionDetailLegacy(id: string) {
    return this.getSessionDetail(id);
  }

  async deleteSessionLegacy(id: string) {
    return this.deleteSession(id);
  }

  // Search messages
  async searchMessages(
    query: string,
    sessionId?: string,
    pageQuery?: PaginationQueryDto,
  ) {
    return this.chatRepository.searchMessages(
      query,
      sessionId,
      pageQuery?.page,
      pageQuery?.limit,
    );
  }

  // ========== Context Compression ==========

  /**
   * 压缩上下文历史
   * 当消息数量超过阈值时，自动压缩早期消息
   */
  async compressContext(
    sessionId: string,
    compressDto?: ContextCompressDto,
  ): Promise<ContextCompressResponse> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const { keepLatest = 5, summaryPrompt } = compressDto || {};

    // 获取会话的所有消息
    const messagesResult = await this.chatRepository.findMessagesBySession(
      sessionId,
      1,
      1000, // 获取所有消息
    );

    const messages = messagesResult.messages;
    if (messages.length <= keepLatest) {
      return {
        success: true,
        compressedCount: 0,
        message: 'Message count is below threshold, no compression needed',
      };
    }

    // 分割消息：需要压缩的早期消息和保留的最新消息
    const messagesToCompress = messages.slice(0, messages.length - keepLatest);
    const messagesToKeep = messages.slice(messages.length - keepLatest);

    if (messagesToCompress.length === 0) {
      return {
        success: true,
        compressedCount: 0,
        message: 'No messages to compress',
      };
    }

    // 生成摘要
    const summary = await this.generateSummaryFromMessages(
      messagesToCompress,
      summaryPrompt,
    );

    // 创建上下文压缩记录
    const compressionId = uuidv4();
    await this.chatRepository.createContextCompression({
      id: compressionId,
      sessionId,
      summary,
      startMessageId: messagesToCompress[0].id,
      endMessageId: messagesToCompress[messagesToCompress.length - 1].id,
      messageCount: messagesToCompress.length,
      createdAt: new Date().toISOString(),
    });

    // 将摘要作为一条特殊消息插入
    const summaryMessageId = uuidv4();
    await this.chatRepository.createMessage({
      id: summaryMessageId,
      sessionId,
      content: `[Context Compressed: ${summary}]`,
      type: MessageType.SYSTEM,
      createdAt: new Date().toISOString(),
    });

    // 删除已压缩的消息
    for (const msg of messagesToCompress) {
      if (msg.id !== summaryMessageId) {
        await this.chatRepository.deleteMessage(sessionId, msg.id);
      }
    }

    return {
      success: true,
      compressedCount: messagesToCompress.length,
      newSummaryId: summaryMessageId,
      message: `Compressed ${messagesToCompress.length} messages into summary`,
    };
  }

  /**
   * 自动压缩上下文（当消息数超过阈值时）
   * 默认阈值为50条消息
   */
  async autoCompressContext(sessionId: string, threshold: number = 50): Promise<ContextCompressResponse | null> {
    const messagesResult = await this.chatRepository.findMessagesBySession(sessionId, 1, threshold + 10);
    
    if (messagesResult.messages.length <= threshold) {
      return null; // 不需要压缩
    }

    const currentCount = messagesResult.total;
    if (currentCount > threshold) {
      return this.compressContext(sessionId, {
        keepLatest: 5, // 保留最近5条
      });
    }

    return null;
  }

  /**
   * 从消息列表生成摘要
   */
  private async generateSummaryFromMessages(
    messages: Message[],
    customPrompt?: string,
  ): Promise<string> {
    // 构建消息文本
    const messageTexts = messages.map(m => 
      `${m.type === MessageType.USER ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n---\n\n');

    const defaultPrompt = `
You are an expert at summarizing conversation history. 
Please analyze the following conversation and create a concise summary that captures:
1. The main topics discussed
2. Key decisions made
3. Any pending tasks or follow-ups
4. Important context or background information

Format the summary as a concise paragraph (2-3 sentences).

Conversation history:
${messageTexts}

Summary:
`.trim();

    const prompt = customPrompt || defaultPrompt;

    try {
      // 使用 OpenClaw AI 服务生成摘要
      const result = await this.openClawService.execute(`openclaw chat "${prompt}" --no-history`);
      return result.stdout ? result.stdout.trim() : 'No summary available';
    } catch (error) {
      // 如果 AI 服务不可用，返回简单的统计摘要
      const uniqueTopics = new Set(messages.map(m => this.extractTopics(m.content)));
      return `This conversation covered ${uniqueTopics.size} topics and contained ${messages.length} messages.`;
    }
  }

  /**
   * 从消息中提取主题关键词
   */
  private extractTopics(content: string): string {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
      'ought', 'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
      'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose',
      'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
      'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
      'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now',
      'here', 'there', 'then', 'once', 'if', 'because', 'while', 'until',
      'before', 'after', 'above', 'below', 'between', 'under', 'again',
      'further', 'any', 'about', 'into', 'over', 'after', ' debated',
      'discussed', ' decided', ' agreed', ' planned', ' worked', ' made',
      ' created', ' developed', ' implemented', ' tested', ' debugged',
      ' fixed', ' added', ' removed', ' updated', ' changed', ' improved',
    ]);

    const words = content.toLowerCase().match(/[a-z]{3,}/g) || [];
    const wordCounts = new Map<string, number>();

    for (const word of words) {
      if (!commonWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }

    const sortedWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    return sortedWords.join(', ');
  }

  // ========== Session Summary ==========

  /**
   * 生成会话摘要
   * 在用户离开会话时调用
   */
  async generateSessionSummary(
    sessionId: string,
    summaryDto?: SessionSummaryDto,
  ): Promise<SessionSummaryResponse> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // 获取会话的所有消息
    const messagesResult = await this.chatRepository.findMessagesBySession(
      sessionId,
      1,
      1000,
    );

    const messages = messagesResult.messages;
    if (messages.length === 0) {
      return {
        success: true,
        sessionId,
        summary: {
          mainTopics: [],
          keyDecisions: [],
          pendingTasks: [],
          summaryText: '这是一个空会话，还没有消息。',
        },
      };
    }

    // 构建摘要提示
    const conversationPart = messages.map(m => 
      `${m.type === 'user' ? '用户' : '助手'}: ${m.content}`
    ).slice(-30).join('\n');

    const prompt = `请分析以下对话并生成结构化摘要。

对话内容：
${conversationPart}

请严格按照以下 JSON 格式输出（不要有其他文字）：
{
  "mainTopics": ["话题1", "话题2"],
  "keyDecisions": ["决策1"],
  "pendingTasks": ["待办1"],
  "summaryText": "一句话总结"
}`;

    try {
      // 直接调用 Gateway API
      const response = await fetch(`${GATEWAY_CONFIG.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_CONFIG.token}`,
        },
        body: JSON.stringify({
          model: 'glm-5',
          messages: [
            { role: 'system', content: '你是一个专业的对话摘要助手。请严格按 JSON 格式输出。' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gateway API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const output = data.choices?.[0]?.message?.content || '';
      
      this.logger.log('[Summary] AI response:', output.slice(0, 200));

      // 解析 JSON
      let summary: {
        mainTopics: string[];
        keyDecisions: string[];
        pendingTasks: string[];
        summaryText: string;
      };

      try {
        // 尝试提取 JSON
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          summary = JSON.parse(jsonMatch[0]);
        } else {
          // 如果没有 JSON，使用文本
          summary = {
            mainTopics: [],
            keyDecisions: [],
            pendingTasks: [],
            summaryText: output.slice(0, 200),
          };
        }
      } catch (e) {
        // 解析失败
        summary = {
          mainTopics: [],
          keyDecisions: [],
          pendingTasks: [],
          summaryText: output.slice(0, 200) || '摘要生成中...',
        };
      }

      // 更新会话摘要
      await this.chatRepository.updateSession(sessionId, { 
        summary: summary.summaryText || JSON.stringify(summary) 
      });

      return {
        success: true,
        sessionId,
        summary,
      };
    } catch (error: any) {
      this.logger.error('[Summary] Failed:', error.message);
      
      // 回退方案：简单摘要
      const fallbackSummary = {
        mainTopics: [],
        keyDecisions: [],
        pendingTasks: [],
        summaryText: `会话共 ${messages.length} 条消息。${messages[0]?.content?.slice(0, 50) || ''}...`,
      };
      
      return {
        success: true,
        sessionId,
        summary: fallbackSummary,
      };
    }
  }

  // ========== Agent Memory ==========

  /**
   * 创建 Agent 记忆
   */
  async createAgentMemory(
    memoryDto: CreateAgentMemoryDto,
  ): Promise<AgentMemoryResponse> {
    const memoryId = uuidv4();

    const created = await this.chatRepository.createAgentMemory({
      id: memoryId,
      agentId: memoryDto.agentId,
      sessionId: memoryDto.sessionId,
      type: memoryDto.type,
      key: memoryDto.key,
      value: memoryDto.value,
      metadata: memoryDto.metadata,
      expiresAt: memoryDto.expiresAt?.toISOString(),
      createdAt: new Date().toISOString(),
    });

    return {
      id: created.id,
      agentId: created.agentId,
      sessionId: created.sessionId,
      type: created.type,
      key: created.key,
      value: created.value,
      metadata: created.metadata as any,
      expiresAt: created.expiresAt,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  /**
   * 查询 Agent 记忆
   */
  async queryAgentMemory(
    queryDto: QueryAgentMemoryDto,
    pageQuery?: PaginationQueryDto,
  ): Promise<AgentMemoryListResponse> {
    const page = Number(pageQuery?.page) || 1;
    const limit = Number(pageQuery?.limit) || 20;
    const skip = (page - 1) * limit;

    const result = await this.chatRepository.findAgentMemories(
      queryDto.agentId,
      queryDto.sessionId,
      queryDto.type,
      queryDto.key,
      queryDto.search,
      page,
      limit,
    );

    return {
      memories: result.memories.map(m => ({
        id: m.id,
        agentId: m.agentId,
        sessionId: m.sessionId,
        type: m.type,
        key: m.key,
        value: m.value,
        metadata: m.metadata as any,
        expiresAt: m.expiresAt,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      total: result.total,
      page,
      limit,
    };
  }

  /**
   * 获取Agent的特定记忆
   */
  async getAgentMemory(
    agentId: string,
    key: string,
    sessionId?: string,
  ): Promise<AgentMemoryResponse | null> {
    const memory = await this.chatRepository.findAgentMemory(agentId, key, sessionId);
    if (!memory) return null;

    return {
      id: memory.id,
      agentId: memory.agentId,
      sessionId: memory.sessionId,
      type: memory.type,
      key: memory.key,
      value: memory.value,
      metadata: memory.metadata as any,
      expiresAt: memory.expiresAt,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  }

  /**
   * 更新 Agent 记忆
   */
  async updateAgentMemory(
    id: string,
    updateData: Partial<AgentMemory>,
  ): Promise<AgentMemoryResponse | null> {
    const existing = await this.chatRepository.findAgentMemoryById(id);
    if (!existing) return null;

    const updated = await this.chatRepository.updateAgentMemory(id, updateData);
    if (!updated) return null;

    return {
      id: updated.id,
      agentId: updated.agentId,
      sessionId: updated.sessionId,
      type: updated.type,
      key: updated.key,
      value: updated.value,
      metadata: updated.metadata as any,
      expiresAt: updated.expiresAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * 删除 Agent 记忆
   */
  async deleteAgentMemory(id: string): Promise<boolean> {
    return this.chatRepository.deleteAgentMemory(id);
  }

  /**
   * 删除过期的 Agent 记忆
   */
  async cleanupExpiredMemories(): Promise<{ deleted: number }> {
    const result = await this.chatRepository.deleteExpiredMemories();
    return { deleted: result };
  }
}

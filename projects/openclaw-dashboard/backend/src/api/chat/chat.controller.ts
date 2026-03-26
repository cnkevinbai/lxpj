import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ContextCompressDto, ContextCompressResponse } from './dto/context-compress.dto';
import { SessionSummaryDto, SessionSummaryResponse } from './dto/session-summary.dto';
import { CreateAgentMemoryDto, QueryAgentMemoryDto, AgentMemoryResponse } from './dto/agent-memory.dto';

@Controller('chat/sessions')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ========== Session Management ==========

  @Get()
  async getSessions(@Query() pageQuery: PaginationQueryDto) {
    return this.chatService.getSessionList(pageQuery);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createSession(@Body() createDto: CreateSessionDto) {
    return this.chatService.createSession(createDto);
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.chatService.getSessionDetail(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateSession(
    @Param('id') id: string,
    @Body() updateDto: UpdateSessionDto,
  ) {
    return this.chatService.updateSessionTitle(id, updateDto);
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    return this.chatService.deleteSession(id);
  }

  // ========== Message Operations ==========

  @Get(':id/messages')
  async getMessages(
    @Param('id') sessionId: string,
    @Query() pageQuery: PaginationQueryDto,
  ) {
    return this.chatService.getMessagesBySession(sessionId, pageQuery);
  }

  @Post(':id/messages')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async sendMessage(
    @Param('id') sessionId: string,
    @Body() createDto: CreateMessageDto,
  ) {
    return this.chatService.createMessage({
      ...createDto,
      sessionId,
    });
  }

  @Delete(':sessionId/messages/:messageId')
  async deleteMessage(
    @Param('sessionId') sessionId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.chatService.deleteMessage(sessionId, messageId);
  }

  // ========== Search Operations ==========

  @Get('search')
  async searchMessages(
    @Query('q') query: string,
    @Query('sessionId') sessionId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageQuery = { page, limit };
    return this.chatService.searchMessages(query, sessionId, pageQuery);
  }

  // ========== Context Compression ==========

  @Post(':id/compress')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async compressContext(
    @Param('id') id: string,
    @Body() compressDto?: ContextCompressDto,
  ): Promise<ContextCompressResponse> {
    return this.chatService.compressContext(id, compressDto);
  }

  @Post(':id/auto-compress')
  async autoCompressContext(
    @Param('id') id: string,
    @Query('threshold') threshold?: number,
  ): Promise<ContextCompressResponse | null> {
    return this.chatService.autoCompressContext(id, threshold);
  }

  // ========== Session Summary ==========

  @Post(':id/summary')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async generateSummary(
    @Param('id') id: string,
    @Body() summaryDto?: SessionSummaryDto,
  ): Promise<SessionSummaryResponse> {
    return this.chatService.generateSessionSummary(id, summaryDto);
  }

  // ========== Agent Memory ==========

  @Get('memories')
  async queryMemories(
    @Query() queryDto: QueryAgentMemoryDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageQuery = { page, limit };
    return this.chatService.queryAgentMemory(queryDto, pageQuery);
  }

  @Post('memories')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createMemory(@Body() memoryDto: CreateAgentMemoryDto): Promise<AgentMemoryResponse> {
    return this.chatService.createAgentMemory(memoryDto);
  }

  @Get('memories/:id')
  async getMemory(@Param('id') id: string): Promise<AgentMemoryResponse | null> {
    // This needs agentId and key as query params
    // In practice, you'd want to add agentId and key to the route
    throw new Error('Use /agents/:agentId/memories/:key endpoint instead');
  }

  @Patch('memories/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMemory(
    @Param('id') id: string,
    @Body() updateData: Partial<AgentMemoryResponse>,
  ): Promise<AgentMemoryResponse | null> {
    return this.chatService.updateAgentMemory(id, updateData);
  }

  @Delete('memories/:id')
  async deleteMemory(@Param('id') id: string): Promise<boolean> {
    return this.chatService.deleteAgentMemory(id);
  }

  @Post('memories/cleanup')
  async cleanupExpiredMemories() {
    return this.chatService.cleanupExpiredMemories();
  }
}
import { Controller, Get, Post, Body, Param, Query, Delete, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { ChatService } from '../chat/chat.service';
import { CreateAgentMemoryDto, QueryAgentMemoryDto } from '../chat/dto/agent-memory.dto';

interface AgentSwitchRequest {
  agentId: string;
}

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  async getAgents() {
    return this.agentsService.getAgentList();
  }

  @Post('switch')
  async switchAgent(@Body() request: AgentSwitchRequest) {
    return this.agentsService.switchAgent(request.agentId);
  }

  // ========== Agent Memory APIs ==========

  @Get(':agentId/memories')
  async getMemories(
    @Param('agentId') agentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    const queryDto: QueryAgentMemoryDto = { 
      agentId, 
      type: type as any, 
      sessionId 
    };
    const pageQuery = { page: page || 1, limit: limit || 20 };
    return this.chatService.queryAgentMemory(queryDto, pageQuery);
  }

  @Post(':agentId/memories')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createMemory(
    @Param('agentId') agentId: string,
    @Body() memoryDto: CreateAgentMemoryDto,
  ) {
    // 确保 agentId 一致
    return this.chatService.createAgentMemory({
      ...memoryDto,
      agentId,
    });
  }

  @Get(':agentId/memories/:memoryId')
  async getMemory(
    @Param('agentId') agentId: string,
    @Param('memoryId') memoryId: string,
  ) {
    // 通过 ID 获取记忆
    const memories = await this.chatService.queryAgentMemory(
      { agentId },
      { page: 1, limit: 100 },
    );
    const memory = memories.memories.find((m: any) => m.id === memoryId);
    return memory || null;
  }

  @Patch(':agentId/memories/:memoryId')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateMemory(
    @Param('agentId') agentId: string,
    @Param('memoryId') memoryId: string,
    @Body() updateData: any,
  ) {
    return this.chatService.updateAgentMemory(memoryId, updateData);
  }

  @Delete(':agentId/memories/:memoryId')
  async deleteMemory(
    @Param('agentId') agentId: string,
    @Param('memoryId') memoryId: string,
  ) {
    const deleted = await this.chatService.deleteAgentMemory(memoryId);
    return { success: deleted };
  }

  @Get(':agentId/memories/search')
  async searchMemories(
    @Param('agentId') agentId: string,
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // 搜索记忆 - 在 content 中匹配
    const result = await this.chatService.queryAgentMemory(
      { agentId },
      { page: page || 1, limit: limit || 20 },
    );
    
    if (!query) {
      return result;
    }
    
    const filtered = result.memories.filter((m: any) => 
      m.content?.toLowerCase().includes(query.toLowerCase()) ||
      m.key?.toLowerCase().includes(query.toLowerCase()),
    );
    
    return {
      ...result,
      memories: filtered,
      total: filtered.length,
    };
  }
}
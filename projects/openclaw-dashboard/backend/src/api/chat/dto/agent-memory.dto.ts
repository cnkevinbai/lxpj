import { IsString, IsOptional, IsEnum, IsObject, IsDate } from 'class-validator';

export enum MemoryType {
  SHORT_TERM = 'short-term',
  LONG_TERM = 'long-term',
  PREFERENCE = 'preference',
}

/**
 * 创建Agent记忆请求Dto
 */
export class CreateAgentMemoryDto {
  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsEnum(MemoryType)
  type: MemoryType;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}

/**
 * 查询Agent记忆请求Dto
 */
export class QueryAgentMemoryDto {
  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsEnum(MemoryType)
  type?: MemoryType;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  search?: string; // 模糊搜索关键词
}

/**
 * Agent记忆响应Dto
 */
export interface AgentMemoryResponse {
  id: string;
  agentId?: string;
  sessionId?: string;
  type: MemoryType;
  key: string;
  value: string;
  metadata?: any; // Use 'any' to handle Prisma JsonValue
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 批量查询结果
 */
export interface AgentMemoryListResponse {
  memories: AgentMemoryResponse[];
  total: number;
  page: number;
  limit: number;
}

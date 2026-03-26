/**
 * Agent记忆实体
 */
export enum MemoryType {
  SHORT_TERM = 'short-term',
  LONG_TERM = 'long-term',
  PREFERENCE = 'preference',
}

export interface AgentMemory {
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

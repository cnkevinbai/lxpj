export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  agentId?: string;
  metadata?: Record<string, any>;
  summary?: string; // 会话摘要
}

export enum MessageType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
}

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  type: MessageType;
  agentId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

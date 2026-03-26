/**
 * 上下文压缩记录实体
 */
export interface ContextCompression {
  id: string;
  sessionId: string;
  summary: string;
  startMessageId: string;
  endMessageId: string;
  messageCount: number;
  createdAt: string;
}

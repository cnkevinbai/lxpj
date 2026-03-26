import { IsString, IsOptional } from 'class-validator';

/**
 * 生成会话摘要请求Dto
 */
export class SessionSummaryDto {
  @IsOptional()
  @IsString()
  prompt?: string; // 自定义摘要提示

  @IsOptional()
  @IsString()
  format?: 'text' | 'json'; // 输出格式
}

/**
 * 会话摘要响应Dto
 */
export class SessionSummaryResponse {
  success: boolean;
  sessionId: string;
  summary: {
    mainTopics: string[]; // 主要话题
    keyDecisions: string[]; // 关键决策
    pendingTasks: string[]; // 待办事项
    summaryText: string; // 摘要文本
  };
}

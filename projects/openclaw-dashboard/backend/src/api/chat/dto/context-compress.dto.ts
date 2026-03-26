import { IsString, IsOptional, IsNumber } from 'class-validator';

/**
 * 压缩上下文请求Dto
 */
export class ContextCompressDto {
  @IsOptional()
  @IsNumber()
  keepLatest?: number; // 保留最近N条消息，默认5条

  @IsOptional()
  @IsString()
  summaryPrompt?: string; // 自定义摘要提示
}

/**
 * 压缩上下文响应Dto
 */
export class ContextCompressResponse {
  success: boolean;
  compressedCount: number; // 压缩的消息数量
  newSummaryId?: string; // 新生成的摘要消息ID
  message: string;
}

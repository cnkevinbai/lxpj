import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

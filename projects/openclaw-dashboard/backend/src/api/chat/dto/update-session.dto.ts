import { IsOptional, IsString } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

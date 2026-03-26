import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class GetLogsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly tail?: number = 100;

  @IsOptional()
  @IsString()
  readonly grep?: string;

  @IsOptional()
  @IsString()
  readonly level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

  @IsOptional()
  @IsString()
  readonly service?: string;
}

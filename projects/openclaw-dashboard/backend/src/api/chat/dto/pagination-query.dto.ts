import { IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Min(1)
  limit?: number = 10;
}

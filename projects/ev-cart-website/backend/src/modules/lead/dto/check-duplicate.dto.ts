import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator'

/**
 * 查重请求 DTO
 */
export class CheckDuplicateDto {
  @IsString()
  phone?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  companyName?: string

  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  days?: number = 30
}

/**
 * 查重结果 DTO
 */
export class DuplicateCheckResult {
  isDuplicate: boolean
  count: number
  score: number
  existingRecords: Array<{
    id: string
    name: string
    phone: string
    email?: string
    companyName?: string
    status: string
    createdAt: Date
    ownerId?: string
    ownerName?: string
    matchFields: string[]
    matchScore: number
  }>
  suggestion: 'create' | 'merge' | 'link'
}

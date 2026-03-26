import { IsString, IsUrl, IsOptional, IsArray, IsBoolean } from 'class-validator'

export class CreateWebhookDto {
  @IsString()
  name: string

  @IsUrl()
  url: string

  @IsString()
  @IsOptional()
  secret?: string

  @IsArray()
  @IsString({ each: true })
  events: string[]

  @IsBoolean()
  @IsOptional()
  enabled?: boolean
}

export class UpdateWebhookDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsUrl()
  @IsOptional()
  url?: string

  @IsString()
  @IsOptional()
  secret?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  events?: string[]

  @IsBoolean()
  @IsOptional()
  enabled?: boolean
}

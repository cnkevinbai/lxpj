# NestJS API 开发技能

## 📋 技能说明

开发 RESTful API 接口，遵循 NestJS 最佳实践和代码规范。

---

## 🎯 适用场景

- 创建新的 API 接口
- 开发 CRUD 操作
- 实现业务逻辑
- API 接口重构

---

## 📝 标准结构

### Controller

```typescript
/**
 * FeatureController - 功能模块控制器
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { FeatureService } from './feature.service'
import { CreateFeatureDto, UpdateFeatureDto, QueryFeatureDto } from './dto'

@ApiTags('feature')
@Controller('feature')
@UseGuards(JwtAuthGuard)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  @ApiOperation({ summary: '获取列表' })
  @ApiResponse({ status: 200, description: '成功' })
  async findAll(@Query() query: QueryFeatureDto) {
    return this.featureService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取详情' })
  async findOne(@Param('id') id: string) {
    return this.featureService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: '创建' })
  async create(@Body() dto: CreateFeatureDto, @Request() req) {
    return this.featureService.create(dto, req.user.id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新' })
  async update(@Param('id') id: string, @Body() dto: UpdateFeatureDto) {
    return this.featureService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  async remove(@Param('id') id: string) {
    return this.featureService.remove(id)
  }
}
```

### Service

```typescript
/**
 * FeatureService - 功能模块服务
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateFeatureDto, UpdateFeatureDto, QueryFeatureDto } from './dto'

@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 分页查询
   */
  async findAll(query: QueryFeatureDto) {
    const { page = 1, limit = 10, keyword } = query
    
    const where = keyword ? {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } }
      ]
    } : {}

    const [items, total] = await Promise.all([
      this.prisma.feature.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.feature.count({ where })
    ])

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * 获取详情
   */
  async findOne(id: string) {
    const item = await this.prisma.feature.findUnique({
      where: { id },
      include: { 
        // 关联查询
      }
    })

    if (!item) {
      throw new NotFoundException('记录不存在')
    }

    return item
  }

  /**
   * 创建
   */
  async create(dto: CreateFeatureDto, userId: string) {
    // 检查唯一性
    const existing = await this.prisma.feature.findFirst({
      where: { name: dto.name }
    })

    if (existing) {
      throw new ConflictException('名称已存在')
    }

    return this.prisma.feature.create({
      data: {
        ...dto,
        createdBy: userId
      }
    })
  }

  /**
   * 更新
   */
  async update(id: string, dto: UpdateFeatureDto) {
    await this.findOne(id) // 检查是否存在

    return this.prisma.feature.update({
      where: { id },
      data: dto
    })
  }

  /**
   * 删除
   */
  async remove(id: string) {
    await this.findOne(id) // 检查是否存在

    await this.prisma.feature.delete({ where: { id } })
    return { deleted: true }
  }
}
```

### DTO

```typescript
// create-feature.dto.ts
import { IsString, IsOptional, IsNumber, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateFeatureDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string
}

// update-feature.dto.ts
import { PartialType } from '@nestjs/swagger'
import { CreateFeatureDto } from './create-feature.dto'

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}

// query-feature.dto.ts
export class QueryFeatureDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10

  @ApiPropertyOptional({ description: '关键词' })
  @IsOptional()
  @IsString()
  keyword?: string
}
```

---

## ✅ 检查清单

开发 API 时确保：

- [ ] Controller 路由正确
- [ ] DTO 有验证装饰器
- [ ] Service 有错误处理
- [ ] 分页查询有性能优化
- [ ] 有 Swagger 文档
- [ ] 有权限控制
- [ ] 返回格式统一

---

## 🔧 统一响应格式

```typescript
// 成功响应
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "timestamp": 1710579600000
}

// 分页响应
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}

// 错误响应
{
  "code": 40001,
  "message": "记录不存在",
  "timestamp": 1710579600000
}
```

---

## 📚 相关技能

- `prisma-orm` - Prisma 数据库操作
- `auth-security` - 认证授权
- `api-design` - API 设计规范
- `testing-backend` - 后端测试
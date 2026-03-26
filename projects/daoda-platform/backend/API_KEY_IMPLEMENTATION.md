# API Key 认证和频率限制实现文档

## 实现概述

已成功实现 API Key 认证和频率限制功能，包括：

1. **API Key 数据模型** - Prisma Schema
2. **API Key 服务** - 完整的 CRUD 操作和安全验证
3. **API Key 守卫** - HTTP 请求认证中间件
4. **频率限制服务** - 基于 Redis 的分布式限流
5. **公有 API 控制器** - 使用 API Key 保护的示例

---

## 实现详情

### 1. API Key 数据模型 (`prisma/schema.prisma`)

```prisma
model ApiKey {
  id          String   @id @default(uuid())
  name        String                              // API Key 名称
  key         String   @unique                    // API Key (加密存储)
  keyPrefix   String   @map("key_prefix")         // Key 前缀 (用于识别)
  permissions String[]                            // 权限列表
  rateLimit   Int      @default(1000) @map("rate_limit")  // 每小时限制
  enabled     Boolean  @default(true)
  expireAt    DateTime? @map("expire_at")
  lastUsedAt  DateTime? @map("last_used_at")
  tenantId    String   @map("tenant_id")
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@index([keyPrefix])
  @@map("api_keys")
}
```

### 2. API Key 模块 (`src/modules/api-key/`)

#### 2.1 DTO (`api-key.dto.ts`)

- `CreateApiKeyDto` - 创建 API Key 的请求体
- `UpdateApiKeyDto` - 更新 API Key 的请求体
- `ApiKeyQueryDto` - 查询 API Key 的参数

#### 2.2 服务 (`api-key.service.ts`)

核心功能：
- `generateKey()` - 生成 API Key (格式: `dk_<随机字符串>`)
- `hashKey(key)` - SHA-256 哈希加密存储
- `validateKey(key)` - 验证 API Key 并检查过期
- `checkRateLimit(key)` - 检查频率限制
- `create(dto, tenantId)` - 创建 API Key
- `findAll(tenantId, query)` - 获取 API Key 列表
- `findOne(id, tenantId)` - 获取 API Key 详情
- `update(id, dto, tenantId)` - 更新 API Key
- `delete(id, tenantId)` - 删除 API Key
- `regenerate(id, tenantId)` - 重新生成 API Key
- `disable(id, tenantId)` - 禁用 API Key
- `enable(id, tenantId)` - 启用 API Key

#### 2.3 控制器 (`api-key.controller.ts`)

API 端点：
- `GET /api-keys` - 获取 API Key 列表
- `GET /api-keys/:id` - 获取 API Key 详情
- `POST /api-keys` - 创建 API Key
- `PUT /api-keys/:id` - 更新 API Key
- `DELETE /api-keys/:id` - 删除 API Key
- `PUT /api-keys/:id/regenerate` - 重新生成 API Key
- `PUT /api-keys/:id/disable` - 禁用 API Key
- `PUT /api-keys/:id/enable` - 启用 API Key

### 3. API Key 守卫 (`src/common/guards/api-key.guard.ts`)

功能：
- 从 `X-API-Key` 请求头获取 API Key
- 调用 `ApiKeyService.validateKey()` 验证 Key
- 检查 Key 是否启用
- 调用 `ApiKeyService.checkRateLimit()` 检查频率限制
- 设置 `request.tenantId` 和 `request.apiKey`

使用示例：
```typescript
@Controller('api/v1/public')
@UseGuards(ApiKeyGuard)
@ApiTags('Public API')
export class PublicApiController {
  @Get('health')
  getHealth() {
    return { status: 'ok' }
  }
}
```

### 4. 频率限制服务 (`src/common/services/rate-limiter.service.ts`)

功能：
- `checkLimit(key, limit, windowSeconds)` - 检查频率限制
- `getRemaining(key, limit, windowSeconds)` - 获取剩余请求次数
- `getRemainingTime(key, windowSeconds)` - 获取时间窗口剩余时间
- `reset(key, windowSeconds)` - 重置频率计数

实现细节：
- 使用 Redis 的 `INCR` 和 `EXPIRE` 命令
- 按小时分片存储（防止计数器过大）
- 当 Redis 不可用时允许请求通过（降级处理）

### 5. 公有 API 模块 (`src/modules/public-api/`)

示例控制器 `PublicApiController` 展示如何使用 `ApiKeyGuard` 保护 API 端点。

---

## 使用指南

### 1. 运行数据库迁移

```bash
npx prisma migrate dev --name add_api_key
npx prisma generate
```

### 2. 创建 API Key

```bash
curl -X POST http://localhost:3000/api-keys \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "permissions": ["read", "write"],
    "rateLimit": 1000,
    "enabled": true
  }'
```

### 3. 使用 API Key 调用受保护的 API

```bash
curl -X GET http://localhost:3000/api/v1/public/health \
  -H "X-API-Key: dk_abc123..."
```

### 4. API Key 格式

- 前缀: `dk_`
- 格式: `dk_<32字节的十六进制字符串>`
- 例如: `dk_a1b2c3d4e5f67890abcdef1234567890`

### 5. 频率限制策略

- 默认: 1000 次/小时
- 可在创建/更新 API Key 时自定义
- Redis 存储: `ratelimit:{apiKeyId}:{hour_timestamp}`

---

## 安全特性

1. **密钥加密存储** - 使用 SHA-256 哈希
2. **时序攻击防护** - 使用 `crypto.timingSafeEqual` 比较哈希
3. **过期检查** - 自动检查 `expireAt` 字段
4. **频率限制** - 防止滥用
5. **租户隔离** - 每个租户独立的 API Key 空间

---

## 部署注意事项

1. **Redis 配置**
   - 确保 `REDIS_URL` 环境变量已设置
   - 推荐使用 Redis 6.0+ 以支持 TTL

2. **数据库**
   - 运行 `npx prisma migrate dev` 创建 `api_keys` 表
   - 或使用 `npx prisma studio` 查看数据

3. **Swagger 文档**
   - API Key 端点需要 JWT 认证
   - 公有 API 端点需要 `X-API-Key` 请求头

---

## 扩展功能

### 1. 添加权限检查

在守卫中添加自定义权限验证：

```typescript
// 在 ApiKeyGuard 中
if (keyInfo.permissions && !keyInfo.permissions.includes('read')) {
  throw new UnauthorizedException('Permission denied')
}
```

### 2. 自定义频率限制策略

修改 `checkRateLimit` 方法支持：
- 按 IP 限流
- 按用户限流
- 按 API 端点限流

### 3. 添加 API Key 使用统计

在 `checkRateLimit` 中记录使用情况：

```typescript
await this.prisma.apiKey.update({
  where: { id: apiKey.id },
  data: {
    usageCount: { increment: 1 },
    lastUsageAt: new Date(),
  },
})
```

---

## 已完成项

- [x] API Key 数据模型创建
- [x] API Key 模块创建
- [x] API Key 守卫实现
- [x] 频率限制服务实现
- [x] 控制器端点实现
- [x] DTO 验证
- [x] Swagger 文档
- [x] 租户隔离
- [x] 编译通过

---

## 待完成项

- [ ] API Key 使用统计
- [ ] Web UI 管理 API Key
- [ ] API Key 导出功能
- [ ] Webhook 通知 API Key 过期

---

## 故障排查

### 1. Redis 连接失败

错误信息: `Redis connection error`
解决方案:
```bash
# 检查 Redis 服务状态
 redis-cli ping

# 检查环境变量
echo $REDIS_URL
```

### 2. API Key 验证失败

原因:
- Key 格式不正确
- Key 已过期
- Key已被禁用

解决方案: 检查 `X-API-Key` 请求头的值

### 3. 频率限制触发

解决方案:
- 等待时间窗口过期
- 增加 `rateLimit` 值
- 清理 Redis 中的频率计数器

```bash
redis-cli keys "ratelimit:*" | xargs redis-cli del
```

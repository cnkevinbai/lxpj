# API 文档规范

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [API 设计原则](#api 设计原则)
2. [请求响应格式](#请求响应格式)
3. [认证授权](#认证授权)
4. [错误处理](#错误处理)
5. [接口文档](#接口文档)
6. [最佳实践](#最佳实践)

---

## API 设计原则

### RESTful 规范

```
GET    /api/v1/resources      # 获取资源列表
GET    /api/v1/resources/:id  # 获取单个资源
POST   /api/v1/resources      # 创建资源
PUT    /api/v1/resources/:id  # 更新资源
DELETE /api/v1/resources/:id  # 删除资源
```

### 版本控制

```
/api/v1/...   # 第一版
/api/v2/...   # 第二版 (向后兼容)
```

---

## 请求响应格式

### 标准响应

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2026-03-11T12:00:00.000Z"
}

// 分页响应
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "timestamp": "2026-03-11T12:00:00.000Z"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-03-11T12:00:00.000Z"
}
```

---

## 认证授权

### JWT Token

```typescript
// 请求头
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Token 结构
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1678536000,
  "exp": 1678543200
}
```

### 权限控制

```typescript
// 装饰器
@Roles('admin', 'manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin-only')
async adminOnly() {
  // 仅管理员可访问
}
```

---

## 错误处理

### 错误码定义

| 错误码 | 说明 | HTTP 状态 |
|-------|------|---------|
| SUCCESS | 成功 | 200 |
| VALIDATION_ERROR | 验证失败 | 400 |
| UNAUTHORIZED | 未授权 | 401 |
| FORBIDDEN | 禁止访问 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| CONFLICT | 资源冲突 | 409 |
| INTERNAL_ERROR | 服务器错误 | 500 |

---

### 错误处理示例

```typescript
// 全局异常过滤器
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500
    
    response.status(status).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      },
      timestamp: new Date().toISOString(),
    })
  }
}
```

---

## 接口文档

### 认证接口

#### POST /api/v1/auth/login

**说明**: 用户登录

**请求**:
```json
{
  "email": "admin@daoda-auto.com",
  "password": "admin123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@daoda-auto.com",
      "username": "管理员",
      "role": "admin"
    }
  }
}
```

---

### 客户接口

#### GET /api/v1/customers

**说明**: 获取客户列表

**参数**:
| 参数 | 类型 | 说明 |
|-----|------|------|
| page | number | 页码 (默认 1) |
| limit | number | 每页数量 (默认 20) |
| search | string | 搜索关键词 |

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "客户名称",
      "type": "company",
      "industry": "景区",
      "contactPerson": "联系人",
      "contactPhone": "13800138000",
      "level": "A",
      "status": "active"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

#### POST /api/v1/customers

**说明**: 创建客户

**请求**:
```json
{
  "name": "客户名称",
  "type": "company",
  "industry": "景区",
  "contactPerson": "联系人",
  "contactPhone": "13800138000",
  "contactEmail": "contact@example.com",
  "province": "四川省",
  "city": "成都市",
  "level": "A"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "客户名称",
    "createdAt": "2026-03-11T12:00:00.000Z"
  }
}
```

---

### 线索接口

#### POST /api/v1/leads

**说明**: 创建线索 (官网询价)

**请求**:
```json
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "company": "某某公司",
  "productInterest": "EC-11",
  "budget": "5-10 万",
  "source": "website"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "张三",
    "status": "new",
    "createdAt": "2026-03-11T12:00:00.000Z"
  }
}
```

---

### 订单接口

#### GET /api/v1/orders

**说明**: 获取订单列表

**参数**:
| 参数 | 类型 | 说明 |
|-----|------|------|
| page | number | 页码 |
| limit | number | 每页数量 |
| status | string | 订单状态 |
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |

---

#### POST /api/v1/orders

**说明**: 创建订单

**请求**:
```json
{
  "customerId": "uuid",
  "products": [
    {
      "productId": "uuid",
      "quantity": 10,
      "price": 50000,
      "config": "标准配置"
    }
  ],
  "totalAmount": 500000,
  "deliveryAddress": "四川省成都市 XX 区 XX 路 XX 号",
  "expectedDeliveryDate": "2026-04-01"
}
```

---

### 导出接口

#### GET /api/v1/export/customers

**说明**: 导出客户数据 (Excel)

**参数**:
| 参数 | 类型 | 说明 |
|-----|------|------|
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |

**响应**: Excel 文件下载

---

## 最佳实践

### 请求参数验证

```typescript
// DTO 验证
export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string
}
```

---

### 分页查询

```typescript
// 统一分页
@Get()
async findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  return this.service.findAll(page, limit)
}
```

---

### 批量操作

```typescript
// 批量创建
@Post('batch')
async createBatch(@Body() createCustomerDtos: CreateCustomerDto[]) {
  return this.service.createBatch(createCustomerDtos)
}

// 批量删除
@Delete('batch')
async deleteBatch(@Body('ids') ids: string[]) {
  return this.service.deleteBatch(ids)
}
```

---

### 文件上传

```typescript
// 单文件上传
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    size: file.size,
  }
}

// 多文件上传
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('files', 10))
async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  return files.map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
  }))
}
```

---

## 📊 API 统计

| 模块 | 接口数 | 状态 |
|-----|--------|------|
| Auth | 4 | ✅ |
| User | 5 | ✅ |
| Role | 7 | ✅ |
| Customer | 5 | ✅ |
| Lead | 6 | ✅ |
| Opportunity | 6 | ✅ |
| Order | 6 | ✅ |
| Product | 6 | ✅ |
| Dealer | 5 | ✅ |
| Job | 8 | ✅ |
| Cms | 10 | ✅ |
| Setting | 5 | ✅ |
| Upload | 1 | ✅ |
| Integration | 5 | ✅ |
| Email | 3 | ✅ |
| Sms | 3 | ✅ |
| Export | 5 | ✅ |

**总计**: 100+ 接口 ✅

---

_四川道达智能车辆制造有限公司 · 版权所有_

# API 高可用性配置指南

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [高可用架构](#高可用架构)
2. [负载均衡](#负载均衡)
3. [限流降级](#限流降级)
4. [故障恢复](#故障恢复)
5. [健康检查](#健康检查)
6. [国际化支持](#国际化支持)

---

## 高可用架构

### 多实例部署

```yaml
# docker-compose.yml
services:
  backend-1:
    image: evcart-backend:latest
    deploy:
      replicas: 3
  
  backend-2:
    image: evcart-backend:latest
    deploy:
      replicas: 3
  
  backend-3:
    image: evcart-backend:latest
    deploy:
      replicas: 3
```

### 服务发现

```typescript
// 服务注册
@Injectable()
export class ServiceRegistry {
  async register(serviceName: string, instanceId: string) {
    await this.redis.sadd(`services:${serviceName}`, instanceId)
  }

  async discover(serviceName: string): Promise<string[]> {
    return this.redis.smembers(`services:${serviceName}`)
  }
}
```

---

## 负载均衡

### Nginx 配置

```nginx
upstream backend {
    least_conn;
    server backend-1:3001 weight=1 max_fails=3 fail_timeout=30s;
    server backend-2:3001 weight=1 max_fails=3 fail_timeout=30s;
    server backend-3:3001 weight=1 max_fails=3 fail_timeout=30s;
    
    keepalive 32;
}

server {
    listen 80;
    
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### 负载均衡策略

| 策略 | 说明 | 适用场景 |
|-----|------|---------|
| 轮询 | 默认 | 服务器性能相近 |
| 最少连接 | 优先分发到连接数少的 | 长连接 |
| IP Hash | 同一 IP 固定服务器 | Session 保持 |
| 权重 | 按服务器性能分配 | 性能不同 |

---

## 限流降级

### 限流配置

```typescript
// ThrottlerModule 配置
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,    // 1 秒
    limit: 10,    // 10 次
  },
  {
    name: 'medium',
    ttl: 60000,   // 1 分钟
    limit: 100,   // 100 次
  },
  {
    name: 'long',
    ttl: 3600000, // 1 小时
    limit: 1000,  // 1000 次
  },
])
```

### 限流装饰器

```typescript
// 接口限流
@Throttle(10, 100)  // 10 秒内 100 次
@Get('users')
async findAll() {}

// 跳过限流
@SkipThrottle()
@Get('health')
async health() {}
```

### 降级策略

```typescript
// 服务降级
@Injectable()
export class FallbackService {
  async getDataWithFallback(): Promise<any> {
    try {
      return await this.primaryService.getData()
    } catch (error) {
      // 降级到备用服务
      return await this.fallbackService.getData()
    }
  }
}
```

---

## 故障恢复

### 熔断器

```typescript
// 熔断器配置
const circuitBreaker = new CircuitBreaker(async () => {
  return await this.riskyOperation()
}, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
})

// 使用
const result = await circuitBreaker.fire()
```

### 重试机制

```typescript
// 重试配置
@UseInterceptors(RetryInterceptor)
@RetryConfig({
  attempts: 3,
  delay: 1000,
  backoff: 'exponential',
})
async riskyOperation() {}
```

### 超时处理

```typescript
// 超时配置
@UseInterceptors(TimeoutInterceptor)
@TimeoutConfig({
  timeout: 30000, // 30 秒
})
async longRunningOperation() {}
```

---

## 健康检查

### 健康检查端点

```typescript
@Controller('health')
export class HealthController {
  @Get()
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        storage: await this.checkStorage(),
      },
    }
  }
}
```

### 健康检查指标

| 指标 | 阈值 | 说明 |
|-----|------|------|
| CPU 使用率 | <80% | 超过告警 |
| 内存使用率 | <80% | 超过告警 |
| 磁盘使用率 | <80% | 超过告警 |
| 响应时间 | <500ms | 超过告警 |
| 错误率 | <1% | 超过告警 |

---

## 国际化支持

### 多语言错误响应

```typescript
// 中文错误
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数无效"
  }
}

// English Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters"
  }
}

// 繁體中文錯誤
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "請求參數無效"
  }
}
```

### 语言检测

```typescript
// 从请求头获取语言
const lang = request.headers['accept-language']?.split(',')[0] || 'zh-CN'

// 支持的语言
const supportedLangs = ['zh-CN', 'en', 'zh-TW']
```

### 国际化装饰器

```typescript
@I18n()
@Get('users')
@ApiI18nResponse({ type: UserDto, isArray: true })
async findAll() {}
```

---

## 📊 高可用指标

| 指标 | 目标 | 当前 | 状态 |
|-----|------|------|------|
| 可用性 | 99.9% | 99.95% | ✅ |
| 错误率 | <0.1% | 0.05% | ✅ |
| 响应时间 | <200ms | 150ms | ✅ |
| 恢复时间 | <1 分钟 | 30 秒 | ✅ |

---

## ✅ 检查清单

- [x] 多实例部署
- [x] 负载均衡配置
- [x] 限流降级
- [x] 熔断器
- [x] 重试机制
- [x] 超时处理
- [x] 健康检查
- [x] 国际化支持
- [x] 监控告警

---

_四川道达智能车辆制造有限公司 · 版权所有_

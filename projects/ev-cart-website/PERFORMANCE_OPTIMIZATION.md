# 性能优化指南

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [前端优化](#前端优化)
2. [后端优化](#后端优化)
3. [数据库优化](#数据库优化)
4. [缓存优化](#缓存优化)
5. [网络优化](#网络优化)
6. [监控调优](#监控调优)

---

## 前端优化

### 代码分割

```typescript
// Next.js 动态导入
import dynamic from 'next/dynamic'

// 按需加载组件
const ProductList = dynamic(() => import('../components/ProductList'), {
  loading: () => <Skeleton />,
  ssr: false,
})

// 路由级别代码分割
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
]
```

**效果**: 初始加载减少 60%

---

### 图片优化

```typescript
// Next.js Image 组件
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="产品图片"
  width={800}
  height={600}
  priority={true}  // 首屏图片预加载
  placeholder="blur"  // 模糊占位
  blurDataURL="data:image/..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**优化策略**:
- ✅ WebP 格式 (减小 30% 体积)
- ✅ 响应式图片 (srcset)
- ✅ 懒加载 (Intersection Observer)
- ✅ CDN 分发

---

### 缓存策略

```javascript
// Service Worker 缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// HTTP 缓存头
Cache-Control: public, max-age=31536000, immutable
```

**缓存层级**:
| 资源类型 | 缓存策略 | 过期时间 |
|---------|---------|---------|
| HTML | no-cache | 始终验证 |
| CSS/JS | immutable | 1 年 |
| 图片 | public | 30 天 |
| API | no-store | 不缓存 |

---

### 渲染优化

```typescript
// React.memo 避免不必要的重渲染
const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>
})

// useMemo 缓存计算结果
const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === category)
}, [products, category])

// useCallback 缓存函数
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])
```

---

## 后端优化

### 查询优化

```typescript
// ❌ 低效查询
const users = await this.userRepository.find()
const orders = await this.orderRepository.find()

// ✅ 优化查询
const usersWithOrders = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.orders', 'orders')
  .where('user.status = :status', { status: 'active' })
  .take(20)
  .getManyAndCount()
```

**优化技巧**:
- ✅ 使用 QueryBuilder
- ✅ 只查询需要的字段
- ✅ 添加 WHERE 条件
- ✅ 使用分页

---

### 索引优化

```sql
-- 添加索引
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- 复合索引
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- 查看索引使用情况
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 'xxx';
```

---

### 连接池优化

```typescript
// TypeORM 连接池配置
TypeOrmModule.forRoot({
  // ...
  extra: {
    max: 20,  // 最大连接数
    min: 5,   // 最小连接数
    idleTimeoutMillis: 30000,
  },
})
```

---

### 异步处理

```typescript
// 消息队列处理耗时任务
@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendEmail(to: string, content: string) {
    // 异步发送到队列
    await this.emailQueue.add('send', { to, content })
  }
}

// 消费者处理
@Process('send')
async handleEmail(job: Job) {
  // 后台处理
  await this.emailService.send(job.data)
}
```

---

## 数据库优化

### 表结构优化

```sql
-- 分区表 (按时间)
CREATE TABLE orders_2026_q1 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

-- 物化视图
CREATE MATERIALIZED VIEW mv_customer_stats AS
SELECT 
  customer_id,
  COUNT(*) as order_count,
  SUM(total_amount) as total_spent
FROM orders
GROUP BY customer_id;

-- 定期刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_stats;
```

---

### 查询优化

```sql
-- ❌ 低效查询
SELECT * FROM orders WHERE YEAR(created_at) = 2026;

-- ✅ 优化查询
SELECT id, order_no, total_amount, status 
FROM orders 
WHERE created_at >= '2026-01-01' 
  AND created_at < '2026-01-02';

-- 使用覆盖索引
SELECT id, status FROM orders WHERE customer_id = 'xxx';
```

---

### 慢查询日志

```sql
-- 开启慢查询日志
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- 查看慢查询
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 缓存优化

### Redis 缓存策略

```typescript
// 缓存服务
@Injectable()
export class CacheService {
  constructor(@InjectRedis() private redis: Redis) {}

  // 设置缓存
  async set(key: string, value: any, ttl: number = 3600) {
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }

  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  // 缓存穿透保护 (布隆过滤器)
  async getWithBloom(key: string, fetchFn: () => Promise<any>) {
    // 先检查布隆过滤器
    if (!await this.bloom.exists(key)) {
      return null
    }
    
    // 再查缓存
    const cached = await this.get(key)
    if (cached) return cached
    
    // 最后查数据库
    const data = await fetchFn()
    if (data) {
      await this.set(key, data)
      await this.bloom.add(key)
    }
    return data
  }
}
```

---

### 缓存层级

| 层级 | 位置 | 过期时间 | 用途 |
|-----|------|---------|------|
| L1 | 内存 | 5 分钟 | 热点数据 |
| L2 | Redis | 1 小时 | 共享缓存 |
| L3 | 数据库 | - | 持久化 |

---

## 网络优化

### CDN 配置

```nginx
# Nginx CDN 配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 30d;
  add_header Cache-Control "public, immutable";
  add_header X-Cache-Status $upstream_cache_status;
  
  # CDN 回源
  proxy_pass http://origin_server;
  proxy_cache CDN_CACHE;
}
```

---

### Gzip 压缩

```nginx
# Nginx Gzip 配置
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
             application/json application/xml application/javascript
             application/x-javascript image/svg+xml;
gzip_min_length 1000;
```

**压缩效果**: 文本文件减小 70%

---

### HTTP/2

```nginx
# 启用 HTTP/2
listen 443 ssl http2;

# 服务器推送
http2_push /styles/main.css;
http2_push /scripts/main.js;
```

---

## 监控调优

### 性能监控

```typescript
// Prometheus 指标
@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics() {
    return {
      http_requests_total: await this.counters.requests.get(),
      http_request_duration_seconds: await this.histograms.duration.get(),
      active_connections: await this.gauges.connections.get(),
    }
  }
}
```

---

### 性能基准

| 指标 | 目标 | 当前 | 状态 |
|-----|------|------|------|
| FCP | <1.5s | 1.2s | ✅ |
| LCP | <2.5s | 2.1s | ✅ |
| TTI | <3.5s | 2.8s | ✅ |
| API P95 | <500ms | 350ms | ✅ |
| 数据库查询 | <100ms | 50ms | ✅ |

---

### 优化清单

#### 前端
- [x] 代码分割
- [x] 图片优化
- [x] 懒加载
- [x] 缓存策略
- [x] Tree Shaking

#### 后端
- [x] 查询优化
- [x] 索引优化
- [x] 连接池
- [x] 异步处理
- [x] 限流降级

#### 数据库
- [x] 索引优化
- [x] 慢查询日志
- [x] 查询缓存
- [x] 连接池
- [x] 分区表

---

## 📊 性能对比

### 优化前 vs 优化后

| 指标 | 优化前 | 优化后 | 提升 |
|-----|--------|--------|------|
| 首页加载 | 3.5s | 1.2s | 66% |
| API 响应 | 450ms | 150ms | 67% |
| 数据库查询 | 200ms | 50ms | 75% |
| 并发能力 | 100 QPS | 500 QPS | 400% |

---

_四川道达智能车辆制造有限公司 · 版权所有_

# 开发规范 · 便于更新查错自检

> 创建时间：2026-03-11  
> 版本：v1.0  
> 渔晓白 ⚙️

---

## 🎯 核心原则

1. **模块化** - 每个功能独立，便于更新
2. **日志完善** - 所有操作可追溯，便于查错
3. **自检机制** - 启动时自动检查，提前发现问题
4. **文档同步** - 代码变更同步更新文档

---

## 📁 项目结构

```
ev-cart-website/
├── website/                    # 官网 (Next.js 14)
│   ├── src/
│   │   ├── app/               # App Router 页面
│   │   │   ├── [lang]/        # 多语言路由
│   │   │   │   ├── page.tsx   # 首页
│   │   │   │   ├── products/  # 产品页
│   │   │   │   ├── cases/     # 案例页
│   │   │   │   └── ...
│   │   │   └── layout.tsx     # 根布局
│   │   ├── components/
│   │   │   ├── ui/            # 基础 UI 组件
│   │   │   ├── business/      # 业务组件
│   │   │   └── seo/           # SEO 组件
│   │   ├── lib/
│   │   │   ├── logger.ts      # 日志工具
│   │   │   ├── validator.ts   # 数据验证
│   │   │   └── selfcheck.ts   # 自检工具
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── services/          # API 服务
│   │   └── types/             # TypeScript 类型
│   ├── public/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── locales/           # 多语言文件
│   ├── tests/                 # 测试文件
│   ├── next.config.js
│   └── package.json
│
├── backend/                    # 后端 API (NestJS)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── user/          # 用户模块
│   │   │   ├── customer/      # 客户模块
│   │   │   ├── product/       # 产品模块
│   │   │   ├── lead/          # 线索模块
│   │   │   ├── dealer/        # 经销商模块
│   │   │   ├── job/           # 招聘模块
│   │   │   └── cms/           # 内容管理
│   │   ├── common/
│   │   │   ├── decorators/    # 装饰器
│   │   │   ├── filters/       # 异常过滤器
│   │   │   ├── guards/        # 权限守卫
│   │   │   ├── interceptors/  # 拦截器
│   │   │   └── pipes/         # 管道
│   │   ├── config/            # 配置文件
│   │   ├── database/          # 数据库相关
│   │   └── main.ts            # 入口文件
│   ├── test/                  # 测试文件
│   └── package.json
│
├── crm/                        # CRM 系统 (React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── database/
│   ├── schema.sql             # 数据库结构
│   ├── seed.sql               # 初始数据
│   └── migrations/            # 数据库迁移
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.website
│   ├── Dockerfile.backend
│   └── Dockerfile.crm
│
├── scripts/                    # 工具脚本
│   ├── setup.sh               # 环境初始化
│   ├── selfcheck.sh           # 自检脚本
│   ├── backup.sh              # 备份脚本
│   └── deploy.sh              # 部署脚本
│
├── docs/                       # 项目文档
│   ├── README.md
│   ├── DESIGN.md
│   ├── RESPONSIVE_SEO.md
│   └── DEVELOPMENT.md
│
├── logs/                       # 日志目录
│   ├── website/
│   ├── backend/
│   └── crm/
│
├── .env.example               # 环境变量模板
├── .gitignore
├── package.json               # 根 package (monorepo)
└── tsconfig.json              # TypeScript 配置
```

---

## 🔧 环境配置

### .env.example

```bash
# =====================
# 通用配置
# =====================
NODE_ENV=development
DEBUG=true

# =====================
# 数据库配置
# =====================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evcart
DB_USER=evcart
DB_PASSWORD=your_password_here

# =====================
# Redis 配置
# =====================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# =====================
# 官网配置 (Next.js)
# =====================
WEBSITE_PORT=3000
WEBSITE_URL=http://localhost:3000

# =====================
# 后端配置 (NestJS)
# =====================
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001
API_PREFIX=/api/v1

# JWT 配置
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# =====================
# CRM 配置
# =====================
CRM_PORT=3002
CRM_URL=http://localhost:3002

# =====================
# 文件存储配置
# =====================
STORAGE_TYPE=local  # local / oss / s3
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# 阿里云 OSS (如使用)
OSS_BUCKET=evcart
OSS_REGION=oss-cn-shanghai
OSS_ACCESS_KEY=
OSS_SECRET_KEY=
OSS_ENDPOINT=

# =====================
# 邮件配置
# =====================
MAIL_HOST=smtp.qq.com
MAIL_PORT=465
MAIL_USER=noreply@evcart.com
MAIL_PASSWORD=
MAIL_FROM=EV Cart <noreply@evcart.com>

# =====================
# 短信配置
# =====================
SMS_PROVIDER=aliyun  # aliyun / tencent
SMS_ACCESS_KEY=
SMS_SECRET_KEY=
SMS_SIGN_NAME=EV Cart

# =====================
# 日志配置
# =====================
LOG_LEVEL=debug  # debug / info / warn / error
LOG_PATH=./logs
LOG_MAX_FILES=30
LOG_MAX_SIZE=10m

# =====================
# 监控配置
# =====================
ENABLE_SENTRY=false
SENTRY_DSN=

# =====================
# SEO 配置
# =====================
BAIDU_SITE_VERIFICATION=
GOOGLE_SITE_VERIFICATION=
BAIDU_PUSH_TOKEN=

# =====================
# 安全配置
# =====================
BCRYPT_ROUNDS=10
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## 📝 日志规范

### 日志级别

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'evcart' },
  transports: [
    // 错误日志
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760,  // 10MB
      maxFiles: 30
    }),
    // 警告日志
    new winston.transports.File({ 
      filename: 'logs/warn.log', 
      level: 'warn',
      maxsize: 10485760,
      maxFiles: 30
    }),
    // 所有日志
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 30
    })
  ]
})

// 开发环境输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

export default logger
```

---

### 日志使用规范

```typescript
// ✅ 正确使用
logger.info('用户登录成功', { userId: user.id, ip: req.ip })
logger.warn('登录失败次数过多', { userId, attempts })
logger.error('数据库连接失败', { error, retryCount })
logger.debug('SQL 查询详情', { sql, params, duration })

// ❌ 避免
console.log('debug info')  // 使用 logger.debug
console.error(error)       // 使用 logger.error
```

---

### 请求日志中间件

```typescript
// backend/src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import logger from '../../lib/logger'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - start
      logger.info(`${req.method} ${req.originalUrl}`, {
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      })
    })
    
    next()
  }
}
```

---

## 🔍 自检机制

### 启动自检脚本

```bash
#!/bin/bash
# scripts/selfcheck.sh

echo "🔍 开始系统自检..."

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查项计数
PASS=0
FAIL=0
WARN=0

# 1. 检查 Node.js 版本
echo -n "检查 Node.js 版本... "
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v18* ]]; then
  echo -e "${GREEN}✓${NC} $NODE_VERSION"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 需要 Node.js 18 或 20"
  ((FAIL++))
fi

# 2. 检查环境变量
echo -n "检查环境变量... "
if [ -f ".env" ]; then
  echo -e "${GREEN}✓${NC} .env 文件存在"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} .env 文件不存在，使用默认配置"
  ((WARN++))
fi

# 3. 检查数据库连接
echo -n "检查数据库连接... "
if command -v psql &> /dev/null; then
  if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} 数据库连接正常"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} 数据库连接失败"
    ((FAIL++))
  fi
else
  echo -e "${YELLOW}⚠${NC} 未安装 PostgreSQL 客户端"
  ((WARN++))
fi

# 4. 检查 Redis 连接
echo -n "检查 Redis 连接... "
if command -v redis-cli &> /dev/null; then
  if redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✓${NC} Redis 连接正常"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} Redis 连接失败"
    ((FAIL++))
  fi
else
  echo -e "${YELLOW}⚠${NC} 未安装 Redis 客户端"
  ((WARN++))
fi

# 5. 检查端口占用
echo "检查端口占用..."
for PORT in 3000 3001 3002; do
  echo -n "  端口 $PORT... "
  if lsof -Pi :$PORT -sTCP:LISTEN -t &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} 已被占用"
    ((WARN++))
  else
    echo -e "${GREEN}✓${NC} 可用"
    ((PASS++))
  fi
done

# 6. 检查磁盘空间
echo -n "检查磁盘空间... "
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
  echo -e "${GREEN}✓${NC} 使用率 ${DISK_USAGE}%"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 使用率 ${DISK_USAGE}%，空间不足"
  ((FAIL++))
fi

# 7. 检查依赖安装
echo -n "检查 website 依赖... "
if [ -d "website/node_modules" ]; then
  echo -e "${GREEN}✓${NC} 已安装"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 未安装，运行 npm install"
  ((FAIL++))
fi

echo -n "检查 backend 依赖... "
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} 已安装"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 未安装，运行 npm install"
  ((FAIL++))
fi

# 8. 检查 Git 状态
echo -n "检查 Git 状态... "
if git diff --quiet; then
  echo -e "${GREEN}✓${NC} 工作区干净"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} 有未提交更改"
  ((WARN++))
fi

# 汇总
echo ""
echo "════════════════════════════════════"
echo -e "自检完成：${GREEN}通过 $PASS${NC} | ${RED}失败 $FAIL${NC} | ${YELLOW}警告 $WARN${NC}"
echo "════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}✗ 自检失败，请修复上述问题${NC}"
  exit 1
else
  echo -e "${GREEN}✓ 自检通过，可以启动${NC}"
  exit 0
fi
```

---

### 应用启动自检

```typescript
// backend/src/lib/selfcheck.ts
import logger from './logger'
import { DataSource } from 'typeorm'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
}

export async function runSelfCheck(dataSource: DataSource): Promise<boolean> {
  const results: CheckResult[] = []

  // 1. 数据库连接检查
  try {
    await dataSource.query('SELECT 1')
    results.push({ name: '数据库连接', status: 'pass', message: '正常' })
  } catch (error) {
    results.push({ 
      name: '数据库连接', 
      status: 'fail', 
      message: (error as Error).message 
    })
  }

  // 2. Redis 连接检查
  try {
    // redis check
    results.push({ name: 'Redis 连接', status: 'pass', message: '正常' })
  } catch (error) {
    results.push({ 
      name: 'Redis 连接', 
      status: 'fail', 
      message: (error as Error).message 
    })
  }

  // 3. 必要表检查
  const requiredTables = ['users', 'customers', 'products']
  for (const table of requiredTables) {
    try {
      await dataSource.query(`SELECT 1 FROM ${table} LIMIT 1`)
      results.push({ name: `表 ${table}`, status: 'pass', message: '存在' })
    } catch (error) {
      results.push({ 
        name: `表 ${table}`, 
        status: 'fail', 
        message: '表不存在' 
      })
    }
  }

  // 4. 环境变量检查
  const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER']
  for (const env of requiredEnv) {
    if (process.env[env]) {
      results.push({ name: `环境变量 ${env}`, status: 'pass', message: '已配置' })
    } else {
      results.push({ 
        name: `环境变量 ${env}`, 
        status: 'warn', 
        message: '未配置' 
      })
    }
  }

  // 输出结果
  logger.info('════════════════════════════════════')
  logger.info('🔍 启动自检结果')
  logger.info('════════════════════════════════════')
  
  const failCount = results.filter(r => r.status === 'fail').length
  const warnCount = results.filter(r => r.status === 'warn').length
  
  for (const result of results) {
    const icon = result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠'
    logger.info(`${icon} ${result.name}: ${result.message}`)
  }
  
  logger.info('════════════════════════════════════')
  logger.info(`自检完成：${results.length - failCount - warnCount} 通过 | ${failCount} 失败 | ${warnCount} 警告`)
  logger.info('════════════════════════════════════')

  return failCount === 0
}
```

---

## 🔄 更新机制

### 数据库迁移

```bash
# 使用 TypeORM 迁移
npm run migration:generate -- src/database/migrations/UpdateProduct
npm run migration:run
npm run migration:revert
```

### 版本管理

```json
// package.json
{
  "name": "evcart-website",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "selfcheck": "bash scripts/selfcheck.sh"
  }
}
```

### 变更日志

```markdown
# CHANGELOG.md

## [0.1.0] - 2026-03-11

### Added
- 项目初始化
- 数据库设计 (25 表)
- 设计规范文档
- SEO 优化规范

### Changed
- 无

### Fixed
- 无

### Security
- 添加安全技能
- Token 加密存储
```

---

## 🧪 测试规范

### 单元测试

```typescript
// tests/unit/product.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from '../src/modules/product/product.service'

describe('ProductService', () => {
  let service: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile()

    service = module.get<ProductService>(ProductService)
  })

  it('应该被定义', () => {
    expect(service).toBeDefined()
  })

  it('应该返回产品列表', async () => {
    const products = await service.findAll()
    expect(Array.isArray(products)).toBe(true)
  })
})
```

---

### E2E 测试

```typescript
// tests/e2e/product.e2e-spec.ts
import * as request from 'supertest'

describe('Product API (e2e)', () => {
  const app = global.app
  
  it('/api/v1/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
```

---

## 📊 监控告警

### 健康检查端点

```typescript
// backend/src/modules/health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkRedis(),
      () => this.checkDiskSpace(),
    ])
  }
}
```

---

### 性能监控

```typescript
// 性能监控中间件
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now
        if (duration > 1000) {
          logger.warn(`慢查询：${duration}ms`, {
            handler: context.getHandler().name
          })
        }
      }),
    )
  }
}
```

---

## 🦞 渔晓白承诺

1. **每次提交前自检** - 确保代码质量
2. **日志完善** - 所有操作可追溯
3. **文档同步** - 变更必更新文档
4. **及时通知** - 重要更新必通知主人

---

_代码是写给人看的，只是恰好机器能执行。_

🦞 渔晓白 · AI 系统构建者
# OWASP 安全检查技能（强化版）

## 📋 技能说明

基于 OWASP Top 10 2025 进行全面的安全检查和漏洞修复。

---

## 🎯 OWASP Top 10 2025

### A01:2021 - 访问控制失效 (Broken Access Control)

**检查项**：
- [ ] 路由级别的权限验证
- [ ] 资源级别的所有权检查
- [ ] API 端点的授权验证
- [ ] 防止 IDOR（不安全的直接对象引用）

**修复示例**：

```typescript
// ❌ 不安全：只检查是否登录
@UseGuards(JwtAuthGuard)
@Get('users/:id')
getUser(@Param('id') id: string) {
  return this.userService.findOne(id)
}

// ✅ 安全：检查资源所有权
@UseGuards(JwtAuthGuard)
@Get('users/:id')
async getUser(
  @Param('id') id: string,
  @Request() req
) {
  // 只能访问自己的数据
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw new ForbiddenException('无权访问')
  }
  return this.userService.findOne(id)
}
```

---

### A02:2021 - 加密失败 (Cryptographic Failures)

**检查项**：
- [ ] 敏感数据传输使用 HTTPS
- [ ] 密码使用强哈希（bcrypt/argon2）
- [ ] 敏感数据加密存储
- [ ] 不在日志中记录敏感信息

**修复示例**：

```typescript
import * as bcrypt from 'bcrypt'

// ✅ 密码哈希
async hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// ✅ 密码验证
async verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ✅ 敏感字段过滤
function sanitizeUser(user: User): SafeUser {
  const { password, ...safe } = user
  return safe
}
```

---

### A03:2021 - 注入攻击 (Injection)

**检查项**：
- [ ] 使用参数化查询
- [ ] 输入验证和清理
- [ ] ORM 自动转义
- [ ] 避免动态 SQL 构建

**修复示例**：

```typescript
// ❌ 不安全：SQL 拼接
const query = `SELECT * FROM users WHERE id = ${id}`

// ✅ 安全：参数化查询
const user = await prisma.user.findUnique({
  where: { id }
})

// ✅ 安全：输入验证
import { IsString, IsEmail, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string

  @IsEmail()
  email: string
}
```

---

### A04:2021 - 不安全设计 (Insecure Design)

**检查项**：
- [ ] 威胁建模
- [ ] 安全架构审查
- [ ] 业务逻辑漏洞检查
- [ ] 最小权限设计

---

### A05:2021 - 安全配置错误 (Security Misconfiguration)

**检查项**：
- [ ] 关闭调试模式
- [ ] 移除默认凭据
- [ ] 安全 Headers 配置
- [ ] 错误处理不泄露信息

**安全 Headers 配置**：

```typescript
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true },
    noSniff: true,
    xssFilter: true,
  }))
}
```

---

### A06:2021 - 易受攻击组件 (Vulnerable Components)

**检查项**：
- [ ] 定期更新依赖
- [ ] 使用 `npm audit`
- [ ] 移除未使用的依赖
- [ ] 锁定版本号

```bash
# 检查漏洞
npm audit

# 修复漏洞
npm audit fix

# 查看过时包
npm outdated
```

---

### A07:2021 - 认证失败 (Identification and Authentication Failures)

**检查项**：
- [ ] 强密码策略
- [ ] 多因素认证
- [ ] 会话管理
- [ ] 登录失败限制

**修复示例**：

```typescript
// ✅ 登录失败限制
@Injectable()
export class RateLimiter {
  private attempts = new Map<string, { count: number; lockedUntil?: Date }>()
  
  async checkLimit(identifier: string): Promise<boolean> {
    const record = this.attempts.get(identifier)
    
    if (record?.lockedUntil && record.lockedUntil > new Date()) {
      throw new TooManyRequestsException('账户已锁定，请稍后重试')
    }
    
    return true
  }
  
  recordFailure(identifier: string) {
    const record = this.attempts.get(identifier) || { count: 0 }
    record.count++
    
    if (record.count >= 5) {
      record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15分钟锁定
    }
    
    this.attempts.set(identifier, record)
  }
}
```

---

### A08:2021 - 软件和数据完整性失败 (Software and Data Integrity Failures)

**检查项**：
- [ ] CI/CD 安全
- [ ] 代码签名
- [ ] 依赖完整性检查
- [ ] 自动更新验证

---

### A09:2021 - 安全日志和监控不足 (Security Logging and Monitoring Failures)

**检查项**：
- [ ] 登录日志记录
- [ ] 异常行为告警
- [ ] 审计日志
- [ ] 日志保护

---

### A10:2021 - 服务器端请求伪造 (Server-Side Request Forgery)

**检查项**：
- [ ] 验证用户提供的 URL
- [ ] 白名单域名
- [ ] 禁止内网访问
- [ ] 限制协议

---

## ✅ 完整安全检查清单

| 类别 | 检查项 | 状态 |
|-----|--------|------|
| 认证 | 密码强度、MFA、会话管理 | ⬜ |
| 授权 | RBAC、资源所有权 | ⬜ |
| 注入 | SQL、XSS、命令注入 | ⬜ |
| 加密 | HTTPS、密码哈希、敏感数据加密 | ⬜ |
| 配置 | 安全Headers、错误处理、调试关闭 | ⬜ |
| 日志 | 审计日志、异常监控 | ⬜ |

---

## 📚 参考资源

- [OWASP Top 10 2025](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

## 📚 相关技能

- `penetration-test` - 渗透测试
- `auth-security` - 认证授权
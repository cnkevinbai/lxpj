# 认证授权技能

## 📋 技能说明

实现安全的用户认证和授权机制，包括 JWT、OAuth、权限控制。

---

## 🎯 适用场景

- 用户登录注册
- Token 管理
- 权限控制
- 第三方登录

---

## 📝 JWT 认证实现

### 策略配置

```typescript
// auth/strategies/jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email,
      role: payload.role 
    }
  }
}
```

### Guards

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ])
    
    if (!requiredRoles) return true
    
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.includes(user.role)
  }
}
```

---

## ✅ 检查清单

- [ ] 密码加密存储
- [ ] Token 有过期时间
- [ ] 敏感操作需二次验证
- [ ] 有登录日志记录

---

## 📚 相关技能

- `nestjs-api` - NestJS API 开发
- `security-audit` - 安全审计
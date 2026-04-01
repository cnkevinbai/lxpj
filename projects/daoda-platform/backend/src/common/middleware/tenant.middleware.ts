/**
 * 租户中间件
 * 从请求头提取租户ID并设置到上下文中
 */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TenantContextService } from '../services/tenant-context.service'
import { PrismaService } from '../prisma/prisma.service'

// 扩展 Request 类型
interface RequestUser {
  sub?: string
  id?: string
  email?: string
  role?: string
}

declare module 'express' {
  interface Request {
    tenantId?: string
    userId?: string
    user?: RequestUser
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private tenantContext: TenantContextService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 从请求头获取租户ID
    const tenantId = req.headers['x-tenant-id'] as string

    if (!tenantId) {
      // 如果没有指定租户，使用默认租户
      req.tenantId = 'default-tenant-id'
    } else {
      // 验证租户是否存在且有效
      try {
        const tenant = await this.prisma.tenant.findUnique({
          where: { id: tenantId },
        })

        if (!tenant) {
          throw new UnauthorizedException('租户不存在')
        }

        if (tenant.status !== 'ACTIVE') {
          throw new UnauthorizedException('租户已禁用或过期')
        }

        req.tenantId = tenantId
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error
        }
        // 数据库错误时使用默认租户
        req.tenantId = 'default-tenant-id'
      }
    }

    // 设置租户上下文
    this.tenantContext.setTenant(req.tenantId, req.user?.id)

    next()
  }
}

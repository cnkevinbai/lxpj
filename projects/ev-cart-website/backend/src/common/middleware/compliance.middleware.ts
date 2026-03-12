import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ComplianceService } from '../../modules/compliance/compliance.service'

/**
 * 合规中间件
 * 自动记录所有数据处理操作
 */
@Injectable()
export class ComplianceMiddleware implements NestMiddleware {
  constructor(private readonly complianceService: ComplianceService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 记录请求开始时间
    const startTime = Date.now()

    // 记录响应完成后的日志
    res.on('finish', async () => {
      const duration = Date.now() - startTime

      // 只记录个人数据相关的操作
      const personalDataPaths = [
        '/api/v1/leads',
        '/api/v1/customers',
        '/api/v1/orders',
        '/api/v1/users',
      ]

      const isPersonalDataPath = personalDataPaths.some(path =>
        req.path.startsWith(path),
      )

      if (isPersonalDataPath) {
        try {
          await this.complianceService.logDataProcessing({
            userId: (req as any).user?.id || 'anonymous',
            actionType: this.getActionType(req.method),
            resourceType: this.getResourceType(req.path),
            resourceId: req.params.id || 'list',
            ipAddress: req.ip || req.socket.remoteAddress || '',
            userAgent: req.headers['user-agent'] || '',
            status: res.statusCode >= 400 ? 'failed' : 'success',
          })
        } catch (error) {
          console.error('记录合规日志失败', error)
        }
      }
    })

    next()
  }

  private getActionType(method: string): string {
    const actionMap: Record<string, string> = {
      GET: 'view',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    }
    return actionMap[method] || 'unknown'
  }

  private getResourceType(path: string): string {
    const parts = path.split('/').filter(Boolean)
    return parts[parts.length - 2] || 'unknown'
  }
}

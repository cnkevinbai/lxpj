/**
 * 租户上下文服务
 * 使用 AsyncLocalStorage 实现请求级别的租户隔离
 */
import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'

interface TenantContext {
  tenantId: string
  userId?: string
}

@Injectable()
export class TenantContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>()

  /**
   * 设置当前租户上下文
   */
  setTenant(tenantId: string, userId?: string): void {
    const store = this.asyncLocalStorage.getStore() || {}
    Object.assign(store, { tenantId, userId })
    this.asyncLocalStorage.enterWith(store as TenantContext)
  }

  /**
   * 获取当前租户ID
   */
  getTenantId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.tenantId
  }

  /**
   * 获取当前用户ID
   */
  getUserId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.userId
  }

  /**
   * 在租户上下文中运行回调
   */
  run<T>(tenantId: string, callback: () => T, userId?: string): T {
    return this.asyncLocalStorage.run({ tenantId, userId }, callback)
  }

  /**
   * 清除租户上下文
   */
  clear(): void {
    this.asyncLocalStorage.enterWith({} as TenantContext)
  }
}

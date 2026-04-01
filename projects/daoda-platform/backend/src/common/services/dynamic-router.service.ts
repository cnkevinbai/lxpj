/**
 * 动态路由注册服务
 * 支持模块动态注册/注销路由
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Injectable } from '@nestjs/common'
import { ModuleRoute, HttpMethod } from '../../core/module/interfaces'

interface RegisteredRoute {
  moduleId: string
  route: ModuleRoute
  registeredAt: Date
}

@Injectable()
export class DynamicRouterService {
  private routes: Map<string, RegisteredRoute[]> = new Map()
  private routeIndex: Map<string, RegisteredRoute> = new Map()

  /**
   * 注册模块路由
   */
  register(moduleId: string, routes: ModuleRoute[]): void {
    const registered: RegisteredRoute[] = []

    for (const route of routes) {
      const key = this.createRouteKey(route)
      const existing = this.routeIndex.get(key)

      if (existing) {
        console.warn(`Route ${key} already registered by ${existing.moduleId}, skipping`)
        continue
      }

      const registeredRoute: RegisteredRoute = {
        moduleId,
        route,
        registeredAt: new Date(),
      }

      registered.push(registeredRoute)
      this.routeIndex.set(key, registeredRoute)
    }

    this.routes.set(moduleId, registered)
    console.log(`Module ${moduleId} registered ${registered.length} routes`)
  }

  /**
   * 注销模块路由
   */
  unregister(moduleId: string): void {
    const routes = this.routes.get(moduleId)

    if (routes) {
      for (const reg of routes) {
        const key = this.createRouteKey(reg.route)
        this.routeIndex.delete(key)
      }
      this.routes.delete(moduleId)
      console.log(`Module ${moduleId} unregistered all routes`)
    }
  }

  /**
   * 获取模块路由列表
   */
  getModuleRoutes(moduleId: string): RegisteredRoute[] {
    return this.routes.get(moduleId) || []
  }

  /**
   * 获取所有路由
   */
  getAllRoutes(): RegisteredRoute[] {
    return Array.from(this.routeIndex.values())
  }

  /**
   * 检查路由是否已注册
   */
  isRegistered(path: string, method: HttpMethod): boolean {
    const key = `${method}:${path}`
    return this.routeIndex.has(key)
  }

  /**
   * 查找路由对应的模块
   */
  findModule(path: string, method: HttpMethod): string | null {
    const key = `${method}:${path}`
    const reg = this.routeIndex.get(key)
    return reg?.moduleId || null
  }

  /**
   * 创建路由键
   */
  private createRouteKey(route: ModuleRoute): string {
    return `${route.method}:${route.path}`
  }

  /**
   * 获取路由统计
   */
  getStats(): {
    totalRoutes: number
    moduleCount: number
    routesByModule: Record<string, number>
  } {
    const routesByModule: Record<string, number> = {}

    for (const [moduleId, routes] of this.routes) {
      routesByModule[moduleId] = routes.length
    }

    return {
      totalRoutes: this.routeIndex.size,
      moduleCount: this.routes.size,
      routesByModule,
    }
  }
}

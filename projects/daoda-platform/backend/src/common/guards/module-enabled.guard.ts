import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common'
import { ModuleConfigService } from '../../modules/module-config/module-config.service'

/**
 * 模块启用守卫
 * 检查请求对应的模块是否已启用
 */
@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  private readonly logger = new Logger(ModuleEnabledGuard.name)

  // URL 路径到模块代码的映射（复数 → 单数）
  private readonly pathToModuleMap: Record<string, string> = {
    // CRM 模块
    customers: 'customer',
    leads: 'lead',
    opportunities: 'opportunity',
    orders: 'order',
    quotations: 'quotation',
    
    // ERP 模块
    products: 'product',
    inventory: 'inventory',
    purchase: 'purchase',
    purchases: 'purchase',
    'purchase-orders': 'purchase',
    production: 'production',
    'production-orders': 'production',
    bom: 'production',
    'production-plans': 'production',
    
    // Finance 模块
    invoices: 'invoice',
    receivables: 'receivable',
    payables: 'payable',
    
    // HR 模块
    employees: 'employee',
    attendance: 'attendance',
    salary: 'salary',
    
    // Service 模块 (嵌套路径)
    'service/tickets': 'service',
    'service/contracts': 'service',
    'service/parts': 'service',
    
    // 兼容旧路径
    tickets: 'service',
    contracts: 'service',
    parts: 'service',
    
    // CMS 模块
    news: 'cms',
    cases: 'cms',
    videos: 'cms',
    
    // Settings 模块
    users: 'user',
    roles: 'auth',
    tenants: 'tenants',
    menus: 'auth',
    'module-configs': 'module-configs',
    'api-keys': 'auth',
    webhooks: 'auth',
    logs: 'auth',
    'system-configs': 'auth',
    system: 'auth',
    
    // Auth 模块
    auth: 'auth',
    login: 'auth',
  }

  // 不需要检查模块启用状态的路径
  private readonly bypassPaths = [
    '/api/v1/auth',
    '/api/v1/login',
    '/api/v1/public',
    '/api/v1/module-configs',
    '/api/v1/tenants',
    '/api/v1/health',
    '/api/docs',
  ]

  constructor(private moduleConfigService: ModuleConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const path = request.route?.path || request.url

    // 检查是否在绕过列表中
    for (const bypassPath of this.bypassPaths) {
      if (path.startsWith(bypassPath)) {
        return true
      }
    }

    const moduleCode = this.extractModuleCode(path)

    if (!moduleCode) return true

    // 映射到实际的模块代码
    const actualModuleCode = this.pathToModuleMap[moduleCode] || moduleCode

    try {
      const config = await this.moduleConfigService.findByCode(actualModuleCode)

      if (!config || !config.enabled) {
        throw new ForbiddenException(`模块 ${actualModuleCode} 未启用`)
      }

      return true
    } catch (error) {
      // 如果模块配置不存在，默认放行（让具体的业务逻辑处理）
      if (error.message?.includes('配置不存在')) {
        this.logger.warn(`模块配置不存在: ${actualModuleCode}，路径: ${path}`)
        return true
      }
      throw error
    }
  }

  /**
   * 从路径中提取模块代码
   * 支持单层路径 (如 /api/v1/customers) 和嵌套路径 (如 /api/v1/service/tickets)
   */
  private extractModuleCode(path: string): string | null {
    // 先尝试匹配嵌套路径 /api/v1/xxx/yyy
    const nestedMatch = path.match(/\/api\/v1\/([a-z]+\/[a-z-]+)/)
    if (nestedMatch) {
      return nestedMatch[1]
    }
    
    // 再尝试匹配单层路径 /api/v1/xxx
    const singleMatch = path.match(/\/api\/v1\/([a-z-]+)/)
    return singleMatch ? singleMatch[1] : null
  }
}
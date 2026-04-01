import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { moduleConfigService, ModuleConfig } from '../services/module-config.service'

interface ModuleState {
  modules: ModuleConfig[]
  enabledModules: string[]
  loading: boolean
  fetchModules: () => Promise<void>
  isModuleEnabled: (code: string) => boolean
  toggleModule: (code: string, enabled: boolean) => Promise<void>
}

// 菜单模块代码映射（后端模块代码 -> 菜单模块代码）
const MODULE_CODE_MAP: Record<string, string> = {
  // CRM 相关模块映射到 crm
  customer: 'crm',
  lead: 'crm',
  opportunity: 'crm',
  order: 'crm',
  quotation: 'crm',
  // ERP 相关模块映射到 erp
  product: 'erp',
  inventory: 'erp',
  production: 'erp',
  purchase: 'erp',
  // 财务相关模块映射到 finance
  invoice: 'finance',
  receivable: 'finance',
  payable: 'finance',
  // HR 相关模块映射到 hr
  employee: 'hr',
  attendance: 'hr',
  salary: 'hr',
  // 服务模块
  service: 'service',
  // 系统设置
  tenants: 'settings',
  'module-configs': 'settings',
}

// 默认启用的菜单模块
const DEFAULT_ENABLED_MODULES = ['crm', 'erp', 'finance', 'service', 'hr', 'workflow', 'notification', 'settings']

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: [],
      enabledModules: DEFAULT_ENABLED_MODULES,
      loading: false,

      fetchModules: async () => {
        set({ loading: true })
        try {
          const modules = await moduleConfigService.getAll()
          
          // 将后端模块代码映射到菜单模块代码
          const menuModules = new Set<string>()
          modules.forEach(m => {
            if (m.enabled) {
              const menuCode = MODULE_CODE_MAP[m.moduleCode]
              if (menuCode) {
                menuModules.add(menuCode)
              }
            }
          })
          
          // 如果没有映射到任何菜单模块，使用默认值
          const enabledModules = menuModules.size > 0 
            ? Array.from(menuModules) 
            : DEFAULT_ENABLED_MODULES
          
          set({ modules, enabledModules, loading: false })
        } catch (error) {
          console.error('Failed to fetch modules:', error)
          // 出错时使用默认值
          set({ 
            enabledModules: DEFAULT_ENABLED_MODULES, 
            loading: false 
          })
        }
      },

      isModuleEnabled: (code: string) => {
        return get().enabledModules.includes(code)
      },

      toggleModule: async (code: string, enabled: boolean) => {
        await moduleConfigService.toggle(code, enabled)
        const enabledModules = enabled
          ? [...get().enabledModules, code]
          : get().enabledModules.filter(m => m !== code)
        set({ enabledModules })
      },
    }),
    {
      name: 'module-storage',
    }
  )
)

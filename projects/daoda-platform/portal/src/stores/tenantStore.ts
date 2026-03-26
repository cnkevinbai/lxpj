import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tenantService, Tenant } from '../services/tenant.service'

interface TenantState {
  currentTenant: Tenant | null
  tenants: Tenant[]
  loading: boolean
  
  setCurrentTenant: (tenant: Tenant | null) => void
  fetchTenants: () => Promise<void>
  switchTenant: (tenantId: string) => Promise<void>
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      tenants: [],
      loading: false,

      setCurrentTenant: (tenant) => {
        set({ currentTenant: tenant })
        // 设置请求头
        if (tenant) {
          localStorage.setItem('x-tenant-id', tenant.id)
        } else {
          localStorage.removeItem('x-tenant-id')
        }
      },

      fetchTenants: async () => {
        set({ loading: true })
        try {
          const tenants = await tenantService.getAll()
          set({ tenants, loading: false })
          
          // 如果没有当前租户，设置第一个
          if (!get().currentTenant && tenants.length > 0) {
            get().setCurrentTenant(tenants[0])
          }
        } catch (error) {
          console.error('Failed to fetch tenants:', error)
          set({ loading: false })
        }
      },

      switchTenant: async (tenantId: string) => {
        const tenant = get().tenants.find(t => t.id === tenantId)
        if (tenant) {
          get().setCurrentTenant(tenant)
          window.location.reload() // 刷新页面以加载新租户数据
        }
      },
    }),
    {
      name: 'tenant-storage',
    }
  )
)

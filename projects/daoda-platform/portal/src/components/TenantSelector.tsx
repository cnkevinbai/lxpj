import { Select } from 'antd'
import { useTenantStore } from '../stores/tenantStore'

export function TenantSelector() {
  const { currentTenant, tenants, switchTenant } = useTenantStore()

  return (
    <Select
      value={currentTenant?.id}
      onChange={switchTenant}
      style={{ width: 200 }}
      options={tenants.map(t => ({
        label: t.name,
        value: t.id,
      }))}
      placeholder="选择租户"
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  )
}

import request from '@/utils/request'

// 查询库存
export const getStock = async (materialId?: string, warehouseId?: string) => {
  return request.get('/api/v1/integration/erp/inventory/stock', {
    params: { material_id: materialId, warehouse_id: warehouseId },
  })
}

// 按物料查询库存
export const getStockByMaterial = async (materialId: string) => {
  return request.get('/api/v1/integration/erp/inventory/stock', {
    params: { material_id: materialId },
  })
}

// 库存预警列表
export const getInventoryWarnings = async () => {
  return request.get('/api/v1/integration/erp/inventory/warnings')
}

// 可用量检查
export const checkAvailability = async (items: Array<{ material_id: string; quantity: number }>) => {
  return request.post('/api/v1/integration/erp/inventory/check-availability', { items })
}

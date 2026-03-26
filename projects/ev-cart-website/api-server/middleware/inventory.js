/**
 * 库存检查中间件 - 检查库存是否充足
 */

// 检查库存
const checkInventory = async (productId, quantity) => {
  // TODO: 从库存管理系统查询实际库存
  // const response = await fetch(`/api/v1/inventory/${productId}`)
  // const stock = await response.json()

  // 模拟库存数据
  const mockStock = {
    '1': { available: 150, reserved: 20 },
    '2': { available: 200, reserved: 30 },
    '3': { available: 500, reserved: 50 },
    '4': { available: 300, reserved: 40 },
    '5': { available: 999, reserved: 0 },
    '6': { available: 1000, reserved: 100 },
  }

  const stock = mockStock[productId] || { available: 0, reserved: 0 }

  if (stock.available >= quantity) {
    return {
      sufficient: true,
      available: stock.available,
      message: '库存充足',
    }
  }

  return {
    sufficient: false,
    available: stock.available,
    message: `库存不足，当前库存：${stock.available}`,
  }
}

// 库存不足时创建生产计划
const createProductionPlan = async (productId, quantity) => {
  console.log(`🏭 库存不足，创建生产计划：产品${productId} 数量${quantity}`)

  const productionPlan = {
    id: `PP${Date.now()}`,
    productId,
    quantity,
    status: 'planned',
    createTime: new Date().toISOString(),
  }

  // TODO: 调用生产管理系统 API 创建生产计划

  return productionPlan
}

module.exports = {
  checkInventory,
  createProductionPlan,
}

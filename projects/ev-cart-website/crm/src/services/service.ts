import request from '@/utils/request'

// 创建服务请求
export const create = async (data: any) => {
  return request.post('/api/v1/crm/service-requests', data)
}

// 获取服务请求列表
export const getList = async (customerId?: string) => {
  return request.get('/api/v1/crm/service-requests', {
    params: { customer_id: customerId },
  })
}

// 获取服务请求详情
export const getDetail = async (id: string) => {
  return request.get(`/api/v1/crm/service-requests/${id}`)
}

// 更新服务状态
export const updateStatus = async (id: string, status: string) => {
  return request.put(`/api/v1/crm/service-requests/${id}/status`, { status })
}

// 服务记录同步 ERP
export const syncToErp = async (data: any) => {
  return request.post('/api/v1/integration/erp/service-sync', data)
}

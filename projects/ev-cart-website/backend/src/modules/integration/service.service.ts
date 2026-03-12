import { Injectable } from '@nestjs/common'

@Injectable()
export class ServiceService {
  private services: any[] = []

  async createServiceRequest(data: any): Promise<any> {
    const service = {
      id: `SR-${Date.now()}`,
      request_no: `SR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    this.services.push(service)

    return {
      success: true,
      message: '服务请求创建成功',
      data: service,
    }
  }

  async getServiceRequests(customerId?: string): Promise<any> {
    let services = this.services
    if (customerId) {
      services = services.filter(s => s.customer_id === customerId)
    }
    return services
  }

  async getServiceRequest(id: string): Promise<any> {
    return this.services.find(s => s.id === id) || null
  }

  async updateServiceStatus(id: string, status: string): Promise<any> {
    const service = this.services.find(s => s.id === id)
    if (service) {
      service.status = status
      return { success: true, message: '状态更新成功' }
    }
    return { success: false, message: '服务请求不存在' }
  }

  async syncServiceToErp(data: any): Promise<any> {
    // 同步服务记录到 ERP
    return {
      success: true,
      message: '服务记录同步成功',
      data,
    }
  }
}

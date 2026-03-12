import { Injectable } from '@nestjs/common'

@Injectable()
export class ContractService {
  private contracts: any[] = []

  async createContract(data: any): Promise<any> {
    const contract = {
      id: `CT-${Date.now()}`,
      contract_no: `CT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...data,
      status: 'draft',
      created_at: new Date().toISOString(),
    }

    this.contracts.push(contract)

    return {
      success: true,
      message: '合同创建成功',
      data: contract,
    }
  }

  async getContracts(orderId?: string): Promise<any> {
    let contracts = this.contracts
    if (orderId) {
      contracts = contracts.filter(c => c.order_id === orderId)
    }
    return contracts
  }

  async getContract(id: string): Promise<any> {
    const contract = this.contracts.find(c => c.id === id)
    return contract || null
  }

  async syncContractToErp(data: any): Promise<any> {
    // 同步合同到 ERP
    return {
      success: true,
      message: '合同同步成功',
      data,
    }
  }
}

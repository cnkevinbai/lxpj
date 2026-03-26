/**
 * 终端服务
 */
import type { Terminal } from '@/types'

// 查询参数
interface TerminalQuery {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}

// 列表响应
interface TerminalListResponse {
  list: Terminal[]
  total: number
}

/**
 * 获取终端列表
 */
export async function getTerminals(params: TerminalQuery = {}): Promise<TerminalListResponse> {
  // 模拟数据
  const mockTerminals: Terminal[] = [
    { 
      id: '1', 
      terminalId: '13800001111', 
      vehicleNo: '川A12345', 
      deviceModel: 'DAOD-TBOX-001', 
      status: 'online', 
      signalStrength: 3, 
      lastCommunicationTime: '2026-03-25 18:50:32',
      lastSeen: '2026-03-25 18:50:32',
      location: { lat: 30.123, lng: 103.845 }, 
      address: '成都市高新区', 
      createTime: '2026-01-15 10:30:00', 
      updateTime: '2026-03-25 18:50:32' 
    },
    { 
      id: '2', 
      terminalId: '13800002222', 
      vehicleNo: '川B67890', 
      deviceModel: 'DAOD-TBOX-001', 
      status: 'online', 
      signalStrength: 2, 
      lastCommunicationTime: '2026-03-25 18:45:18',
      lastSeen: '2026-03-25 18:45:18',
      location: { lat: 30.234, lng: 103.956 }, 
      address: '眉山市东坡区', 
      createTime: '2026-01-16 09:20:00', 
      updateTime: '2026-03-25 18:45:18' 
    },
    { 
      id: '3', 
      terminalId: '13800003333', 
      vehicleNo: '川C11111', 
      deviceModel: 'DAOD-TBOX-002', 
      status: 'offline', 
      signalStrength: 0, 
      lastCommunicationTime: '2026-03-25 09:30:00',
      lastSeen: '2026-03-25 09:30:00',
      location: { lat: 30.345, lng: 104.067 }, 
      address: '乐山市市中区', 
      createTime: '2026-01-17 14:15:00', 
      updateTime: '2026-03-25 09:30:00' 
    },
    { 
      id: '4', 
      terminalId: '13800004444', 
      vehicleNo: '川D22222', 
      deviceModel: 'DAOD-TBOX-001', 
      status: 'sleep', 
      signalStrength: 1, 
      lastCommunicationTime: '2026-03-25 15:45:12',
      lastSeen: '2026-03-25 15:45:12',
      location: { lat: 30.456, lng: 104.178 }, 
      address: '雅安市雨城区', 
      createTime: '2026-01-18 11:00:00', 
      updateTime: '2026-03-25 15:45:12' 
    },
    { 
      id: '5', 
      terminalId: '13800005555', 
      vehicleNo: '川E33333', 
      deviceModel: 'DAOD-TBOX-001', 
      status: 'online', 
      signalStrength: 4, 
      lastCommunicationTime: '2026-03-25 18:56:01',
      lastSeen: '2026-03-25 18:56:01',
      location: { lat: 30.567, lng: 104.289 }, 
      address: '成都市武侯区', 
      createTime: '2026-01-19 16:30:00', 
      updateTime: '2026-03-25 18:56:01' 
    },
  ]
  
  let filtered = [...mockTerminals]
  
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(t => 
      t.terminalId.toLowerCase().includes(kw) || 
      (t.vehicleNo && t.vehicleNo.toLowerCase().includes(kw))
    )
  }
  
  if (params.status) {
    filtered = filtered.filter(t => t.status === params.status)
  }
  
  return {
    list: filtered,
    total: filtered.length,
  }
}

/**
 * 获取终端详情
 */
export async function getTerminalDetail(id: string): Promise<Terminal> {
  // 模拟数据
  return {
    id,
    terminalId: '13800001111',
    vehicleNo: '川A12345',
    deviceModel: 'DAOD-TBOX-001',
    status: 'online',
    signalStrength: 3,
    lastCommunicationTime: '2026-03-25 18:50:32',
    lastSeen: '2026-03-25 18:50:32',
    location: { lat: 30.123456, lng: 103.845678 },
    address: '成都市高新区天府大道',
    speed: 45,
    direction: 90,
    batteryLevel: 80,
    temperature: 35,
    mileage: 12345,
    soc: 75,
    registerTime: '2026-01-15 10:30:00',
    activateTime: '2026-01-15 10:35:00',
    createTime: '2026-01-15 10:30:00',
    updateTime: '2026-03-25 18:50:32',
  }
}

/**
 * 发送指令
 */
export async function sendCommand(terminalId: string, command: string, params: any): Promise<void> {
  // 模拟发送
  console.log('发送指令:', terminalId, command, params)
  return Promise.resolve()
}

/**
 * 获取终端统计
 */
export async function getTerminalStats() {
  return {
    total: 5,
    online: 3,
    offline: 1,
    sleep: 1,
  }
}
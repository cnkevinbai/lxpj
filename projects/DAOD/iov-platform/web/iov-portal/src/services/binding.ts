/**
 * 设备绑定服务
 * 
 * @description 设备绑定相关的 API 调用，支持三种协议 (JT/T 808、MQTT、HTTP)
 * @author 渔晓白
 * @version 1.0.0
 */

import { request } from './api';
import type {
  DeviceBinding,
  BindDeviceRequest,
  BindDeviceResponse,
  BindingEvent,
  BindingStatistics,
  BindingQueryParams,
  BindingListResponse,
  BindingEventListResponse,
  PendingTerminal,
  PendingTerminalQueryParams,
  DeviceShadow,
} from '@/types/binding';

// ==================== 待绑定终端 ====================

/**
 * 获取待绑定终端列表
 */
export async function getPendingTerminals(
  params: PendingTerminalQueryParams = {}
): Promise<{ list: PendingTerminal[]; total: number }> {
  // TODO: 替换为实际 API
  // return request.get('/terminal/pending', params);
  
  // 模拟数据
  const mockTerminals: PendingTerminal[] = [
    {
      id: '1',
      terminalId: '13800001111',
      iccid: '89860000000000000001',
      deviceModel: 'DAOD-TBOX-001',
      protocol: 'JTT808',
      firmwareVersion: 'v1.2.3',
      connectIp: '192.168.1.100',
      connectTime: '2026-03-26 10:00:00',
      lastHeartbeat: '2026-03-26 10:25:00',
      status: 'pending',
    },
    {
      id: '2',
      terminalId: '13800002222',
      iccid: '89860000000000000002',
      deviceModel: 'DAOD-TBOX-002',
      protocol: 'JTT808',
      firmwareVersion: 'v1.2.0',
      connectIp: '192.168.1.101',
      connectTime: '2026-03-26 09:30:00',
      lastHeartbeat: '2026-03-26 10:20:00',
      status: 'pending',
    },
    {
      id: '3',
      terminalId: 'terminal_13800003333',
      deviceModel: 'DAOD-IOT-001',
      protocol: 'MQTT',
      firmwareVersion: 'v2.0.1',
      connectIp: '192.168.1.102',
      connectTime: '2026-03-26 08:00:00',
      lastHeartbeat: '2026-03-26 10:15:00',
      status: 'pending',
    },
    {
      id: '4',
      terminalId: 'HTTP_001',
      deviceModel: 'DAOD-LITE-001',
      protocol: 'HTTP',
      connectTime: '2026-03-26 07:00:00',
      lastHeartbeat: '2026-03-26 10:00:00',
      status: 'pending',
    },
  ];

  let filtered = [...mockTerminals];

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.terminalId.toLowerCase().includes(kw) ||
        (t.deviceModel && t.deviceModel.toLowerCase().includes(kw))
    );
  }

  if (params.protocol) {
    filtered = filtered.filter((t) => t.protocol === params.protocol);
  }

  if (params.status) {
    filtered = filtered.filter((t) => t.status === params.status);
  }

  return {
    list: filtered,
    total: filtered.length,
  };
}

// ==================== 设备绑定操作 ====================

/**
 * 绑定设备到车辆
 */
export async function bindDevice(
  terminalId: string,
  data: BindDeviceRequest
): Promise<BindDeviceResponse> {
  // TODO: 替换为实际 API
  // return request.post(`/terminal/${terminalId}/register`, data);
  
  console.log('绑定设备:', terminalId, data);
  
  return {
    success: true,
    message: '绑定成功',
    data: {
      bindingId: `BIND_${Date.now()}`,
      deviceId: terminalId,
      vin: data.vin,
      status: 'BOUND',
      protocol: 'JTT808',
      deviceModel: data.deviceModel,
      simNumber: data.simNumber,
      bindTime: new Date().toISOString(),
      retryCount: 0,
    },
  };
}

/**
 * 解绑设备
 */
export async function unbindDevice(
  bindingId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  // TODO: 替换为实际 API
  // return request.delete(`/binding/${bindingId}`, { reason });
  
  console.log('解绑设备:', bindingId, reason);
  
  return {
    success: true,
    message: '解绑成功',
  };
}

/**
 * 获取绑定详情
 */
export async function getBindingDetail(bindingId: string): Promise<DeviceBinding> {
  // TODO: 替换为实际 API
  // return request.get(`/binding/${bindingId}`);
  
  return {
    bindingId,
    deviceId: '13800001111',
    vin: 'LDA1234567890ABCD',
    status: 'BOUND',
    protocol: 'JTT808',
    deviceModel: 'DAOD-TBOX-001',
    simNumber: '13800001111',
    bindTime: '2026-03-26 10:00:00',
    lastConfirmTime: '2026-03-26 10:25:00',
    retryCount: 0,
  };
}

/**
 * 通过设备ID获取绑定信息
 */
export async function getBindingByDeviceId(deviceId: string): Promise<DeviceBinding | null> {
  // TODO: 替换为实际 API
  // return request.get(`/binding/device/${deviceId}`);
  
  return null;
}

/**
 * 通过VIN获取绑定信息
 */
export async function getBindingByVin(vin: string): Promise<DeviceBinding | null> {
  // TODO: 替换为实际 API
  // return request.get(`/binding/vin/${vin}`);
  
  return null;
}

/**
 * 获取绑定列表
 */
export async function getBindings(
  params: BindingQueryParams = {}
): Promise<BindingListResponse> {
  // TODO: 替换为实际 API
  // return request.get('/bindings', params);
  
  const mockBindings: DeviceBinding[] = [
    {
      bindingId: 'BIND_001',
      deviceId: '13800003333',
      vin: 'LDA1234567890ABCD',
      tenantId: 'T001',
      status: 'BOUND',
      protocol: 'JTT808',
      deviceModel: 'DAOD-TBOX-001',
      simNumber: '13800003333',
      bindTime: '2026-03-25 16:25:00',
      lastConfirmTime: '2026-03-26 10:20:00',
      retryCount: 0,
    },
    {
      bindingId: 'BIND_002',
      deviceId: '13800004444',
      vin: 'LDA1234567890ABCE',
      tenantId: 'T001',
      status: 'BOUND',
      protocol: 'MQTT',
      deviceModel: 'DAOD-IOT-001',
      bindTime: '2026-03-24 10:30:00',
      lastConfirmTime: '2026-03-26 10:15:00',
      retryCount: 0,
    },
    {
      bindingId: 'BIND_003',
      deviceId: 'HTTP_002',
      vin: 'LDA1234567890ABCF',
      tenantId: 'T001',
      status: 'PENDING_RECOVER',
      protocol: 'HTTP',
      deviceModel: 'DAOD-LITE-001',
      bindTime: '2026-03-20 08:00:00',
      lastConfirmTime: '2026-03-25 18:00:00',
      retryCount: 1,
    },
  ];

  return {
    list: mockBindings,
    total: mockBindings.length,
    page: params.page || 1,
    pageSize: params.pageSize || 20,
  };
}

// ==================== 绑定事件 ====================

/**
 * 获取绑定事件历史
 */
export async function getBindingEvents(
  bindingId: string,
  limit: number = 20
): Promise<BindingEventListResponse> {
  // TODO: 替换为实际 API
  // return request.get(`/binding/${bindingId}/events`, { limit });
  
  const mockEvents: BindingEvent[] = [
    {
      eventId: 'EVT_001',
      bindingId,
      deviceId: '13800001111',
      vin: 'LDA1234567890ABCD',
      eventType: 'BIND_SUCCESS',
      eventTime: '2026-03-26 10:00:00',
      protocol: 'JTT808',
      success: true,
      retryCount: 0,
    },
    {
      eventId: 'EVT_002',
      bindingId,
      deviceId: '13800001111',
      vin: 'LDA1234567890ABCD',
      eventType: 'AUTH_SUCCESS',
      eventTime: '2026-03-26 10:00:05',
      protocol: 'JTT808',
      success: true,
      retryCount: 0,
    },
    {
      eventId: 'EVT_003',
      bindingId,
      deviceId: '13800001111',
      vin: 'LDA1234567890ABCD',
      eventType: 'DEVICE_ONLINE',
      eventTime: '2026-03-26 10:25:00',
      protocol: 'JTT808',
      success: true,
      retryCount: 0,
    },
  ];

  return {
    list: mockEvents,
    total: mockEvents.length,
  };
}

// ==================== 绑定统计 ====================

/**
 * 获取绑定统计信息
 */
export async function getBindingStatistics(
  tenantId?: string
): Promise<BindingStatistics> {
  // TODO: 替换为实际 API
  // return request.get('/binding/statistics', { tenantId });
  
  return {
    totalBindings: 156,
    onlineDevices: 142,
    offlineDevices: 14,
    jtt808Bindings: 100,
    mqttBindings: 40,
    httpBindings: 16,
    pendingBindings: 5,
    errorBindings: 2,
    todayNewBindings: 8,
    todayUnbindings: 1,
    successRate: 99.2,
    avgBindDuration: 150,
  };
}

// ==================== 设备影子 (MQTT) ====================

/**
 * 获取设备影子
 */
export async function getDeviceShadow(terminalId: string): Promise<DeviceShadow | null> {
  // TODO: 替换为实际 API
  // return request.get(`/shadow/${terminalId}`);
  
  return {
    terminalId,
    connected: true,
    connectTime: '2026-03-26 08:00:00',
    protocol: 'MQTT',
    deviceModel: 'DAOD-IOT-001',
    firmwareVersion: 'v2.0.1',
    reported: {
      vehicleStatus: 'RUNNING',
      batteryLevel: 85,
      soc: 75,
      speed: 45,
    },
    reportedVersion: 10,
    desired: {
      maxSpeed: 60,
    },
    desiredVersion: 2,
    lastReportTime: '2026-03-26 10:20:00',
  };
}

/**
 * 更新设备影子期望状态
 */
export async function updateDeviceShadowDesired(
  terminalId: string,
  desired: Record<string, any>
): Promise<{ success: boolean }> {
  // TODO: 替换为实际 API
  // return request.put(`/shadow/${terminalId}/desired`, desired);
  
  console.log('更新设备影子:', terminalId, desired);
  
  return { success: true };
}
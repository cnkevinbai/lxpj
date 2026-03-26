/**
 * 设备绑定类型定义
 * 
 * @description 设备与车辆绑定的核心类型，支持三种协议 (JT/T 808、MQTT、HTTP)
 * @author 渔晓白
 * @version 1.0.0
 */

// ==================== 协议类型 ====================

/** 协议类型 */
export type ProtocolType = 'JTT808' | 'MQTT' | 'HTTP';

/** 协议配置 */
export const ProtocolConfig: Record<ProtocolType, { 
  label: string; 
  color: string; 
  defaultPort: number;
  isLongConnection: boolean;
}> = {
  JTT808: { label: 'JT/T 808', color: 'blue', defaultPort: 8808, isLongConnection: true },
  MQTT: { label: 'MQTT', color: 'green', defaultPort: 1883, isLongConnection: true },
  HTTP: { label: 'HTTP', color: 'orange', defaultPort: 8080, isLongConnection: false },
};

// ==================== 绑定状态 ====================

/** 绑定状态 */
export type BindingStatus = 
  | 'PENDING'         // 待确认
  | 'BOUND'           // 已绑定
  | 'UNBOUND'         // 已解绑
  | 'EXPIRED'         // 已过期
  | 'PENDING_RECOVER' // 待恢复
  | 'ERROR';          // 异常

/** 绑定状态配置 */
export const BindingStatusConfig: Record<BindingStatus, { 
  label: string; 
  color: string;
  badge: 'success' | 'processing' | 'default' | 'error' | 'warning';
}> = {
  PENDING: { label: '待确认', color: 'processing', badge: 'processing' },
  BOUND: { label: '已绑定', color: 'success', badge: 'success' },
  UNBOUND: { label: '已解绑', color: 'default', badge: 'default' },
  EXPIRED: { label: '已过期', color: 'warning', badge: 'warning' },
  PENDING_RECOVER: { label: '待恢复', color: 'warning', badge: 'warning' },
  ERROR: { label: '异常', color: 'error', badge: 'error' },
};

// ==================== 设备绑定 ====================

/** 设备绑定信息 */
export interface DeviceBinding {
  bindingId: string;
  deviceId: string;
  vin: string;
  tenantId?: string;
  status: BindingStatus;
  protocol: ProtocolType;
  deviceType?: string;
  deviceModel?: string;
  simNumber?: string;
  iccid?: string;
  bindTime: string;
  lastConfirmTime?: string;
  expireTime?: string;
  authCode?: string;
  authCodeExpireTime?: string;
  retryCount: number;
  attributes?: Record<string, string>;
}

/** 绑定请求 */
export interface BindDeviceRequest {
  terminalId: string;
  vin: string;
  deviceType?: string;
  deviceModel?: string;
  simNumber?: string;
  installLocation?: string;
  remark?: string;
}

/** 绑定响应 */
export interface BindDeviceResponse {
  success: boolean;
  message: string;
  data?: DeviceBinding;
}

// ==================== 绑定事件 ====================

/** 绑定事件类型 */
export type BindingEventType = 
  | 'BIND_REQUEST'    // 绑定请求
  | 'BIND_SUCCESS'    // 绑定成功
  | 'BIND_FAILURE'    // 绑定失败
  | 'UNBIND_REQUEST'  // 解绑请求
  | 'UNBIND_SUCCESS'  // 解绑成功
  | 'BIND_RECOVERED'  // 绑定恢复
  | 'BIND_EXPIRED'    // 绑定过期
  | 'DEVICE_ONLINE'   // 设备上线
  | 'DEVICE_OFFLINE'  // 设备离线
  | 'AUTH_SUCCESS'    // 认证成功
  | 'AUTH_FAILURE';   // 认证失败

/** 绑定事件 */
export interface BindingEvent {
  eventId: string;
  bindingId: string;
  deviceId: string;
  vin: string;
  eventType: BindingEventType;
  eventTime: string;
  protocol: ProtocolType;
  success: boolean;
  errorMessage?: string;
  errorCode?: string;
  retryCount: number;
  clientIp?: string;
  extraInfo?: string;
}

// ==================== 绑定统计 ====================

/** 绑定统计信息 */
export interface BindingStatistics {
  totalBindings: number;
  onlineDevices: number;
  offlineDevices: number;
  jtt808Bindings: number;
  mqttBindings: number;
  httpBindings: number;
  pendingBindings: number;
  errorBindings: number;
  todayNewBindings: number;
  todayUnbindings: number;
  successRate: number;
  avgBindDuration: number;
}

// ==================== 设备影子 (MQTT) ====================

/** 设备影子 */
export interface DeviceShadow {
  terminalId: string;
  connected: boolean;
  connectTime?: string;
  disconnectTime?: string;
  protocol?: ProtocolType;
  deviceModel?: string;
  firmwareVersion?: string;
  reported?: Record<string, any>;
  reportedVersion: number;
  desired?: Record<string, any>;
  desiredVersion: number;
  lastReportTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== 待绑定终端 ====================

/** 待绑定终端 */
export interface PendingTerminal {
  id: string;
  terminalId: string;
  iccid?: string;
  deviceModel?: string;
  protocol: ProtocolType;
  firmwareVersion?: string;
  connectIp?: string;
  connectTime: string;
  lastHeartbeat?: string;
  status: 'pending' | 'bound' | 'rejected';
  vin?: string;
  tenantId?: string;
}

/** 待绑定终端查询参数 */
export interface PendingTerminalQueryParams {
  keyword?: string;
  protocol?: ProtocolType;
  status?: 'pending' | 'bound' | 'rejected';
}

// ==================== API 响应类型 ====================

/** 绑定查询参数 */
export interface BindingQueryParams {
  keyword?: string;
  status?: BindingStatus;
  protocol?: ProtocolType;
  tenantId?: string;
  page?: number;
  pageSize?: number;
}

/** 绑定列表响应 */
export interface BindingListResponse {
  list: DeviceBinding[];
  total: number;
  page: number;
  pageSize: number;
}

/** 绑定事件列表响应 */
export interface BindingEventListResponse {
  list: BindingEvent[];
  total: number;
}
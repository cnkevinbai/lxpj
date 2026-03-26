/**
 * iov-portal 类型定义
 * 
 * @description 定义前端所有核心类型
 * @author daod-team
 * @version 1.0.0
 */

// ==================== 通用类型 ====================

/** 地理坐标点 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** 分页请求参数 */
export interface PageParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API 响应包装 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 时间范围 */
export interface TimeRange {
  startTime: string;
  endTime: string;
}

// ==================== 用户类型 ====================

/** 用户信息 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions?: string[];
  tenantId?: string;
  createdAt?: string;
}

/** 登录请求 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: User;
}

// ==================== 终端类型 ====================

/** 终端状态 */
export type TerminalStatus = 'online' | 'offline' | 'fault' | 'sleep';

/** 终端信息 */
export interface Terminal {
  id: string;
  terminalId: string;          // 终端号
  simCard?: string;            // SIM卡号
  vehicleId?: string;          // 关联车辆ID
  vehicleNo?: string;          // 车牌号
  status: TerminalStatus;
  signalStrength: number;      // 信号强度 0-4
  location?: GeoPoint;
  address?: string;
  speed?: number;              // 速度 km/h
  direction?: number;          // 方向 0-360
  mileage?: number;            // 里程 km
  lastCommunicationTime?: string;
  createTime: string;
  updateTime: string;
  // 额外属性
  deviceModel?: string;        // 设备型号
  firmwareVersion?: string;    // 固件版本
  batteryLevel?: number;       // 电量
  temperature?: number;        // 温度
  soc?: number;                // 荷电状态
  registerTime?: string;       // 注册时间
  activateTime?: string;       // 激活时间
  lastSeen?: string;           // 最后在线时间
  latitude?: number;           // 纬度
  longitude?: number;          // 经度
}

/** 终端查询参数 */
export interface TerminalQueryParams extends PageParams {
  keyword?: string;
  status?: TerminalStatus;
  vehicleNo?: string;
}

/** 终端详情 */
export interface TerminalDetail extends Terminal {
  deviceModel: string;         // 设备型号
  firmwareVersion: string;     // 固件版本
  protocolVersion: string;     // 协议版本
  iccid?: string;              // ICCID
  registerTime: string;        // 注册时间
  heartbeats: TerminalHeartbeat[];
}

/** 终端心跳记录 */
export interface TerminalHeartbeat {
  id: string;
  terminalId: string;
  location: GeoPoint;
  speed: number;
  direction: number;
  signalStrength: number;
  createTime: string;
}

// ==================== 车辆类型 ====================

/** 车辆状态 */
export type VehicleStatus = 'running' | 'stopped' | 'charging' | 'fault' | 'offline';

/** 车辆信息 */
export interface Vehicle {
  id: string;
  vehicleId: string;           // 车辆ID
  vehicleNo: string;           // 车牌号
  vehicleType: string;         // 车辆类型
  brand?: string;              // 品牌
  model?: string;              // 型号
  color?: string;              // 颜色
  status: VehicleStatus;
  terminalId?: string;         // 关联终端
  location?: GeoPoint;
  speed?: number;
  batteryLevel?: number;       // 电量百分比
  mileage?: number;            // 总里程
  createTime: string;
}

/** 车辆查询参数 */
export interface VehicleQueryParams extends PageParams {
  keyword?: string;
  status?: VehicleStatus;
  vehicleType?: string;
}

// ==================== 告警类型 ====================

/** 告警级别 */
export type AlarmLevel = 'critical' | 'major' | 'minor' | 'warning';

/** 告警状态 */
export type AlarmStatus = 'pending' | 'processing' | 'resolved' | 'ignored';

/** 告警类型 */
export type AlarmType = 
  | 'over_speed'           // 超速
  | 'low_battery'          // 低电量
  | 'geo_fence_violation'  // 电子围栏越界
  | 'device_fault'         // 设备故障
  | 'offline'              // 离线
  | 'emergency'            // 紧急报警
  | 'custom';              // 自定义

/** 告警信息 */
export interface Alarm {
  id: string;
  alarmNo: string;             // 告警编号
  type: AlarmType;
  level: AlarmLevel;
  status: AlarmStatus;
  title: string;
  content: string;
  terminalId?: string;
  vehicleId?: string;
  vehicleNo?: string;
  location?: GeoPoint;
  occurTime: string;           // 发生时间
  handleTime?: string;         // 处理时间
  handler?: string;            // 处理人
  handleNote?: string;         // 处理备注
  createTime: string;
}

/** 告警查询参数 */
export interface AlarmQueryParams extends PageParams {
  keyword?: string;
  type?: AlarmType;
  level?: AlarmLevel;
  status?: AlarmStatus;
  timeRange?: TimeRange;
}

// ==================== 地图类型 ====================

/** 地图标记 */
export interface MapMarker {
  id: string;
  position: GeoPoint;
  type: 'terminal' | 'vehicle' | 'alarm' | 'geofence';
  status?: string;
  data: Terminal | Vehicle | Alarm;
}

/** 地图边界 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/** 轨迹点 */
export interface TrajectoryPoint {
  location: GeoPoint;
  speed: number;
  direction: number;
  time: string;
  mileage: number;
}

// ==================== 电子围栏类型 ====================

/** 围栏类型 */
export type GeofenceType = 'circle' | 'polygon' | 'rectangle';

/** 电子围栏 */
export interface Geofence {
  id: string;
  name: string;
  type: GeofenceType;
  coordinates: GeoPoint[];     // 多边形顶点或圆心+边界点
  radius?: number;             // 圆形围栏半径
  status: 'active' | 'inactive';
  alarmType: 'enter' | 'exit' | 'both';
  deviceCount: number;         // 绑定设备数
  createTime: string;
  updateTime: string;
}

// ==================== OTA 类型 ====================

/** 固件信息 */
export interface Firmware {
  id: string;
  version: string;
  name: string;
  deviceModel: string;
  fileSize: number;
  checksum: string;
  description?: string;
  status: 'active' | 'inactive';
  createTime: string;
}

/** OTA 任务状态 */
export type OtaTaskStatus = 
  | 'pending'      // 待执行
  | 'downloading'  // 下载中
  | 'installing'   // 安装中
  | 'success'      // 成功
  | 'failed';      // 失败

/** OTA 任务 */
export interface OtaTask {
  id: string;
  firmwareId: string;
  firmwareVersion: string;
  deviceIds: string[];
  status: OtaTaskStatus;
  totalCount: number;
  successCount: number;
  failedCount: number;
  progress: number;            // 进度百分比
  createTime: string;
  startTime?: string;
  endTime?: string;
}

// ==================== 指令类型 ====================

/** 指令模板 */
export interface CommandTemplate {
  id: string;
  name: string;
  command: string;
  params?: Record<string, any>;
  description?: string;
  createTime: string;
}

/** 指令记录 */
export interface CommandRecord {
  id: string;
  commandId: string;
  commandName: string;
  terminalId: string;
  params?: Record<string, any>;
  status: 'sent' | 'success' | 'failed' | 'timeout';
  response?: string;
  sendTime: string;
  responseTime?: string;
}

// ==================== 模块类型 ====================

/** 模块状态 */
export type ModuleState = 
  | 'uninitialized'
  | 'initialized'
  | 'running'
  | 'stopped'
  | 'error'
  | 'destroyed';

/** 模块健康状态 */
export type ModuleHealthStatus = 
  | 'healthy'
  | 'unhealthy'
  | 'unknown'
  | 'offline';

/** 模块类型 */
export type ModuleType = 'core' | 'business' | 'adapter' | 'extension';

/** 模块信息 */
export interface Module {
  id: string;
  name: string;
  version: string;
  type: ModuleType;
  state: ModuleState;
  healthStatus: ModuleHealthStatus;
  priority: number;
  description: string;
  dependencies?: string[];
  createTime: string;
  updateTime: string;
}

// ==================== WebSocket 类型 ====================

/** WebSocket 事件类型 */
export type WsEventType = 
  | 'terminal_status'      // 终端状态变化
  | 'vehicle_location'     // 车辆位置更新
  | 'alarm'                // 新告警
  | 'ota_progress'         // OTA 进度
  | 'module_state'         // 模块状态变化
  | 'binding_status';      // 绑定状态变化

/** WebSocket 消息 */
export interface WsMessage<T = any> {
  type: WsEventType;
  payload: T;
  timestamp: number;
}

/** WebSocket 连接状态 */
export type WsConnectionState = 
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

// ==================== Dashboard 类型 ====================

/** 仪表盘统计数据 */
export interface DashboardStats {
  totalTerminals: number;
  onlineTerminals: number;
  totalVehicles: number;
  runningVehicles: number;
  todayAlarms: number;
  pendingAlarms: number;
  todayMileage: number;        // 今日里程 km
}

/** 趋势数据点 */
export interface TrendDataPoint {
  time: string;
  value: number;
}

/** 终端在线趋势 */
export interface TerminalTrend {
  online: TrendDataPoint[];
  offline: TrendDataPoint[];
}

// ==================== 设备绑定类型 (从 binding.ts 导出) ====================

export * from './binding';
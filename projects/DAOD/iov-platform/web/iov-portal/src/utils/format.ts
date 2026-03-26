/**
 * 格式化工具函数
 * 
 * @description 常用格式化方法
 * @author daod-team
 */

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
};

/**
 * 格式化数字 (添加千分位)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * 格式化速度 (km/h)
 */
export const formatSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} km/h`;
};

/**
 * 格式化距离 (米/千米)
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

/**
 * 格式化里程 (公里)
 */
export const formatMileage = (km: number): string => {
  if (km < 1000) {
    return `${km.toFixed(1)} km`;
  }
  return `${(km / 1000).toFixed(2)} 万 km`;
};

/**
 * 格式化坐标
 */
export const formatCoordinate = (value: number, type: 'lat' | 'lng'): string => {
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  
  return `${Math.abs(value).toFixed(6)}° ${direction}`;
};

/**
 * 格式化方向 (角度转方向)
 */
export const formatDirection = (degrees: number): string => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * 格式化信号强度
 */
export const formatSignalStrength = (strength: number): string => {
  if (strength >= 4) return '极好';
  if (strength >= 3) return '良好';
  if (strength >= 2) return '一般';
  if (strength >= 1) return '较差';
  return '无信号';
};

/**
 * 格式化电量
 */
export const formatBatteryLevel = (level: number): string => {
  return `${level.toFixed(0)}%`;
};

/**
 * 格式化持续时间 (秒转为可读格式)
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分`;
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}天${hours}小时`;
};

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * 格式化车牌号 (添加空格)
 */
export const formatVehicleNo = (vehicleNo: string): string => {
  // 粤A12345 -> 粤A·12345
  if (vehicleNo.length >= 3) {
    return vehicleNo.slice(0, 2) + '·' + vehicleNo.slice(2);
  }
  return vehicleNo;
};

/**
 * 格式化手机号 (隐藏中间4位)
 */
export const formatPhone = (phone: string): string => {
  if (phone.length === 11) {
    return phone.slice(0, 3) + '****' + phone.slice(7);
  }
  return phone;
};
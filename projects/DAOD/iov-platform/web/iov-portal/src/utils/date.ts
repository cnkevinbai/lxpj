/**
 * 日期工具函数
 * 
 * @description 日期处理方法
 * @author daod-team
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date): string => {
  return formatDateTime(date, 'YYYY-MM-DD');
};

/**
 * 格式化时间
 */
export const formatTime = (date: string | Date): string => {
  return formatDateTime(date, 'HH:mm:ss');
};

/**
 * 相对时间 (如: 3 小时前)
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '-';
  return dayjs(date).fromNow();
};

/**
 * 获取今日日期范围
 */
export const getTodayRange = (): [string, string] => {
  const today = dayjs().startOf('day');
  return [today.toISOString(), today.endOf('day').toISOString()];
};

/**
 * 获取本周日期范围
 */
export const getWeekRange = (): [string, string] => {
  const start = dayjs().startOf('week');
  const end = dayjs().endOf('week');
  return [start.toISOString(), end.toISOString()];
};

/**
 * 获取本月日期范围
 */
export const getMonthRange = (): [string, string] => {
  const start = dayjs().startOf('month');
  const end = dayjs().endOf('month');
  return [start.toISOString(), end.toISOString()];
};

/**
 * 获取最近 N 天日期范围
 */
export const getLastDaysRange = (days: number): [string, string] => {
  const end = dayjs();
  const start = end.subtract(days - 1, 'day').startOf('day');
  return [start.toISOString(), end.toISOString()];
};

/**
 * 判断是否是今天
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断是否是昨天
 */
export const isYesterday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * 判断是否是本周
 */
export const isThisWeek = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'week');
};

/**
 * 计算时间差 (毫秒)
 */
export const getTimeDiff = (startTime: string | Date, endTime?: string | Date): number => {
  const end = endTime ? dayjs(endTime) : dayjs();
  return end.diff(dayjs(startTime));
};

/**
 * 格式化时间差
 */
export const formatTimeDiff = (startTime: string | Date, endTime?: string | Date): string => {
  const diffMs = getTimeDiff(startTime, endTime);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} 天 ${diffHours % 24} 小时`;
  }
  if (diffHours > 0) {
    return `${diffHours} 小时 ${diffMinutes % 60} 分钟`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} 分钟`;
  }
  return `${diffSeconds} 秒`;
};

/**
 * 获取当前时间戳
 */
export const getTimestamp = (): number => {
  return dayjs().valueOf();
};

/**
 * 时间戳转日期
 */
export const timestampToDate = (timestamp: number, format?: string): string => {
  return formatDateTime(dayjs(timestamp).toDate(), format);
};

export { dayjs };
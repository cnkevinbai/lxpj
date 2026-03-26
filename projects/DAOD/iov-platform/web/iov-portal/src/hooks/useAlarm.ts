/**
 * 告警 Hook
 * 
 * @description 告警数据查询和操作
 * @author daod-team
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { get, post } from '@/utils/request';
import type { Alarm, AlarmQueryParams, PageResponse } from '@/types';

// API 方法
const alarmApi = {
  getList: (params: AlarmQueryParams) => 
    get<PageResponse<Alarm>>('/alarms', { params }),
  
  getDetail: (id: string) => 
    get<Alarm>(`/alarms/${id}`),
  
  handle: (id: string, data: { note: string }) => 
    post(`/alarms/${id}/handle`, data),
  
  ignore: (id: string) => 
    post(`/alarms/${id}/ignore`),
  
  batchHandle: (ids: string[], data: { note: string }) => 
    post('/alarms/batch-handle', { ids, ...data }),
};

/**
 * 获取告警列表
 */
export function useAlarms(params: AlarmQueryParams) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alarms', params],
    queryFn: () => alarmApi.getList(params),
  });

  return {
    alarms: data?.list || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
}

/**
 * 获取告警详情
 */
export function useAlarmDetail(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alarm', id],
    queryFn: () => alarmApi.getDetail(id),
    enabled: !!id,
  });

  return {
    alarm: data,
    isLoading,
    refetch,
  };
}

/**
 * 处理告警
 */
export function useHandleAlarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => 
      alarmApi.handle(id, { note }),
    onSuccess: () => {
      message.success('告警已处理');
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
    onError: (error: any) => {
      message.error(error.message || '处理失败');
    },
  });
}

/**
 * 忽略告警
 */
export function useIgnoreAlarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alarmApi.ignore(id),
    onSuccess: () => {
      message.success('告警已忽略');
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
    },
    onError: (error: any) => {
      message.error(error.message || '操作失败');
    },
  });
}

/**
 * 告警级别映射
 */
export const alarmLevelMap = {
  critical: { text: '严重', color: 'error', priority: 1 },
  major: { text: '主要', color: 'warning', priority: 2 },
  minor: { text: '次要', color: 'processing', priority: 3 },
  warning: { text: '警告', color: 'default', priority: 4 },
} as const;

/**
 * 告警状态映射
 */
export const alarmStatusMap = {
  pending: { text: '待处理', color: 'error' },
  processing: { text: '处理中', color: 'processing' },
  resolved: { text: '已解决', color: 'success' },
  ignored: { text: '已忽略', color: 'default' },
} as const;

/**
 * 获取告警级别显示信息
 */
export function getAlarmLevelInfo(level: keyof typeof alarmLevelMap) {
  return alarmLevelMap[level] || { text: '未知', color: 'default', priority: 99 };
}

/**
 * 获取告警状态显示信息
 */
export function getAlarmStatusInfo(status: keyof typeof alarmStatusMap) {
  return alarmStatusMap[status] || { text: '未知', color: 'default' };
}
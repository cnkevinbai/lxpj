/**
 * 告警状态管理
 * 
 * @description 告警列表、未读统计、处理状态
 * @author daod-team
 */

import { create } from 'zustand';
import type { Alarm, AlarmQueryParams, AlarmStatus, AlarmLevel } from '@/types';

interface AlarmState {
  // 状态
  alarms: Alarm[];
  selectedAlarm: Alarm | null;
  filters: AlarmQueryParams;
  loading: boolean;
  total: number;
  
  // 统计
  pendingCount: number;
  todayCount: number;
  criticalCount: number;
  
  // Actions
  setAlarms: (alarms: Alarm[]) => void;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (id: string, data: Partial<Alarm>) => void;
  selectAlarm: (alarm: Alarm | null) => void;
  setFilters: (filters: Partial<AlarmQueryParams>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setTotal: (total: number) => void;
  
  // 处理操作
  resolveAlarm: (id: string, handler: string, note: string) => void;
  ignoreAlarm: (id: string) => void;
  
  // 实时更新
  addNewAlarm: (alarm: Alarm) => void;
  
  // Getters
  getPendingAlarms: () => Alarm[];
  getCriticalAlarms: () => Alarm[];
}

const defaultFilters: AlarmQueryParams = {
  page: 1,
  pageSize: 20,
  keyword: '',
  type: undefined,
  level: undefined,
  status: undefined,
  timeRange: undefined,
};

export const useAlarmStore = create<AlarmState>((set, get) => ({
  // 初始状态
  alarms: [],
  selectedAlarm: null,
  filters: defaultFilters,
  loading: false,
  total: 0,
  pendingCount: 0,
  todayCount: 0,
  criticalCount: 0,
  
  // 设置告警列表
  setAlarms: (alarms: Alarm[]) => {
    const pendingCount = alarms.filter(a => a.status === 'pending').length;
    const criticalCount = alarms.filter(a => a.level === 'critical' && a.status === 'pending').length;
    
    set({ alarms, pendingCount, criticalCount });
  },
  
  // 添加告警
  addAlarm: (alarm: Alarm) => {
    const { alarms } = get();
    set({ alarms: [alarm, ...alarms] });
  },
  
  // 更新告警
  updateAlarm: (id: string, data: Partial<Alarm>) => {
    const { alarms, selectedAlarm } = get();
    const updatedAlarms = alarms.map(a => 
      a.id === id ? { ...a, ...data } : a
    );
    
    const updatedSelected = selectedAlarm?.id === id 
      ? { ...selectedAlarm, ...data }
      : selectedAlarm;
    
    // 重新计算统计
    const pendingCount = updatedAlarms.filter(a => a.status === 'pending').length;
    const criticalCount = updatedAlarms.filter(a => a.level === 'critical' && a.status === 'pending').length;
    
    set({ 
      alarms: updatedAlarms, 
      selectedAlarm: updatedSelected,
      pendingCount,
      criticalCount,
    });
  },
  
  // 选择告警
  selectAlarm: (alarm: Alarm | null) => {
    set({ selectedAlarm: alarm });
  },
  
  // 设置筛选条件
  setFilters: (filters: Partial<AlarmQueryParams>) => {
    const { filters: currentFilters } = get();
    set({ filters: { ...currentFilters, ...filters } });
  },
  
  // 重置筛选条件
  resetFilters: () => {
    set({ filters: defaultFilters });
  },
  
  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  // 设置总数
  setTotal: (total: number) => {
    set({ total });
  },
  
  // 解决告警
  resolveAlarm: (id: string, handler: string, note: string) => {
    const { updateAlarm } = get();
    updateAlarm(id, {
      status: 'resolved' as AlarmStatus,
      handler,
      handleNote: note,
      handleTime: new Date().toISOString(),
    });
  },
  
  // 忽略告警
  ignoreAlarm: (id: string) => {
    const { updateAlarm } = get();
    updateAlarm(id, {
      status: 'ignored' as AlarmStatus,
      handleTime: new Date().toISOString(),
    });
  },
  
  // 添加新告警 (实时推送)
  addNewAlarm: (alarm: Alarm) => {
    const { alarms, pendingCount, criticalCount } = get();
    const newPendingCount = pendingCount + 1;
    const newCriticalCount = alarm.level === 'critical' ? criticalCount + 1 : criticalCount;
    
    set({
      alarms: [alarm, ...alarms],
      pendingCount: newPendingCount,
      criticalCount: newCriticalCount,
    });
  },
  
  // 获取待处理告警
  getPendingAlarms: (): Alarm[] => {
    const { alarms } = get();
    return alarms.filter(a => a.status === 'pending');
  },
  
  // 获取严重告警
  getCriticalAlarms: (): Alarm[] => {
    const { alarms } = get();
    return alarms.filter(a => a.level === 'critical' && a.status === 'pending');
  },
}));
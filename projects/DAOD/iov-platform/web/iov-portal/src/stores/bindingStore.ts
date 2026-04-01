/**
 * 设备绑定状态管理
 * 
 * @description 设备绑定的状态管理，支持三种协议 (JT/T 808、MQTT、HTTP)
 * @author 渔晓白
 * @version 1.0.0
 */

import { create } from 'zustand';
import type {
  DeviceBinding,
  PendingTerminal,
  BindingEvent,
  BindingStatistics,
  BindingStatus,
  ProtocolType,
  BindDeviceRequest,
} from '@/types/binding';
import * as bindingService from '@/services/binding';

interface BindingState {
  // 状态
  bindings: DeviceBinding[];
  pendingTerminals: PendingTerminal[];
  selectedBinding: DeviceBinding | null;
  bindingEvents: BindingEvent[];
  statistics: BindingStatistics | null;
  
  // 加载状态
  loading: boolean;
  pendingLoading: boolean;
  eventsLoading: boolean;
  
  // 筛选条件
  filters: {
    keyword?: string;
    status?: BindingStatus;
    protocol?: ProtocolType;
  };
  
  // 统计
  totalBindings: number;
  totalPending: number;
  
  // Actions
  fetchBindings: (filters?: BindingState['filters']) => Promise<void>;
  fetchPendingTerminals: () => Promise<void>;
  fetchBindingEvents: (bindingId: string) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  
  bindDevice: (terminalId: string, data: BindDeviceRequest) => Promise<boolean>;
  unbindDevice: (bindingId: string, reason: string) => Promise<boolean>;
  
  selectBinding: (binding: DeviceBinding | null) => void;
  setFilters: (filters: Partial<BindingState['filters']>) => void;
  resetFilters: () => void;
  
  // 实时更新
  updateBindingStatus: (bindingId: string, status: BindingStatus) => void;
  updatePendingTerminalStatus: (terminalId: string, status: 'pending' | 'bound' | 'rejected') => void;
  addPendingTerminal: (terminal: PendingTerminal) => void;
  removePendingTerminal: (terminalId: string) => void;
  
  // Getters
  getBindingById: (bindingId: string) => DeviceBinding | undefined;
  getBindingsByProtocol: (protocol: ProtocolType) => DeviceBinding[];
  getBindingsByStatus: (status: BindingStatus) => DeviceBinding[];
  getOnlineBindings: () => DeviceBinding[];
  getOfflineBindings: () => DeviceBinding[];
}

const defaultFilters: BindingState['filters'] = {
  keyword: '',
  status: undefined,
  protocol: undefined,
};

export const useBindingStore = create<BindingState>((set, get) => ({
  // 初始状态
  bindings: [],
  pendingTerminals: [],
  selectedBinding: null,
  bindingEvents: [],
  statistics: null,
  
  loading: false,
  pendingLoading: false,
  eventsLoading: false,
  
  filters: defaultFilters,
  
  totalBindings: 0,
  totalPending: 0,
  
  // 获取绑定列表
  fetchBindings: async (filters?: BindingState['filters']) => {
    set({ loading: true });
    
    try {
      const currentFilters = filters || get().filters;
      const result = await bindingService.getBindings({
        keyword: currentFilters.keyword,
        status: currentFilters.status,
        protocol: currentFilters.protocol,
      });
      
      set({
        bindings: result.list,
        totalBindings: result.total,
        loading: false,
      });
    } catch (error) {
      console.error('获取绑定列表失败:', error);
      set({ loading: false });
    }
  },
  
  // 获取待绑定终端
  fetchPendingTerminals: async () => {
    set({ pendingLoading: true });
    
    try {
      const result = await bindingService.getPendingTerminals({ status: 'pending' });
      
      set({
        pendingTerminals: result.list,
        totalPending: result.total,
        pendingLoading: false,
      });
    } catch (error) {
      console.error('获取待绑定终端失败:', error);
      set({ pendingLoading: false });
    }
  },
  
  // 获取绑定事件
  fetchBindingEvents: async (bindingId: string) => {
    set({ eventsLoading: true });
    
    try {
      const result = await bindingService.getBindingEvents(bindingId);
      
      set({
        bindingEvents: result.list,
        eventsLoading: false,
      });
    } catch (error) {
      console.error('获取绑定事件失败:', error);
      set({ eventsLoading: false });
    }
  },
  
  // 获取统计信息
  fetchStatistics: async () => {
    try {
      const stats = await bindingService.getBindingStatistics();
      set({ statistics: stats });
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  },
  
  // 绑定设备
  bindDevice: async (terminalId: string, data: BindDeviceRequest) => {
    try {
      const result = await bindingService.bindDevice(terminalId, data);
      
      if (result.success && result.data) {
        // 更新列表
        const { bindings, pendingTerminals } = get();
        
        set({
          bindings: [...bindings, result.data!],
          pendingTerminals: pendingTerminals.filter((t) => t.terminalId !== terminalId),
          totalPending: Math.max(0, get().totalPending - 1),
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('绑定设备失败:', error);
      return false;
    }
  },
  
  // 解绑设备
  unbindDevice: async (bindingId: string, reason: string) => {
    try {
      const result = await bindingService.unbindDevice(bindingId, reason);
      
      if (result.success) {
        // 更新绑定状态
        const { bindings } = get();
        const updatedBindings = bindings.map((b) =>
          b.bindingId === bindingId ? { ...b, status: 'UNBOUND' as BindingStatus } : b
        );
        
        set({ bindings: updatedBindings });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('解绑设备失败:', error);
      return false;
    }
  },
  
  // 选择绑定
  selectBinding: (binding: DeviceBinding | null) => {
    set({ selectedBinding: binding });
    
    // 如果选择了绑定，加载事件历史
    if (binding) {
      get().fetchBindingEvents(binding.bindingId);
    }
  },
  
  // 设置筛选条件
  setFilters: (filters: Partial<BindingState['filters']>) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...filters } });
  },
  
  // 重置筛选条件
  resetFilters: () => {
    set({ filters: defaultFilters });
  },
  
  // 更新绑定状态 (实时)
  updateBindingStatus: (bindingId: string, status: BindingStatus) => {
    const { bindings, selectedBinding } = get();
    
    const updatedBindings = bindings.map((b) =>
      b.bindingId === bindingId ? { ...b, status } : b
    );
    
    const updatedSelected =
      selectedBinding?.bindingId === bindingId
        ? { ...selectedBinding, status }
        : selectedBinding;
    
    set({ bindings: updatedBindings, selectedBinding: updatedSelected });
  },
  
  // 更新待绑定终端状态 (实时)
  updatePendingTerminalStatus: (
    terminalId: string,
    status: 'pending' | 'bound' | 'rejected'
  ) => {
    const { pendingTerminals } = get();
    
    const updatedTerminals = pendingTerminals.map((t) =>
      t.terminalId === terminalId ? { ...t, status } : t
    );
    
    set({ pendingTerminals: updatedTerminals });
  },
  
  // 添加待绑定终端 (实时)
  addPendingTerminal: (terminal: PendingTerminal) => {
    const { pendingTerminals } = get();
    set({
      pendingTerminals: [terminal, ...pendingTerminals],
      totalPending: get().totalPending + 1,
    });
  },
  
  // 移除待绑定终端
  removePendingTerminal: (terminalId: string) => {
    const { pendingTerminals } = get();
    set({
      pendingTerminals: pendingTerminals.filter((t) => t.terminalId !== terminalId),
      totalPending: Math.max(0, get().totalPending - 1),
    });
  },
  
  // 根据 ID 获取绑定
  getBindingById: (bindingId: string): DeviceBinding | undefined => {
    return get().bindings.find((b) => b.bindingId === bindingId);
  },
  
  // 根据协议获取绑定
  getBindingsByProtocol: (protocol: ProtocolType): DeviceBinding[] => {
    return get().bindings.filter((b) => b.protocol === protocol);
  },
  
  // 根据状态获取绑定
  getBindingsByStatus: (status: BindingStatus): DeviceBinding[] => {
    return get().bindings.filter((b) => b.status === status);
  },
  
  // 获取在线绑定
  getOnlineBindings: (): DeviceBinding[] => {
    return get().bindings.filter(
      (b) => b.status === 'BOUND' || b.status === 'PENDING_RECOVER'
    );
  },
  
  // 获取离线绑定
  getOfflineBindings: (): DeviceBinding[] => {
    return get().bindings.filter((b) => b.status === 'EXPIRED' || b.status === 'ERROR');
  },
}));
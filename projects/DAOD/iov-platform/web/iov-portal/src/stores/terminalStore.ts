/**
 * 终端状态管理
 * 
 * @description 终端列表、选中状态、筛选条件
 * @author daod-team
 */

import { create } from 'zustand';
import type { Terminal, TerminalQueryParams, TerminalStatus } from '@/types';

interface TerminalState {
  // 状态
  terminals: Terminal[];
  selectedTerminal: Terminal | null;
  filters: TerminalQueryParams;
  loading: boolean;
  total: number;
  
  // 统计
  onlineCount: number;
  offlineCount: number;
  faultCount: number;
  
  // Actions
  setTerminals: (terminals: Terminal[]) => void;
  addTerminal: (terminal: Terminal) => void;
  updateTerminal: (id: string, data: Partial<Terminal>) => void;
  removeTerminal: (id: string) => void;
  selectTerminal: (terminal: Terminal | null) => void;
  setFilters: (filters: Partial<TerminalQueryParams>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setTotal: (total: number) => void;
  
  // 实时更新
  updateTerminalStatus: (terminalId: string, status: TerminalStatus) => void;
  updateTerminalLocation: (terminalId: string, location: { lat: number; lng: number }) => void;
  
  // Getters
  getTerminalById: (id: string) => Terminal | undefined;
  getOnlineTerminals: () => Terminal[];
  getOfflineTerminals: () => Terminal[];
}

const defaultFilters: TerminalQueryParams = {
  page: 1,
  pageSize: 20,
  keyword: '',
  status: undefined,
  vehicleNo: '',
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  // 初始状态
  terminals: [],
  selectedTerminal: null,
  filters: defaultFilters,
  loading: false,
  total: 0,
  onlineCount: 0,
  offlineCount: 0,
  faultCount: 0,
  
  // 设置终端列表
  setTerminals: (terminals: Terminal[]) => {
    // 计算统计
    const onlineCount = terminals.filter(t => t.status === 'online').length;
    const offlineCount = terminals.filter(t => t.status === 'offline').length;
    const faultCount = terminals.filter(t => t.status === 'fault').length;
    
    set({ terminals, onlineCount, offlineCount, faultCount });
  },
  
  // 添加终端
  addTerminal: (terminal: Terminal) => {
    const { terminals } = get();
    set({ terminals: [...terminals, terminal] });
  },
  
  // 更新终端
  updateTerminal: (id: string, data: Partial<Terminal>) => {
    const { terminals, selectedTerminal } = get();
    const updatedTerminals = terminals.map(t => 
      t.id === id ? { ...t, ...data } : t
    );
    
    // 更新选中终端
    const updatedSelected = selectedTerminal?.id === id 
      ? { ...selectedTerminal, ...data }
      : selectedTerminal;
    
    set({ terminals: updatedTerminals, selectedTerminal: updatedSelected });
  },
  
  // 移除终端
  removeTerminal: (id: string) => {
    const { terminals, selectedTerminal } = get();
    set({
      terminals: terminals.filter(t => t.id !== id),
      selectedTerminal: selectedTerminal?.id === id ? null : selectedTerminal,
    });
  },
  
  // 选择终端
  selectTerminal: (terminal: Terminal | null) => {
    set({ selectedTerminal: terminal });
  },
  
  // 设置筛选条件
  setFilters: (filters: Partial<TerminalQueryParams>) => {
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
  
  // 更新终端状态 (实时)
  updateTerminalStatus: (terminalId: string, status: TerminalStatus) => {
    const { updateTerminal } = get();
    updateTerminal(terminalId, { status });
  },
  
  // 更新终端位置 (实时)
  updateTerminalLocation: (terminalId: string, location: { lat: number; lng: number }) => {
    const { updateTerminal } = get();
    updateTerminal(terminalId, { location });
  },
  
  // 根据 ID 获取终端
  getTerminalById: (id: string): Terminal | undefined => {
    const { terminals } = get();
    return terminals.find(t => t.id === id);
  },
  
  // 获取在线终端
  getOnlineTerminals: (): Terminal[] => {
    const { terminals } = get();
    return terminals.filter(t => t.status === 'online');
  },
  
  // 获取离线终端
  getOfflineTerminals: (): Terminal[] => {
    const { terminals } = get();
    return terminals.filter(t => t.status === 'offline');
  },
}));
/**
 * 终端 Hook
 * 
 * @description 终端数据查询和操作
 * @author daod-team
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { get, post } from '@/utils/request';
import type { Terminal, TerminalDetail, TerminalQueryParams, PageResponse } from '@/types';

// API 方法
const terminalApi = {
  getList: (params: TerminalQueryParams) => 
    get<PageResponse<Terminal>>('/terminals', { params }),
  
  getDetail: (id: string) => 
    get<TerminalDetail>(`/terminals/${id}`),
  
  sendCommand: (terminalId: string, command: string, params?: any) => 
    post(`/terminals/${terminalId}/command`, { command, params }),
};

/**
 * 获取终端列表
 */
export function useTerminals(params: TerminalQueryParams) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['terminals', params],
    queryFn: () => terminalApi.getList(params),
    refetchInterval: 30000, // 30秒刷新
  });

  return {
    terminals: data?.list || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
}

/**
 * 获取终端详情
 */
export function useTerminalDetail(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['terminal', id],
    queryFn: () => terminalApi.getDetail(id),
    enabled: !!id,
  });

  return {
    terminal: data,
    isLoading,
    refetch,
  };
}

/**
 * 发送指令
 */
export function useSendCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ terminalId, command, params }: {
      terminalId: string;
      command: string;
      params?: any;
    }) => terminalApi.sendCommand(terminalId, command, params),
    onSuccess: () => {
      message.success('指令发送成功');
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
    onError: (error: any) => {
      message.error(error.message || '指令发送失败');
    },
  });
}

/**
 * 终端状态映射
 */
export const terminalStatusMap = {
  online: { text: '在线', color: 'success' },
  offline: { text: '离线', color: 'default' },
  fault: { text: '故障', color: 'error' },
  sleep: { text: '休眠', color: 'warning' },
} as const;

/**
 * 获取终端状态显示信息
 */
export function getTerminalStatusInfo(status: keyof typeof terminalStatusMap) {
  return terminalStatusMap[status] || { text: '未知', color: 'default' };
}
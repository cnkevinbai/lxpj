/**
 * 车辆 Hook
 * 
 * @description 车辆数据查询和操作
 * @author daod-team
 */

import { useQuery } from '@tanstack/react-query';
import { get } from '@/utils/request';
import type { Vehicle, VehicleQueryParams, PageResponse } from '@/types';

// API 方法
const vehicleApi = {
  getList: (params: VehicleQueryParams) => 
    get<PageResponse<Vehicle>>('/vehicles', { params }),
  
  getDetail: (id: string) => 
    get<Vehicle>(`/vehicles/${id}`),
  
  getLocation: (id: string) => 
    get<{ location: any; speed: number }>(`/vehicles/${id}/location`),
};

/**
 * 获取车辆列表
 */
export function useVehicles(params: VehicleQueryParams) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleApi.getList(params),
    refetchInterval: 30000,
  });

  return {
    vehicles: data?.list || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
}

/**
 * 获取车辆详情
 */
export function useVehicleDetail(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleApi.getDetail(id),
    enabled: !!id,
  });

  return {
    vehicle: data,
    isLoading,
    refetch,
  };
}

/**
 * 获取车辆实时位置
 */
export function useVehicleLocation(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicle-location', id],
    queryFn: () => vehicleApi.getLocation(id),
    enabled: !!id,
    refetchInterval: 5000, // 5秒刷新
  });

  return {
    location: data?.location,
    speed: data?.speed,
    isLoading,
    refetch,
  };
}

/**
 * 车辆状态映射
 */
export const vehicleStatusMap = {
  running: { text: '行驶中', color: 'processing' },
  stopped: { text: '停止', color: 'default' },
  charging: { text: '充电中', color: 'success' },
  fault: { text: '故障', color: 'error' },
  offline: { text: '离线', color: 'warning' },
} as const;

/**
 * 获取车辆状态显示信息
 */
export function getVehicleStatusInfo(status: keyof typeof vehicleStatusMap) {
  return vehicleStatusMap[status] || { text: '未知', color: 'default' };
}
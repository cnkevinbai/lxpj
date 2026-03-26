/**
 * 地图状态管理
 * 
 * @description 地图视图、标记、聚类
 * @author daod-team
 */

import { create } from 'zustand';
import type { GeoPoint, MapBounds, MapMarker } from '@/types';

interface MapState {
  // 视图状态
  center: GeoPoint;
  zoom: number;
  bounds: MapBounds | null;
  
  // 标记
  markers: MapMarker[];
  selectedMarker: MapMarker | null;
  
  // 聚类
  clusteringEnabled: boolean;
  
  // 地图模式
  mode: 'view' | 'draw' | 'measure';
  drawType: 'circle' | 'polygon' | 'rectangle' | null;
  
  // Actions
  setCenter: (center: GeoPoint) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  
  setMarkers: (markers: MapMarker[]) => void;
  addMarker: (marker: MapMarker) => void;
  updateMarker: (id: string, data: Partial<MapMarker>) => void;
  removeMarker: (id: string) => void;
  selectMarker: (marker: MapMarker | null) => void;
  clearMarkers: () => void;
  
  setClusteringEnabled: (enabled: boolean) => void;
  setMode: (mode: MapState['mode']) => void;
  setDrawType: (type: MapState['drawType']) => void;
  
  // 视图操作
  fitBounds: (bounds: MapBounds) => void;
  panTo: (location: GeoPoint) => void;
  flyTo: (location: GeoPoint, zoom?: number) => void;
}

const defaultCenter: GeoPoint = {
  lat: 30.123456,
  lng: 103.845678,
};

export const useMapStore = create<MapState>((set) => ({
  // 初始状态
  center: defaultCenter,
  zoom: 11,
  bounds: null,
  markers: [],
  selectedMarker: null,
  clusteringEnabled: true,
  mode: 'view',
  drawType: null,
  
  // 设置中心点
  setCenter: (center: GeoPoint) => {
    set({ center });
  },
  
  // 设置缩放级别
  setZoom: (zoom: number) => {
    set({ zoom });
  },
  
  // 设置边界
  setBounds: (bounds: MapBounds) => {
    set({ bounds });
  },
  
  // 设置标记
  setMarkers: (markers: MapMarker[]) => {
    set({ markers });
  },
  
  // 添加标记
  addMarker: (marker: MapMarker) => {
    const { markers } = useMapStore.getState();
    set({ markers: [...markers, marker] });
  },
  
  // 更新标记
  updateMarker: (id: string, data: Partial<MapMarker>) => {
    const { markers } = useMapStore.getState();
    const updatedMarkers = markers.map(m => 
      m.id === id ? { ...m, ...data } : m
    );
    set({ markers: updatedMarkers });
  },
  
  // 移除标记
  removeMarker: (id: string) => {
    const { markers } = useMapStore.getState();
    set({ markers: markers.filter(m => m.id !== id) });
  },
  
  // 选择标记
  selectMarker: (marker: MapMarker | null) => {
    set({ selectedMarker: marker });
  },
  
  // 清空标记
  clearMarkers: () => {
    set({ markers: [], selectedMarker: null });
  },
  
  // 设置聚类开关
  setClusteringEnabled: (enabled: boolean) => {
    set({ clusteringEnabled: enabled });
  },
  
  // 设置模式
  setMode: (mode: MapState['mode']) => {
    set({ mode, drawType: mode === 'draw' ? null : useMapStore.getState().drawType });
  },
  
  // 设置绘制类型
  setDrawType: (type: MapState['drawType']) => {
    set({ drawType: type });
  },
  
  // 适配边界
  fitBounds: (bounds: MapBounds) => {
    // 计算中心点和缩放级别
    const center: GeoPoint = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
    set({ center, bounds });
  },
  
  // 平移到位置
  panTo: (location: GeoPoint) => {
    set({ center: location });
  },
  
  // 飞行到位置
  flyTo: (location: GeoPoint, zoom?: number) => {
    set({ 
      center: location,
      ...(zoom !== undefined && { zoom }),
    });
  },
}));
/**
 * 地图 Hook
 * 
 * @description 地图操作封装
 * @author daod-team
 */

import { useCallback, useRef, useState } from 'react';
import type { GeoPoint, MapBounds } from '@/types';

interface UseMapOptions {
  defaultCenter?: GeoPoint;
  defaultZoom?: number;
}

interface UseMapReturn {
  center: GeoPoint;
  zoom: number;
  bounds: MapBounds | null;
  setCenter: (center: GeoPoint) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  panTo: (location: GeoPoint) => void;
  flyTo: (location: GeoPoint, zoom?: number) => void;
  fitBounds: (bounds: MapBounds) => void;
  getCenter: () => GeoPoint;
  getZoom: () => number;
  getBounds: () => MapBounds | null;
}

export function useMap(options: UseMapOptions = {}): UseMapReturn {
  const {
    defaultCenter = { lat: 30.123456, lng: 103.845678 },
    defaultZoom = 11,
  } = options;

  const [center, setCenter] = useState<GeoPoint>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  
  const mapRef = useRef<any>(null);

  // 平移到指定位置
  const panTo = useCallback((location: GeoPoint) => {
    setCenter(location);
    if (mapRef.current) {
      mapRef.current.panTo([location.lat, location.lng]);
    }
  }, []);

  // 飞行到指定位置
  const flyTo = useCallback((location: GeoPoint, newZoom?: number) => {
    setCenter(location);
    if (newZoom !== undefined) {
      setZoom(newZoom);
    }
    if (mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], newZoom ?? zoom);
    }
  }, [zoom]);

  // 适配边界
  const fitBounds = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds);
    const newCenter: GeoPoint = {
      lat: (newBounds.north + newBounds.south) / 2,
      lng: (newBounds.east + newBounds.west) / 2,
    };
    setCenter(newCenter);
  }, []);

  // 获取中心点
  const getCenter = useCallback(() => center, [center]);

  // 获取缩放级别
  const getZoom = useCallback(() => zoom, [zoom]);

  // 获取边界
  const getBounds = useCallback(() => bounds, [bounds]);

  return {
    center,
    zoom,
    bounds,
    setCenter,
    setZoom,
    setBounds,
    panTo,
    flyTo,
    fitBounds,
    getCenter,
    getZoom,
    getBounds,
  };
}

/**
 * 计算两点之间的距离 (Haversine 公式)
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371000; // 地球半径 (米)
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 距离 (米)
}

/**
 * 计算边界框中心点
 */
export function getBoundsCenter(bounds: MapBounds): GeoPoint {
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}

/**
 * 检查点是否在边界框内
 */
export function isPointInBounds(point: GeoPoint, bounds: MapBounds): boolean {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
}
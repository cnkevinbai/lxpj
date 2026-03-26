package com.daod.iov.modules.planning.api;

import com.daod.iov.modules.planning.api.dto.*;
import java.util.List;

/**
 * 路径规划服务接口
 * 
 * 提供多策略路径规划能力
 */
public interface RoutePlanner {
    
    /**
     * 规划单条路径
     * 
     * @param request 规划请求
     * @return 规划结果
     * @throws PlanningException 规划失败
     */
    RoutePlanResult plan(RoutePlanRequest request) throws PlanningException;
    
    /**
     * 批量规划路径
     * 
     * @param requests 规划请求列表
     * @return 规划结果列表
     */
    List<RoutePlanResult> batchPlan(List<RoutePlanRequest> requests);
    
    /**
     * 计算距离矩阵
     * 
     * @param points 点位列表
     * @return 距离矩阵 (单位: 米)
     */
    long[][] computeDistanceMatrix(List<GeoPoint> points);
    
    /**
     * 检查服务是否就绪
     */
    boolean isReady();
    
    /**
     * 获取支持的规划策略
     */
    List<RouteStrategy> getSupportedStrategies();
}
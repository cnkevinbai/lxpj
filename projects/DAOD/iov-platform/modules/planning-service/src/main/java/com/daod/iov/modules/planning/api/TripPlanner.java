package com.daod.iov.modules.planning.api;

import com.daod.iov.modules.planning.api.dto.*;
import java.util.List;

/**
 * 行程规划服务接口
 * 
 * 多途经点行程规划，解决 TSP 问题
 */
public interface TripPlanner {
    
    /**
     * 规划行程
     * 
     * @param request 行程规划请求
     * @return 行程规划结果
     * @throws PlanningException 规划失败
     */
    TripPlanResult plan(TripPlanRequest request) throws PlanningException;
    
    /**
     * 批量规划行程
     * 
     * @param requests 请求列表
     * @return 结果列表
     */
    List<TripPlanResult> batchPlan(List<TripPlanRequest> requests);
    
    /**
     * 估算行程时长
     * 
     * @param request 请求
     * @return 时长估算
     */
    TripDurationEstimation estimateDuration(TripPlanRequest request);
}